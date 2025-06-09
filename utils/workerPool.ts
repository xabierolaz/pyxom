// Worker Pool Management System for PyXom
// Implements critical order 7: 3-worker pool system for parallel execution

interface WorkerTask {
  id: string;
  code: string;
  timeout: number;
  resolve: (result: any) => void;
  reject: (error: any) => void;
  startTime: number;
}

interface WorkerInfo {
  worker: Worker;
  busy: boolean;
  currentTask: WorkerTask | null;
  lastUsed: number;
}

class WorkerPool {
  private workers: WorkerInfo[] = [];
  private taskQueue: WorkerTask[] = [];
  private maxWorkers = 3;
  private maxIdleTime = 300000; // 5 minutes
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Create initial worker pool
    for (let i = 0; i < this.maxWorkers; i++) {
      this.createWorker();
    }

    // Start cleanup interval
    this.cleanupInterval = setInterval(() => {
      this.cleanupIdleWorkers();
    }, 60000); // Check every minute
  }

  private createWorker(): WorkerInfo {
    const worker = new Worker('/workers/python-worker.js');
    
    const workerInfo: WorkerInfo = {
      worker,
      busy: false,
      currentTask: null,
      lastUsed: Date.now()
    };

    worker.onmessage = (event) => {
      this.handleWorkerMessage(workerInfo, event);
    };

    worker.onerror = (error) => {
      this.handleWorkerError(workerInfo, error);
    };

    this.workers.push(workerInfo);
    return workerInfo;
  }

  private handleWorkerMessage(workerInfo: WorkerInfo, event: MessageEvent) {
    if (!workerInfo.currentTask) return;

    const { result, error, type } = event.data;
    const task = workerInfo.currentTask;

    if (type === 'execution_complete') {
      if (error) {
        task.reject(new Error(error));
      } else {
        task.resolve(result);
      }
      
      this.releaseWorker(workerInfo);
      this.processQueue();
    } else if (type === 'execution_progress') {
      // Handle progress updates if needed
      console.log(`Worker progress: ${result.progress}%`);
    }
  }

  private handleWorkerError(workerInfo: WorkerInfo, error: ErrorEvent) {
    console.error('Worker error:', error);
    
    if (workerInfo.currentTask) {
      workerInfo.currentTask.reject(error);
    }

    // Remove and recreate the worker
    this.removeWorker(workerInfo);
    this.createWorker();
    this.processQueue();
  }

  private releaseWorker(workerInfo: WorkerInfo) {
    workerInfo.busy = false;
    workerInfo.currentTask = null;
    workerInfo.lastUsed = Date.now();
  }

  private removeWorker(workerInfo: WorkerInfo) {
    const index = this.workers.indexOf(workerInfo);
    if (index > -1) {
      workerInfo.worker.terminate();
      this.workers.splice(index, 1);
    }
  }

  private getAvailableWorker(): WorkerInfo | null {
    return this.workers.find(w => !w.busy) || null;
  }

  private processQueue() {
    if (this.taskQueue.length === 0) return;

    const availableWorker = this.getAvailableWorker();
    if (!availableWorker) return;

    const task = this.taskQueue.shift();
    if (!task) return;

    // Check if task has timed out while in queue
    if (Date.now() - task.startTime > task.timeout) {
      task.reject(new Error('Task timeout in queue'));
      this.processQueue(); // Try next task
      return;
    }

    this.executeTaskOnWorker(availableWorker, task);
  }

  private executeTaskOnWorker(workerInfo: WorkerInfo, task: WorkerTask) {
    workerInfo.busy = true;
    workerInfo.currentTask = task;
    workerInfo.lastUsed = Date.now();

    // Set timeout for the task
    const timeoutId = setTimeout(() => {
      if (workerInfo.currentTask === task) {
        task.reject(new Error('Task execution timeout'));
        this.releaseWorker(workerInfo);
        this.processQueue();
      }
    }, task.timeout);

    // Send task to worker
    workerInfo.worker.postMessage({
      type: 'execute_python',
      code: task.code,
      taskId: task.id,
      timeout: task.timeout
    });

    // Store timeout ID for cleanup
    (task as any).timeoutId = timeoutId;
  }

  private cleanupIdleWorkers() {
    const now = Date.now();
    const workersToRemove: WorkerInfo[] = [];

    for (const worker of this.workers) {
      if (!worker.busy && now - worker.lastUsed > this.maxIdleTime) {
        workersToRemove.push(worker);
      }
    }

    // Keep at least one worker
    if (this.workers.length - workersToRemove.length < 1) {
      workersToRemove.pop();
    }

    workersToRemove.forEach(worker => {
      this.removeWorker(worker);
    });
  }

  public async executeCode(code: string, timeout: number = 10000): Promise<any> {
    return new Promise((resolve, reject) => {
      const task: WorkerTask = {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        code,
        timeout,
        resolve,
        reject,
        startTime: Date.now()
      };

      const availableWorker = this.getAvailableWorker();
      if (availableWorker) {
        this.executeTaskOnWorker(availableWorker, task);
      } else {
        this.taskQueue.push(task);
      }
    });
  }

  public getPoolStatus() {
    return {
      totalWorkers: this.workers.length,
      busyWorkers: this.workers.filter(w => w.busy).length,
      queueLength: this.taskQueue.length,
      workers: this.workers.map(w => ({
        busy: w.busy,
        lastUsed: w.lastUsed,
        currentTask: w.currentTask?.id || null
      }))
    };
  }

  public terminate() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.workers.forEach(worker => {
      worker.worker.terminate();
    });

    this.workers = [];
    this.taskQueue = [];
  }
}

// Global worker pool instance
let workerPoolInstance: WorkerPool | null = null;

export const getWorkerPool = (): WorkerPool => {
  if (!workerPoolInstance) {
    workerPoolInstance = new WorkerPool();
  }
  return workerPoolInstance;
};

export const terminateWorkerPool = () => {
  if (workerPoolInstance) {
    workerPoolInstance.terminate();
    workerPoolInstance = null;
  }
};

export type { WorkerTask, WorkerInfo };
