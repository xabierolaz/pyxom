'use client';

import IntroPythonXom from '@/components/IntroPythonXom';
import { repasoExercises } from '../repasoExercises';

interface ExercisePageProps {
  params: {
    exerciseId: string;
  };
}

export default function ExercisePage({ params }: ExercisePageProps) {
  const { exerciseId } = params;

  const exercise = repasoExercises.find((ex) => ex.id === exerciseId);

  if (!exercise) {
    return <div className="p-4 text-red-600">Error: Ejercicio no encontrado.</div>;
  }

  return <IntroPythonXom data={exercise} />;
}