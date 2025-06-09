// Emergency Monaco loader with direct CDN
export async function loadMonacoDirectly(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).monaco) {
      console.log('Monaco already available');
      resolve();
      return;
    }

    console.log('🚨 LOADING MONACO DIRECTLY FROM CDN...');

    // Load Monaco directly from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/loader.js';
    
    script.onload = () => {
      console.log('Monaco loader script loaded');
      
      const require = (window as any).require;
      require.config({ 
        paths: { 
          vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs' 
        } 
      });
      
      require(['vs/editor/editor.main'], () => {
        console.log('✅ Monaco editor loaded successfully from CDN');
        // Dispatch event
        window.dispatchEvent(new CustomEvent('monaco-loaded'));
        resolve();
      }, (err: any) => {
        console.error('❌ Monaco require failed:', err);
        reject(err);
      });
    };
    
    script.onerror = (err) => {
      console.error('❌ Monaco script loading failed:', err);
      reject(new Error('Script loading failed'));
    };
    
    document.head.appendChild(script);
    
    // Timeout after 20 seconds
    setTimeout(() => {
      console.error('❌ Monaco loading timeout');
      reject(new Error('Monaco loading timeout'));
    }, 20000);
  });
}

// Preload Monaco resources
export function preloadMonacoResources() {
  // Preload key Monaco resources
  const resources = [
    'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/loader.js',
    'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/editor/editor.main.js',
    'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/editor/editor.main.css'
  ];

  resources.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
}
