import Link from 'next/link';

const modules = [
	{
		id: '01-introduccion',
		title: 'Introducción',
		description: 'Conceptos básicos de Python y algoritmos.',
		color: 'from-sky-400 to-blue-600',
		path: '/01-introduccion/ej01_suma_producto',
	},
	{
		id: '02-pilas-colas',
		title: 'Pilas y Colas',
		description: 'Estructuras de datos fundamentales.',
		color: 'from-emerald-400 to-green-600',
		path: '/02-pilas-colas/ej01_stack_basico',
	},
	// Puedes agregar más módulos aquí
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
