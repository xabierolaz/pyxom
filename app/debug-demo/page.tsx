// Debug Demo Page
import IntroPythonXom from '@/components/IntroPythonXom';

const debugExercise = {
  id: 'debug_demo',
  title: 'Debug Demo',
  description: `Demo exercise for debugging.`,

  starterCode: `# Simple debug exercise
print("Hello debug!")`,

  tests: [
    {
      name: "Test básico",
      input: "print('test')",
      expected: "'test'",
      points: 1,
      feedback: "Test básico"
    }
  ],

  hints: [
    {
      id: "1",
      text: "Esta es una demostración"
    }
  ]
};

export default function DebugDemoPage() {
  return <IntroPythonXom data={debugExercise} />;
}
