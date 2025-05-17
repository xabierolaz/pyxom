import React from 'react';

interface ExecutionFlowVisualizerProps {
  steps: any[];
}

const ExecutionFlowVisualizer: React.FC<ExecutionFlowVisualizerProps> = ({ steps }) => {
  return (
    <div className="execution-flow-visualizer">
      <h3>Flujo de Ejecución</h3>
      <ol>
        {steps.map((step, index) => (
          <li key={index}>{JSON.stringify(step)}</li>
        ))}
      </ol>
    </div>
  );
};

export default ExecutionFlowVisualizer;
