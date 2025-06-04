// Advanced Python Tutor-style visualization component
import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  StepForward, 
  StepBack, 
  RotateCcw, 
  FastForward,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface TraceStep {
  event: 'line' | 'call' | 'return';
  line: number;
  filename: string;
  locals: { [key: string]: any };
  globals: { [key: string]: any };
  step: number;
}

interface VisualizationProps {
  userCode: string;
  trace: TraceStep[];
  isPlaying: boolean;
  onRunVisualization: () => void;
}

interface VariableDisplayProps {
  variables: { [key: string]: any };
  title: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

const VariableDisplay: React.FC<VariableDisplayProps> = ({ 
  variables, 
  title, 
  collapsed = false, 
  onToggle 
}) => {
  const formatValue = (value: any): string => {
    if (value === null) return 'None';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value.toString();
    if (Array.isArray(value)) {
      return `[${value.map(formatValue).join(', ')}]`;
    }
    if (typeof value === 'object') {
      try {
        const entries = Object.entries(value).slice(0, 3);
        const display = entries.map(([k, v]) => `${k}: ${formatValue(v)}`).join(', ');
        return `{${display}${Object.keys(value).length > 3 ? '...' : ''}}`;
      } catch {
        return value.toString();
      }
    }
    return value.toString();
  };

  return (
    <Card className="mb-4">
      <CardHeader 
        className="pb-2 cursor-pointer" 
        onClick={onToggle}
      >
        <CardTitle className="text-sm flex items-center justify-between">
          {title}
          <Button variant="ghost" size="sm">
            {collapsed ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      {!collapsed && (
        <CardContent className="pt-0">
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {Object.keys(variables).length === 0 ? (
              <div className="text-sm text-muted-foreground italic">No variables</div>
            ) : (
              Object.entries(variables).map(([name, value]) => (
                <div key={name} className="flex items-start gap-2 text-sm">
                  <span className="font-mono font-semibold text-blue-600 min-w-0 break-all">
                    {name}:
                  </span>
                  <span className="font-mono text-gray-700 min-w-0 break-all">
                    {formatValue(value)}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const CodeHighlighter: React.FC<{ 
  code: string; 
  currentLine?: number; 
  onLineClick?: (line: number) => void;
}> = ({ code, currentLine, onLineClick }) => {
  const lines = code.split('\n');

  return (
    <div className="font-mono text-sm bg-gray-50 border rounded-md p-4 overflow-auto max-h-96">
      {lines.map((line, index) => {
        const lineNumber = index + 1;
        const isCurrentLine = lineNumber === currentLine;
        
        return (
          <div
            key={lineNumber}
            className={`flex items-start gap-3 py-1 px-2 rounded cursor-pointer hover:bg-gray-100 ${
              isCurrentLine ? 'bg-yellow-200 border-l-4 border-yellow-500' : ''
            }`}
            onClick={() => onLineClick?.(lineNumber)}
          >
            <span className="text-gray-400 select-none min-w-[2rem] text-right">
              {lineNumber}
            </span>
            <span className={`flex-1 ${isCurrentLine ? 'font-semibold' : ''}`}>
              {line || ' '}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const PythonTutorVisualization: React.FC<VisualizationProps> = ({
  userCode,
  trace,
  isPlaying,
  onRunVisualization
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showGlobals, setShowGlobals] = useState(false);
  const [showLocals, setShowLocals] = useState(true);
  const [playbackInterval, setPlaybackInterval] = useState<NodeJS.Timeout | null>(null);

  const currentTrace = useMemo(() => {
    return trace[currentStep] || null;
  }, [trace, currentStep]);

  const maxSteps = trace.length - 1;

  const startAutoPlay = useCallback(() => {
    if (playbackInterval) {
      clearInterval(playbackInterval);
    }

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= maxSteps) {
          setIsAutoPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, playbackSpeed);

    setPlaybackInterval(interval);
    setIsAutoPlaying(true);
  }, [maxSteps, playbackSpeed, playbackInterval]);

  const stopAutoPlay = useCallback(() => {
    if (playbackInterval) {
      clearInterval(playbackInterval);
      setPlaybackInterval(null);
    }
    setIsAutoPlaying(false);
  }, [playbackInterval]);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, maxSteps));
  }, [maxSteps]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    stopAutoPlay();
    setCurrentStep(0);
  }, [stopAutoPlay]);

  const goToEnd = useCallback(() => {
    stopAutoPlay();
    setCurrentStep(maxSteps);
  }, [maxSteps, stopAutoPlay]);

  const handleSliderChange = useCallback((value: number[]) => {
    stopAutoPlay();
    setCurrentStep(value[0]);
  }, [stopAutoPlay]);

  const handleLineClick = useCallback((lineNumber: number) => {
    // Find the first trace step that executes this line
    const stepIndex = trace.findIndex(step => step.line === lineNumber);
    if (stepIndex >= 0) {
      setCurrentStep(stepIndex);
    }
  }, [trace]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (playbackInterval) {
        clearInterval(playbackInterval);
      }
    };
  }, [playbackInterval]);

  const eventTypeDisplay = (event: string) => {
    switch (event) {
      case 'line': return '→';
      case 'call': return '📞';
      case 'return': return '↵';
      default: return event;
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Python Tutor Visualization
            <Button 
              onClick={onRunVisualization}
              disabled={isPlaying}
              size="sm"
            >
              {isPlaying ? 'Running...' : 'Generate Trace'}
            </Button>
          </CardTitle>
        </CardHeader>
        
        {trace.length > 0 && (
          <CardContent className="space-y-4">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <Button
                onClick={reset}
                variant="outline"
                size="sm"
                disabled={isAutoPlaying}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={prevStep}
                variant="outline"
                size="sm"
                disabled={currentStep === 0 || isAutoPlaying}
              >
                <StepBack className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={isAutoPlaying ? stopAutoPlay : startAutoPlay}
                variant="outline"
                size="sm"
                disabled={currentStep >= maxSteps}
              >
                {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={nextStep}
                variant="outline"
                size="sm"
                disabled={currentStep >= maxSteps || isAutoPlaying}
              >
                <StepForward className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={goToEnd}
                variant="outline"
                size="sm"
                disabled={isAutoPlaying}
              >
                <FastForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Step Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Step: {currentStep + 1} / {maxSteps + 1}</span>
                {currentTrace && (
                  <span className="flex items-center gap-2">
                    <span>{eventTypeDisplay(currentTrace.event)}</span>
                    <span>Line {currentTrace.line}</span>
                  </span>
                )}
              </div>
              
              <Slider
                value={[currentStep]}
                onValueChange={handleSliderChange}
                max={maxSteps}
                min={0}
                step={1}
                className="flex-1"
                disabled={isAutoPlaying}
              />
            </div>

            {/* Speed Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Playback Speed</span>
                <span>{playbackSpeed}ms</span>
              </div>
              <Slider
                value={[playbackSpeed]}
                onValueChange={(value) => setPlaybackSpeed(value[0])}
                max={2000}
                min={100}
                step={100}
                className="flex-1"
              />
            </div>
          </CardContent>
        )}
      </Card>

      {trace.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Code Display */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Code Execution</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeHighlighter
                  code={userCode}
                  currentLine={currentTrace?.line}
                  onLineClick={handleLineClick}
                />
              </CardContent>
            </Card>
          </div>

          {/* Variables Display */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={showLocals ? "default" : "outline"}
                size="sm"
                onClick={() => setShowLocals(!showLocals)}
              >
                Local Variables
              </Button>
              <Button
                variant={showGlobals ? "default" : "outline"}
                size="sm"
                onClick={() => setShowGlobals(!showGlobals)}
              >
                Global Variables
              </Button>
            </div>

            {showLocals && currentTrace && (
              <VariableDisplay
                variables={currentTrace.locals}
                title="Local Variables"
              />
            )}

            {showGlobals && currentTrace && (
              <VariableDisplay
                variables={currentTrace.globals}
                title="Global Variables"
              />
            )}

            {/* Execution Stack Info */}
            {currentTrace && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Execution Context</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold">Event:</span> {currentTrace.event}
                  </div>
                  <div>
                    <span className="font-semibold">Line:</span> {currentTrace.line}
                  </div>
                  <div>
                    <span className="font-semibold">Step:</span> {currentTrace.step}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {trace.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Click "Generate Trace" to visualize code execution step by step
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
