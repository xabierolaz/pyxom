import { useRouter } from 'next/router';
import IntroPythonXom from '@/components/IntroPythonXom';
import { repasoExercises } from './repasoExercises';

export default function ExercisePage() {
  const router = useRouter();
  const { exerciseId } = router.query;

  const exercise = repasoExercises.find((ex) => ex.id === exerciseId);

  if (!exercise) {
    return <div className="p-4 text-red-600">Error: Ejercicio no encontrado.</div>;
  }

  return <IntroPythonXom data={exercise} />;
}
