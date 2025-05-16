'use client';

import { useEffect, useState } from 'react';
import { runFlake8 } from '@/utils/flake8';

export default function StyleFeedback({ code }: { code: string }) {
  const [violations, setViolations] = useState<string[] | null>(null);

  useEffect(() => {
    runFlake8(code).then(setViolations);
  }, [code]);

  if (!violations) return null;
  if (violations.length === 0)
    return <p className="text-green-600">✔ Sin problemas de estilo PEP8</p>;

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-2">
      <strong>Estilo (Flake8):</strong>
      <ul className="list-disc list-inside text-sm mt-1">
        {violations.map((v, i) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
    </div>
  );
}
