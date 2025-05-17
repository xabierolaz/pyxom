import React from 'react';

interface ProgressTrackerProps {
  currentPoints: number;
  maxPoints: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentPoints, maxPoints }) => {
  const progressPercentage = (currentPoints / maxPoints) * 100;

  return (
    <div className="progress-tracker">
      <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
      <p>
        Progreso: {currentPoints} / {maxPoints} puntos
      </p>
    </div>
  );
};

export default ProgressTracker;
