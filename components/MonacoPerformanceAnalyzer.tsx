// Monaco Performance Analyzer - Identifies loading bottlenecks
'use client';

import React, { useState, useEffect } from 'react';

interface PerformanceMetrics {
  timestamp: number;
  stage: string;
  duration: number;
  cumulative: number;
  details?: any;
}

export default function MonacoPerformanceAnalyzer() {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [finalReport, setFinalReport] = useState<string | null>(null);

  const addMetric = (stage: string, startTime: number, details?: any) => {
    const now = Date.now();
    const duration = now - startTime;
    const cumulative = metrics.length > 0 ? metrics[metrics.length - 1].cumulative + duration : duration;
    
    const metric: PerformanceMetrics = {
      timestamp: now,
      stage,
      duration,
      cumulative,
      details
    };
    
    setMetrics(prev => [...prev, metric]);
    console.log(`📊 ANALYZER: ${stage} took ${duration}ms (total: ${cumulative}ms)`, details);
  };

  const analyzeMonacoLoading = async () => {
    setIsAnalyzing(true);
    setMetrics([]);
    setFinalReport(null);
    
    const overallStart = Date.now();
    
    try {
      // Stage 1: Check initial state
      const stage1Start = Date.now();
      const initialMonaco = !!(window as any).monaco;
      const initialRequire = !!(window as any).require;
      addMetric('Initial State Check', stage1Start, { 
        monacoExists: initialMonaco, 
        requireExists: initialRequire 
      });

      // Stage 2: Check network connectivity to CDNs
      const stage2Start = Date.now();
      const cdnTests = await testCDNConnectivity();
      addMetric('CDN Connectivity Test', stage2Start, cdnTests);

      // Stage 3: Try loading Monaco loader
      if (!initialMonaco) {
        const stage3Start = Date.now();
        const loaderResult = await loadMonacoLoader();
        addMetric('Monaco Loader Loading', stage3Start, loaderResult);

        // Stage 4: Load Monaco core
        if (loaderResult.success) {
          const stage4Start = Date.now();
          const coreResult = await loadMonacoCore();
          addMetric('Monaco Core Loading', stage4Start, coreResult);

          // Stage 5: Create test editor
          if (coreResult.success) {
            const stage5Start = Date.now();
            const editorResult = await createTestEditor();
            addMetric('Test Editor Creation', stage5Start, editorResult);
          }
        }
      }

      // Generate final report
      const totalTime = Date.now() - overallStart;
      const report = generateReport(totalTime);
      setFinalReport(report);
      
    } catch (error) {
      addMetric('Analysis Error', Date.now(), { error: error.message });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const testCDNConnectivity = async (): Promise<any> => {
    const cdns = [
      'https://unpkg.com/monaco-editor@0.46.0/min/vs/loader.js',
      'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/loader.js',
      'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.46.0/min/vs/loader.min.js'
    ];

    const results = await Promise.allSettled(
      cdns.map(async (url) => {
        const start = Date.now();
        try {
          const response = await fetch(url, { method: 'HEAD' });
          return {
            url,
            success: response.ok,
            time: Date.now() - start,
            status: response.status
          };
        } catch (error) {
          return {
            url,
            success: false,
            time: Date.now() - start,
            error: error.message
          };
        }
      })
    );

    return results.map((result, index) => 
      result.status === 'fulfilled' ? result.value : { url: cdns[index], error: result.reason }
    );
  };

  const loadMonacoLoader = (): Promise<any> => {
    return new Promise((resolve) => {
      const start = Date.now();
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/monaco-editor@0.46.0/min/vs/loader.js';
      
      script.onload = () => {
        resolve({
          success: true,
          time: Date.now() - start,
          requireAvailable: !!(window as any).require
        });
      };
      
      script.onerror = () => {
        resolve({
          success: false,
          time: Date.now() - start,
          error: 'Failed to load loader script'
        });
      };
      
      document.head.appendChild(script);
    });
  };

  const loadMonacoCore = (): Promise<any> => {
    return new Promise((resolve) => {
      const start = Date.now();
      
      if (!(window as any).require) {
        resolve({ success: false, error: 'Require not available' });
        return;
      }

      (window as any).require.config({
        paths: { vs: 'https://unpkg.com/monaco-editor@0.46.0/min/vs' }
      });

      (window as any).require(['vs/editor/editor.main'], () => {
        resolve({
          success: true,
          time: Date.now() - start,
          monacoAvailable: !!(window as any).monaco
        });
      }, (error: any) => {
        resolve({
          success: false,
          time: Date.now() - start,
          error: error.message || 'Core loading failed'
        });
      });
    });
  };

  const createTestEditor = (): Promise<any> => {
    return new Promise((resolve) => {
      const start = Date.now();
      
      try {
        const container = document.createElement('div');
        container.style.width = '100px';
        container.style.height = '100px';
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        document.body.appendChild(container);

        const editor = (window as any).monaco.editor.create(container, {
          value: 'print("test")',
          language: 'python',
          theme: 'vs-dark'
        });

        resolve({
          success: true,
          time: Date.now() - start,
          editorCreated: !!editor
        });

        // Cleanup
        setTimeout(() => {
          editor.dispose();
          document.body.removeChild(container);
        }, 100);

      } catch (error) {
        resolve({
          success: false,
          time: Date.now() - start,
          error: error.message
        });
      }
    });
  };

  const generateReport = (totalTime: number): string => {
    const slowStages = metrics.filter(m => m.duration > 1000);
    const bottlenecks = metrics.sort((a, b) => b.duration - a.duration).slice(0, 3);
    
    let report = `📊 MONACO PERFORMANCE ANALYSIS REPORT\n`;
    report += `=====================================\n\n`;
    report += `⏱️  Total Analysis Time: ${totalTime}ms\n`;
    report += `📈 Total Stages: ${metrics.length}\n`;
    report += `🐌 Slow Stages (>1s): ${slowStages.length}\n\n`;
    
    report += `🔍 TOP BOTTLENECKS:\n`;
    bottlenecks.forEach((metric, index) => {
      report += `${index + 1}. ${metric.stage}: ${metric.duration}ms\n`;
    });
    
    report += `\n💡 RECOMMENDATIONS:\n`;
    if (slowStages.some(s => s.stage.includes('CDN'))) {
      report += `• CDN connectivity issues detected - try different network\n`;
    }
    if (slowStages.some(s => s.stage.includes('Loader'))) {
      report += `• Monaco loader loading slowly - cache issue or network problem\n`;
    }
    if (slowStages.some(s => s.stage.includes('Core'))) {
      report += `• Monaco core loading slowly - large bundle download issue\n`;
    }
    if (slowStages.some(s => s.stage.includes('Editor'))) {
      report += `• Editor creation slow - DOM/rendering performance issue\n`;
    }
    
    return report;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">🔍 Monaco Performance Analyzer</h1>
      
      <div className="mb-6">
        <button
          onClick={analyzeMonacoLoading}
          disabled={isAnalyzing}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold"
        >
          {isAnalyzing ? '🔄 Analyzing...' : '🚀 Analyze Monaco Loading'}
        </button>
      </div>

      {metrics.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">📊 Real-time Metrics</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto bg-gray-50 p-4 rounded">
            {metrics.map((metric, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className={metric.duration > 1000 ? 'text-red-600 font-bold' : 'text-gray-700'}>
                  {metric.stage}
                </span>
                <span className={metric.duration > 1000 ? 'text-red-600 font-bold' : 'text-blue-600'}>
                  {metric.duration}ms
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {finalReport && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">📋 Final Report</h2>
          <pre className="bg-black text-green-400 p-4 rounded text-sm whitespace-pre-wrap overflow-x-auto">
            {finalReport}
          </pre>
        </div>
      )}
    </div>
  );
}
