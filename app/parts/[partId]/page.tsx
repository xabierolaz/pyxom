'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

// Mock exercise data for demo purposes
const PYTHON_MOOC_EXERCISES = [
	{
		partNumber: 1,
		title: 'Introducción a Python',
		description: 'Conceptos básicos de programación en Python',
		sections: [
			{
				title: 'Conceptos Básicos',
				exercises: [					{
						id: 'ej01',
						title: 'Suma y Producto',
						description: 'Operaciones básicas',
						points: 10,
						difficulty: 'fácil',
					},
					{
						id: 'ej02',
						title: 'Variables',
						description: 'Tipos de datos',
						points: 8,
						difficulty: 'fácil',
					},
					{
						id: 'ej03',
						title: 'Input/Output',
						description: 'Entrada y salida',
						points: 8,
						difficulty: 'fácil',
					},
					{
						id: 'ej04',
						title: 'Condicionales',
						description: 'Estructuras de decisión',
						points: 12,
						difficulty: 'medio',
					},
					{
						id: 'ej05',
						title: 'Bucles',
						description: 'Estructuras de repetición',
						points: 15,
						difficulty: 'medio',
					},
				],
			},
		],
	},
	{
		partNumber: 2,
		title: 'Árboles',
		description: 'Estructuras de datos jerárquicas',
		sections: [
			{
				title: 'Estructuras Jerárquicas',
				exercises: [					{
						id: 'tree01',
						title: 'Árbol Básico',
						description: 'Nodos y recorridos básicos',
						points: 15,
						difficulty: 'medio',
					},
					{
						id: 'tree02',
						title: 'Altura de Árbol',
						description: 'Cálculo de altura',
						points: 12,
						difficulty: 'medio',
					},
					{
						id: 'tree03',
						title: 'Búsqueda BST',
						description: 'Búsqueda en árboles binarios',
						points: 20,
						difficulty: 'difícil',
					},
				],
			},
		],
	},
];

// Mock user for demo
const mockUser = {
	progress: {
		completedExercises: [] as string[],
		totalPoints: 0,
		currentPart: 1,
		certificates: [] as string[],
		lastActive: new Date().toISOString(),
		timeSpent: 0,
	},
};

export default function PartPage() {
	const params = useParams();
	const user = mockUser;
	const partId = params?.partId as string;

	// Extract part number from partId (e.g., "part01" -> 1)
	const partNumber = parseInt(partId?.replace('part', '') || '1');
	const partData = PYTHON_MOOC_EXERCISES.find((p) => p.partNumber === partNumber);

	if (!partData) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-800 mb-4">Part Not Found</h1>
					<p className="text-gray-600 mb-6">The requested course part could not be found.</p>
					<Link
						href="/parts"
						className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
					>
						Back to Course Parts
					</Link>
				</div>
			</div>
		);
	}

	const completedExercises = user?.progress.completedExercises || [];
	const partExercises = partData.sections.flatMap((section) => section.exercises);
	const completedCount = partExercises.filter((ex) => completedExercises.includes(ex.id)).length;
	const progressPercentage = (completedCount / partExercises.length) * 100;

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			{/* Breadcrumb */}
			<div className="bg-white border-b">
				<div className="max-w-7xl mx-auto px-4 py-3">
					<nav className="flex items-center space-x-2 text-sm">
						<Link href="/" className="text-blue-600 hover:text-blue-800">
							Home
						</Link>
						<span className="text-gray-400">/</span>
						<Link href="/parts" className="text-blue-600 hover:text-blue-800">
							Course Parts
						</Link>
						<span className="text-gray-400">/</span>
						<span className="text-gray-600">Part {partNumber}</span>
					</nav>
				</div>
			</div>

			{/* Header */}
			<div className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Part {partNumber}: {partData.title}
							</h1>
							<p className="mt-2 text-lg text-gray-600">{partData.description}</p>
						</div>
						<div className="text-right">
							<div className="text-sm text-gray-500">Progress</div>
							<div className="text-2xl font-bold text-blue-600">
								{Math.round(progressPercentage)}%
							</div>
							<div className="text-sm text-gray-500">
								{completedCount} / {partExercises.length} exercises
							</div>
						</div>
					</div>

					{/* Progress Bar */}
					<div className="mt-6">
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-blue-600 h-2 rounded-full transition-all duration-300"
								style={{ width: `${progressPercentage}%` }}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="grid gap-8">
					{partData.sections.map((section, sectionIndex) => (
						<div
							key={sectionIndex}
							className="bg-white rounded-lg shadow-sm border border-gray-200"
						>
							<div className="p-6">
								<h2 className="text-xl font-semibold text-gray-900 mb-4">
									{section.title}
								</h2>

								<div className="grid gap-4">
									{section.exercises.map((exercise) => {
										const isCompleted = completedExercises.includes(exercise.id);										const difficultyColors: Record<string, string> = {
											fácil: 'bg-green-100 text-green-800',
											medio: 'bg-yellow-100 text-yellow-800',
											difícil: 'bg-red-100 text-red-800',
										};

										return (
											<div
												key={exercise.id}
												className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
											>
												<div className="flex items-center space-x-4">
													<div
														className={`w-8 h-8 rounded-full flex items-center justify-center ${
															isCompleted
																? 'bg-green-500 text-white'
																: 'bg-gray-300 text-gray-600'
														}`}
													>
														{isCompleted ? '✓' : ''}
													</div>
													<div>
														<h3 className="font-medium text-gray-900">
															{exercise.title}
														</h3>
														<p className="text-sm text-gray-600">
															{exercise.description}
														</p>
													</div>
												</div>

												<div className="flex items-center space-x-3">
													<span
														className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyColors[exercise.difficulty]}`}
													>
														{exercise.difficulty}
													</span>
													<span className="text-sm text-gray-600">
														{exercise.points} pts
													</span>													<Link
														href={`/parts/${partId}/${exercise.id}`}
														className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
													>
														{isCompleted ? 'Revisar' : 'Empezar'}
													</Link>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
