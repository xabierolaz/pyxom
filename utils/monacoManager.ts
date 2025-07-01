// Enhanced Monaco Loading Manager - Fixes cascading loading delays
'use client';

import { EventEmitter } from 'events';
import { isMonacoLoaded } from './monacoCore';
import type { MonacoEditor } from '../types/monaco';
import '../types/monaco'; // Import global Window extensions

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
  private monaco: MonacoEditor | null = null;
  constructor() {
    super();
    this.setMaxListeners(50); // Support many components listening
  }

  getState(): MonacoLoadingState {
    return { ...this.state };
  }

  isReady(): boolean {
    return this.state.status === 'ready' && isMonacoLoaded();
  }

  getMonaco(): MonacoEditor | null {
    return isMonacoLoaded() ? (window.monaco ?? null) : null;
  }

  // Main loading method - called by all components
  async ensureMonacoLoaded(): Promise<boolean> {
    // Check if Monaco is already available globally
    if (isMonacoLoaded()) {
      console.log('✅ Monaco already available globally');
      this.updateState({
        status: 'ready',
        progress: 100,
        stage: 'Monaco ready!'
      });
      return true;
    }

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
      if (typeof window !== 'undefined' && window.monaco) {
        this.monaco = window.monaco;
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

      // Simple and direct loading approach
      const success = await this.loadViaSimpleCDN();

      if (success && window.monaco) {
        this.monaco = window.monaco;
        this.updateState({
          status: 'ready',
          progress: 100,
          stage: 'Monaco loaded successfully!',
          loadTime: Date.now() - this.startTime
        });
        console.log('✅ Monaco successfully loaded');
        return true;
      }

      throw new Error('Monaco loading failed');
    } catch (error) {
      console.error('Monaco loading failed:', error);
      this.updateState({
        status: 'error',
        progress: 0,
        stage: 'Loading failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      this.loadPromise = null;
      return false;
    }
  }

  private async loadViaSimpleCDN(): Promise<boolean> {
    try {
      this.updateState({
        progress: 35,
        stage: 'Loading via CDN...'
      });

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/loader.js';
        script.async = true;

        const timeoutId = setTimeout(() => {
          reject(new Error('CDN timeout'));
        }, 10000);

        script.onload = () => {
          clearTimeout(timeoutId);

          if (!window.require) {
            reject(new Error('AMD loader not available'));
            return;
          }

          window.require.config({
            paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs' }
          });

          window.require(['vs/editor/editor.main'], () => {
            if (window.monaco) {
              this.monaco = window.monaco;
              this.updateState({
                progress: 90,
                stage: 'Monaco loaded successfully'
              });
              resolve(true);
            } else {
              reject(new Error('Monaco not available after loading'));
            }
          }, (error: Error) => {
            reject(new Error(`Monaco require failed: ${error.message}`));
          });
        };

        script.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error('Script loading failed'));
        };

        document.head.appendChild(script);
      });
    } catch (error) {
      console.warn('CDN loading failed:', error);
      throw error;
    }
  }

  // Force reload Monaco (for manual recovery)
  async forceReload(): Promise<boolean> {
    this.loadPromise = null;
    this.monaco = null;
    this.updateState({
      status: 'idle',
      progress: 0,
      stage: 'Reloading...',
    });

    return this.ensureMonacoLoaded();
  }

  // Subscribe to loading state changes
  onStateChange(callback: (state: MonacoLoadingState) => void) {
    this.on('stateChange', callback);
    return () => this.off('stateChange', callback);
  }

  private updateState(updates: Partial<MonacoLoadingState>) {
    this.state = { ...this.state, ...updates };
    this.emit('stateChange', this.state);
  }
}

// Export singleton instance
const monacoLoadingManager = new MonacoLoadingManager();
export { monacoLoadingManager };
export default monacoLoadingManager;
