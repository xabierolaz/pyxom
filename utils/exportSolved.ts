import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useProgress } from '@/contexts/ProgressContext';

export async function exportSolved(fs: Record<string, string>) {
  const { progress } = useProgress();
  const zip = new JSZip();
  Object.entries(progress).forEach(([id, done]) => {
    if (done && fs[id]) zip.file(`${id}.py`, fs[id]);
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'pyxom_solved.zip');
}
