import React from 'react';

interface VariableViewerProps {
  variables: Record<string, any>;
}

const VariableViewer: React.FC<VariableViewerProps> = ({ variables }) => {
  return (
    <div className="variable-viewer">
      <h3>Variables</h3>
      <ul>
        {Object.entries(variables).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {JSON.stringify(value)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VariableViewer;
