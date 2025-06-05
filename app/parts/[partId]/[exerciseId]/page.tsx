// Dynamic Exercise Page
import IntroPythonXom from '@/components/IntroPythonXom';

interface Props {
  params: {
    partId: string;
    exerciseId: string;
  };
}

export default function DynamicExercisePage({ params }: Props) {
  const exerciseData = {
    id: params.exerciseId,
    title: `Exercise ${params.exerciseId}`,
    description: `Dynamic exercise from part ${params.partId}`,
    starterCode: `# Exercise ${params.exerciseId}
print("Hello from dynamic exercise!")`,
    tests: [],
    hints: []
  };

  return <IntroPythonXom data={exerciseData} />;
}