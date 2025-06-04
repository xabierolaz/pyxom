'use client';

interface Props {
  expected: string;
  received: string;
}

export default function DiffViewer({ expected, received }: Props) {
  const expectedLines = expected.split('\n');
  const receivedLines = received.split('\n');
  
  const maxLines = Math.max(expectedLines.length, receivedLines.length);
  
  return (
    <div className="border rounded font-mono text-sm">
      <div className="bg-gray-50 px-4 py-2 border-b text-gray-600 font-semibold">
        Diferencias: Esperado vs Recibido
      </div>
      <div className="grid grid-cols-2 divide-x">
        <div className="p-4">
          <div className="text-green-700 font-semibold mb-2">✓ Esperado:</div>
          <pre className="whitespace-pre-wrap text-green-800 bg-green-50 p-2 rounded">
            {expected || '<vacío>'}
          </pre>
        </div>
        <div className="p-4">
          <div className="text-red-700 font-semibold mb-2">✗ Recibido:</div>
          <pre className="whitespace-pre-wrap text-red-800 bg-red-50 p-2 rounded">
            {received || '<vacío>'}
          </pre>
        </div>
      </div>
    </div>
  );
}
