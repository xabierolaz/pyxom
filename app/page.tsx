import Link from 'next/link';

const modules = [
	{
		id: '01-introduccion',
		title: 'Introducción',
		description: 'Conceptos muy básicos de Python y algoritmos. Ideal para principiantes absolutos.',
		color: 'from-sky-400 to-blue-600',
		path: '/01-introduccion/ej01_suma_producto',
		ejercicios: [
			{ title: 'Variables y Tipos Básicos', path: '/01-introduccion/ej02_variables' },
			{ title: 'Entrada y Salida Básica', path: '/01-introduccion/ej03_input_output' },
			{ title: 'Condicionales', path: '/01-introduccion/ej04_condicionales' },
			{ title: 'Bucles', path: '/01-introduccion/ej05_bucles' },
			{ title: 'Listas', path: '/01-introduccion/ej06_listas' },
			{ title: 'Suma y Producto', path: '/01-introduccion/ej01_suma_producto' }
		]
	},
	{
		id: '03-trees',
		title: 'Árboles',
		description: 'Estructuras de datos jerárquicas y recorridos de árboles.',
		color: 'from-green-400 to-lime-600',
		path: '/03-trees/ej01_tree_basico',
		ejercicios: [
			{ title: 'Nodo y Preorden', path: '/03-trees/ej01_tree_basico' },
			{ title: 'Recorrido Inorden', path: '/03-trees/ej05_tree_inorden' },
			{ title: 'Recorrido Postorden', path: '/03-trees/ej06_tree_postorden' },
			{ title: 'Altura de Árbol', path: '/03-trees/ej02_tree_altura' },
			{ title: 'Inserción BST', path: '/03-trees/ej04_tree_insercion' },
			{ title: 'Búsqueda BST', path: '/03-trees/ej03_tree_busqueda' }
		]
	},
	{
		id: '04-recursividad',
		title: 'Recursividad',
		description: 'Problemas y algoritmos que usan recursión.',
		color: 'from-purple-400 to-fuchsia-600',
		path: '/04-recursividad/ej01_recursividad_basica',
		ejercicios: [
			{ title: 'Factorial', path: '/04-recursividad/ej01_recursividad_basica' },
			{ title: 'Sumatoria', path: '/04-recursividad/ej02_sumatoria' },
			{ title: 'Fibonacci', path: '/04-recursividad/ej03_fibonacci' },
			{ title: 'Potencia', path: '/04-recursividad/ej04_potencia' }
		]
	},
	{
		id: '05-files',
		title: 'Archivos',
		description: 'Lectura y escritura de archivos en Python.',
		color: 'from-orange-400 to-yellow-500',
		path: '/05-files/ej01_files_basico',
		ejercicios: [
			{ title: 'Lectura de Archivos', path: '/05-files/ej01_files_basico' },
			{ title: 'Escritura de Archivos', path: '/05-files/ej02_files_escritura' },
			{ title: 'Lectura de CSV', path: '/05-files/ej03_files_csv' },
			{ title: 'Añadir Líneas', path: '/05-files/ej04_files_append' }
		]
	}
];

export default function Page() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex flex-col items-center py-10">
			<div className="w-full max-w-4xl flex flex-col gap-6">
				<header className="flex items-center gap-4 mb-6">
					<Link
						href="/"
						className="px-4 py-2 bg-white/80 hover:bg-white rounded-lg shadow text-blue-700 font-semibold transition-all border border-blue-200"
					>
						← Volver atrás
					</Link>
					<h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
						Módulos de PythonXom
					</h1>
				</header>
				<section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
					{modules.map((mod) => (
						<Link
							key={mod.id}
							href={mod.path}
							className={`group block rounded-2xl shadow-xl bg-gradient-to-br ${mod.color} p-6 transition-transform hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-blue-400`}
						>
							<div className="flex flex-col h-full justify-between">
								<div>
									<h2 className="text-2xl font-bold text-white drop-shadow mb-2 group-hover:underline">
										{mod.title}
									</h2>
									<p className="text-white/90 text-base mb-4">
										{mod.description}
									</p>
									<ol className="list-decimal pl-5 text-white/90 mb-4">
										{mod.ejercicios.map((exercise, index) => (
											<li key={index}>
												<Link href={exercise.path} className="hover:underline">
													{exercise.title}
												</Link>
											</li>
										))}
									</ol>
								</div>
								<span className="inline-block mt-auto px-4 py-2 bg-white/80 text-blue-700 font-semibold rounded-lg shadow hover:bg-white transition-all self-start">
									Entrar
								</span>
							</div>
						</Link>
					))}
				</section>
			</div>
		</main>
	);
}
