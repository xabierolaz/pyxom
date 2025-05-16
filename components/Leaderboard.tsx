'use client';

import { useEffect, useState } from 'react';
import { firebaseEnabled, getFirebase } from '@/lib/firebaseSwitch';

export default function Leaderboard() {
  const [rows, setRows] = useState<{ name: string; points: number }[]>([]);

  useEffect(() => {
    if (!firebaseEnabled) return;
    (async () => {
      const { db } = await getFirebase();
      const { collection, getDocs, query, orderBy, limit } = await import('firebase/firestore');
      const q = query(collection(db, 'leaderboard'), orderBy('points', 'desc'), limit(10));
      const snap = await getDocs(q);
      setRows(snap.docs.map(d => ({ name: d.data().name, points: d.data().points })));
    })();
  }, []);

  if (!firebaseEnabled)
    return <p className="italic text-sm">Ranking global desactivado en este despliegue.</p>;

  return (
    <div>
      <h3 className="font-bold mb-2">🏆 Ranking Global</h3>
      <ol className="list-decimal list-inside space-y-1">
        {rows.map((r, i) => (
          <li key={i}>
            {r.name} – {r.points} pts
          </li>
        ))}
      </ol>
    </div>
  );
}
