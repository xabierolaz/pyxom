/**
 * Monaco Editor CDN Constants - Single Source of Truth
 * Eliminates duplication across 15+ files
 */

export const MONACO_CDN_URLS = [
  'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs/loader.js',
  'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.46.0/min/vs/loader.js',
  'https://unpkg.com/monaco-editor@0.46.0/min/vs/loader.js'
] as const;

export const MONACO_VERSION = '0.46.0';

export const MONACO_RESOURCES = [
  `https://cdn.jsdelivr.net/npm/monaco-editor@${MONACO_VERSION}/min/vs/editor/editor.main.js`,
  `https://cdn.jsdelivr.net/npm/monaco-editor@${MONACO_VERSION}/min/vs/editor/editor.main.css`,
  `https://cdn.jsdelivr.net/npm/monaco-editor@${MONACO_VERSION}/min/vs/language/python/python.js`
] as const;

export const MONACO_CONFIG = {
  timeout: 10000,
  fastTimeout: 3000,
  retryDelays: [1000, 2000, 3000],
  maxRetries: 3
} as const;
