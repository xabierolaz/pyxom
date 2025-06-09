// Enhanced Monaco Loading Manager - Fixes cascading loading delays
'use client';

import { EventEmitter } from 'events';

export interface MonacoLoadingState {
  status: 'idle' | 'preloading' | 'loading' | 'ready' | 'error';
  progress: number;
  stage: string;
  error?: string;
  loadTime?: number;
}

class MonacoLoadingManager extends EventEmitter {
  private state: MonacoLoadingState = {
    status: 'idle',
    progress: 0,
    stage: 'Initializing...'
  };

  private loadPromise: Promise<boolean> | null = null;
  private startTime: number = 0;
  private monaco: any = null;

  constructor() {
    super();
    this.setMaxListeners(50); // Support many components listening
  }

  getState(): MonacoLoadingState {
    return { ...this.state };
  }

  isReady(): boolean {
    return this.state.status === 'ready' && this.monaco;
  }

  getMonaco(): any {
    return this.monaco;
  }

  // Main loading method - called by all components
  async ensureMonacoLoaded(): Promise<boolean> {
    // If already loading, return existing promise
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // If already ready, return immediately
    if (this.isReady()) {
      return true;
    }

    // Start loading process
    this.loadPromise = this.loadMonacoWithProgress();
    return this.loadPromise;
  }

  private async loadMonacoWithProgress(): Promise<boolean> {
    try {
      this.startTime = Date.now();
      this.updateState({
        status: 'preloading',
        progress: 10,
        stage: 'Checking Monaco availability...'
      });

      // Check if Monaco is already loaded globally
      if (typeof window !== 'undefined' && (window as any).monaco) {
        this.monaco = (window as any).monaco;
        this.updateState({
          status: 'ready',
          progress: 100,
          stage: 'Monaco ready!',
          loadTime: Date.now() - this.startTime
        });
        return true;
      }

      this.updateState({
        status: 'loading',
        progress: 20,
        stage: 'Loading Monaco from CDN...'
      });

      // Try multiple loading strategies simultaneously
      const loadingStrategies = [
        this.loadViaReactMonaco(),
        this.loadViaDirectCDN(),
        this.loadViaFallbackCDN()
      ];

      // Use Promise.any to get the first successful load
      const result = await Promise.any(loadingStrategies);
        if (result) {
        this.updateState({
          status: 'ready',
          progress: 100,
          stage: 'Monaco ready!',
          loadTime: Date.now() - this.startTime
        });
        
        // Emit global event for performance tracking
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('monaco-ready', {
            detail: { loadTime: Date.now() - this.startTime }
          }));
        }
        
        return true;
      }

      throw new Error('All loading strategies failed');

    } catch (error) {
      this.updateState({
        status: 'error',
        progress: 0,
        stage: 'Loading failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        loadTime: Date.now() - this.startTime
      });
      return false;
    }
  }

  private async loadViaReactMonaco(): Promise<boolean> {
    try {
      this.updateState({
        progress: 30,
        stage: 'Loading @monaco-editor/react...'
      });

      const { default: Editor } = await import('@monaco-editor/react');
      
      // Preload Monaco
      const monaco = await import('monaco-editor');
      this.monaco = monaco;

      this.updateState({
        progress: 70,
        stage: 'Monaco Editor loaded via React wrapper'
      });

      return true;
    } catch (error) {
      console.warn('React Monaco loading failed:', error);
      throw error;
    }
  }

  private async loadViaDirectCDN(): Promise<boolean> {
    try {
      this.updateState({
        progress: 40,
        stage: 'Loading Monaco via direct CDN...'
      });

      // Use the existing loadMonaco utility
      const { loadMonacoManually } = await import('@/utils/loadMonaco');
      const success = await loadMonacoManually();

      if (success && (window as any).monaco) {
        this.monaco = (window as any).monaco;
        
        this.updateState({
          progress: 80,
          stage: 'Monaco loaded via CDN'
        });

        return true;
      }

      throw new Error('CDN loading failed');
    } catch (error) {
      console.warn('Direct CDN loading failed:', error);
      throw error;
    }
  }

  private async loadViaFallbackCDN(): Promise<boolean> {
    try {
      this.updateState({
        progress: 50,
        stage: 'Trying fallback CDN...'
      });

      // Try alternative CDN loading
      const cdnUrls = [
        'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.46.0/min/vs/loader.min.js',
        'https://unpkg.com/monaco-editor@0.46.0/min/vs/loader.js'
      ];

      for (const url of cdnUrls) {
        try {
          await this.loadScriptFromUrl(url);
          
          if ((window as any).monaco) {
            this.monaco = (window as any).monaco;
            
            this.updateState({
              progress: 90,
              stage: 'Monaco loaded via fallback CDN'
            });

            return true;
          }
        } catch (err) {
          console.warn(`Failed to load from ${url}:`, err);
        }
      }

      throw new Error('All fallback CDNs failed');
    } catch (error) {
      console.warn('Fallback CDN loading failed:', error);
      throw error;
    }
  }

  private loadScriptFromUrl(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      
      // Set timeout
      const timeout = setTimeout(() => {
        reject(new Error(`Script loading timeout: ${url}`));
      }, 5000);

      script.onload = () => {
        clearTimeout(timeout);
        resolve();
      };

      document.head.appendChild(script);
    });
  }

  private updateState(updates: Partial<MonacoLoadingState>) {
    this.state = { ...this.state, ...updates };
    this.emit('stateChange', this.state);
  }

  // Force reload Monaco (for manual recovery)
  async forceReload(): Promise<boolean> {
    this.loadPromise = null;
    this.monaco = null;
    this.updateState({
      status: 'idle',
      progress: 0,
      stage: 'Reloading...',
      error: undefined
    });

    return this.ensureMonacoLoaded();
  }

  // Subscribe to loading state changes
  onStateChange(callback: (state: MonacoLoadingState) => void): () => void {
    this.on('stateChange', callback);
    
    // Return unsubscribe function
    return () => this.off('stateChange', callback);
  }
}

// Singleton instance
const monacoManager = new MonacoLoadingManager();

export default monacoManager;
