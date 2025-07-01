"use client";

import { useEffect } from 'react';

export default function HomeRedirect() {
  useEffect(() => {
    window.location.replace('/01-introduccion/ej01_suma_producto');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-cyan-100">
      <p className="text-lg text-gray-700">Redirigiendo al módulo de demostración...</p>
    </div>
  );
}
