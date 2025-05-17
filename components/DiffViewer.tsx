'use client';

import { Diff, Hunk, parseDiff } from 'react-diff-view';
import 'react-diff-view/style/index.css';

interface Props {
  expected: string;
  received: string;
}

export default function DiffViewer({ expected, received }: Props) {
  const diffText = generateUnifiedDiff(expected, received);
  const files = parseDiff(diffText);

  // Only render the first file's hunks (since we generate a single diff)
  const file = files[0];
  if (!file) return <div>No diff available</div>;

  return (
    <div className="border rounded">
      <Diff viewType="split" diffType="modify" hunks={file.hunks}>
        {hunks => hunks.map(hunk => <Hunk key={hunk.content} hunk={hunk} />)}
      </Diff>
    </div>
  );
}

/* ---------- helpers ---------- */

function generateUnifiedDiff(oldStr: string, newStr: string): string {
  const oldLines = oldStr.split('\n');
  const newLines = newStr.split('\n');

  let diff = '--- expected\n+++ received\n';
  let i = 0,
    j = 0;

  while (i < oldLines.length || j < newLines.length) {
    const oldLine = oldLines[i] ?? '';
    const newLine = newLines[j] ?? '';

    if (oldLine === newLine) {
      diff += ' ' + oldLine + '\n';
      i++;
      j++;
    } else {
      if (oldLine) diff += '-' + oldLine + '\n';
      if (newLine) diff += '+' + newLine + '\n';
      i++;
      j++;
    }
  }
  return diff;
}
