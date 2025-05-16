export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenido a Pyxom</h1>
      <p className="mb-4">Elige un módulo para comenzar:</p>
      <ul className="list-disc list-inside space-y-2">
        <li><a href="/01-introduccion/ej01_suma_producto" className="text-blue-600 underline">01 - Introducción</a></li>
        <li><a href="/02-pilas-colas/ej01_stack_basico" className="text-blue-600 underline">02 - Pilas y Colas</a></li>
      </ul>
    </div>
  );
}
