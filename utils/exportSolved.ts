import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function exportSolved(fs: Record<string, string>) {
  const zip = new JSZip();
  Object.entries(fs).forEach(([id, fileContent]) => {
    if (fileContent) zip.file(`${id}.py`, fileContent);
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'pyxom_solved.zip');
}
