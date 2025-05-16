export function computeFingerprint(code: string): string {
  /* Simple winnowing hash; placeholder for real Moss integration */
  const tokens = code.replace(/\W+/g, '').toLowerCase();
  let hash = 0;
  for (let i = 0; i < tokens.length; i++) hash = (hash * 31 + tokens.charCodeAt(i)) & 0xffffffff;
  return hash.toString(16);
}
