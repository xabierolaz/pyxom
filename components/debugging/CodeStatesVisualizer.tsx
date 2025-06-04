// Code States Visualizer
// Shows the state of variables and data structures at each step

import React, { useState, useEffect } from 'react';
import { BarChart3, Eye, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

interface CodeStatesVisualizerProps {
  code: string;
  isVisible: boolean;
  onClose: () => void;
}

interface VariableState {
  name: string;
  value: any;
  type: string;
  line: number;
  scope: string;
}

interface ExecutionState {
  line: number;
  variables: VariableState[];
  dataStructures: DataStructureState[];
  memory: MemoryState[];
}

interface DataStructureState {
  name: string;
  type: 'list' | 'dict' | 'set' | 'tuple';
  elements: any[];
  operations: string[];
}

interface MemoryState {
  address: string;
  value: any;
  references: string[];
}

export default function CodeStatesVisualizer({ code, isVisible, onClose }: CodeStatesVisualizerProps) {
  const [states, setStates] = useState<ExecutionState[]>([]);
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState<'variables' | 'memory' | 'datastructures'>('variables');

  useEffect(() => {
    if (isVisible && code) {
      generateExecutionStates();
    }
  }, [isVisible, code]);

  const generateExecutionStates = async () => {
    // Simulate state generation - in real implementation, this would trace Python execution
    const mockStates: ExecutionState[] = [
      {
        line: 1,
        variables: [],
        dataStructures: [],
        memory: []
      },
      {
        line: 2,
        variables: [
          { name: 'x', value: 5, type: 'int', line: 2, scope: 'global' }
        ],
        dataStructures: [],
        memory: [
          { address: '0x1001', value: 5, references: ['x'] }
        ]
      },
      {
        line: 3,
        variables: [
          { name: 'x', value: 5, type: 'int', line: 2, scope: 'global' },
          { name: 'y', value: [1, 2, 3], type: 'list', line: 3, scope: 'global' }
        ],
        dataStructures: [
          { name: 'y', type: 'list', elements: [1, 2, 3], operations: ['append', 'pop', 'insert'] }
        ],
        memory: [
          { address: '0x1001', value: 5, references: ['x'] },
          { address: '0x1002', value: [1, 2, 3], references: ['y'] }
        ]
      }
    ];
    
    setStates(mockStates);
    setCurrentStateIndex(0);
  };

  const currentState = states[currentStateIndex];

  const renderVariable = (variable: VariableState) => {
    const isSelected = selectedVariable === variable.name;
    
    return (
      <div
        key={variable.name}
        className={`p-3 border rounded-lg cursor-pointer transition-all ${
          isSelected 
            ? 'border-blue-500 bg-blue-50 shadow-md' 
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
        onClick={() => setSelectedVariable(isSelected ? null : variable.name)}
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="font-mono font-bold text-blue-600">{variable.name}</span>
          <span className="text-xs bg-gray-200 px-2 py-1 rounded">{variable.type}</span>
        </div>
        
        <div className="font-mono text-sm">
          {renderVariableValue(variable.value, variable.type)}
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          Línea: {variable.line} | Scope: {variable.scope}
        </div>
        
        {isSelected && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="text-sm">
              <strong>Detalles:</strong>
              <br />
              Tipo: {variable.type}
              <br />
              Valor: {JSON.stringify(variable.value)}
              <br />
              Tamaño en memoria: {getVariableSize(variable.value)} bytes
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderVariableValue = (value: any, type: string) => {
    switch (type) {
      case 'list':
        return (
          <div className="bg-green-50 p-2 rounded">
            <div className="text-xs text-green-600 mb-1">Lista [{value.length} elementos]</div>
            <div className="flex flex-wrap gap-1">
              {value.map((item: any, index: number) => (
                <span key={index} className="bg-green-200 px-2 py-1 rounded text-xs">
                  [{index}]: {String(item)}
                </span>
              ))}
            </div>
          </div>
        );
      
      case 'dict':
        return (
          <div className="bg-purple-50 p-2 rounded">
            <div className="text-xs text-purple-600 mb-1">Diccionario [{Object.keys(value).length} keys]</div>
            <div className="space-y-1">
              {Object.entries(value).map(([key, val]) => (
                <div key={key} className="text-xs">
                  <span className="bg-purple-200 px-1 rounded">{key}</span>: {String(val)}
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'str':
        return (
          <div className="bg-yellow-50 p-2 rounded">
            <div className="text-xs text-yellow-600 mb-1">String [{value.length} chars]</div>
            <div className="font-mono">"{value}"</div>
          </div>
        );
      
      default:
        return <span className="bg-gray-100 px-2 py-1 rounded">{String(value)}</span>;
    }
  };

  const renderDataStructure = (ds: DataStructureState) => {
    return (
      <div key={ds.name} className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-mono font-bold">{ds.name}</h4>
          <span className="text-xs bg-blue-100 px-2 py-1 rounded">{ds.type}</span>
        </div>
        
        <div className="mb-3">
          <div className="text-sm font-medium mb-2">Elementos:</div>
          <div className="grid grid-cols-4 gap-2">
            {ds.elements.map((element, index) => (
              <div key={index} className="bg-blue-50 p-2 rounded text-center text-sm">
                <div className="text-xs text-gray-500">[{index}]</div>
                <div className="font-mono">{String(element)}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">Operaciones disponibles:</div>
          <div className="flex flex-wrap gap-2">
            {ds.operations.map((op, index) => (
              <span key={index} className="text-xs bg-gray-200 px-2 py-1 rounded">
                {op}()
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMemoryView = () => {
    if (!currentState) return null;
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Vista de Memoria</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentState.memory.map((mem, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-sm font-bold">{mem.address}</span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {mem.references.length} ref(s)
                </span>
              </div>
              
              <div className="mb-2">
                <div className="text-sm font-medium">Valor:</div>
                <div className="font-mono text-sm bg-white p-2 rounded">
                  {JSON.stringify(mem.value)}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Referencias:</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {mem.references.map((ref, refIndex) => (
                    <span key={refIndex} className="text-xs bg-blue-100 px-2 py-1 rounded">
                      {ref}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getVariableSize = (value: any): number => {
    // Simplified size calculation
    if (typeof value === 'string') return value.length * 2;
    if (typeof value === 'number') return 8;
    if (Array.isArray(value)) return value.length * 8 + 32;
    if (typeof value === 'object') return Object.keys(value).length * 16 + 32;
    return 8;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-6xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <BarChart3 className="mr-2" size={20} />
            Visualizador de Estados del Código
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
              title="Zoom out"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
              title="Zoom in"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={generateExecutionStates}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cerrar
            </button>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex border-b">
          {['variables', 'datastructures', 'memory'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as any)}
              className={`px-4 py-2 font-medium capitalize ${
                viewMode === mode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {mode === 'datastructures' ? 'Estructuras de Datos' : 
               mode === 'variables' ? 'Variables' : 'Memoria'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto">
          {currentState ? (
            <div>
              {/* State Navigation */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCurrentStateIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentStateIndex === 0}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                    ← Anterior
                  </button>
                  <span className="font-medium">
                    Estado {currentStateIndex + 1} de {states.length} (Línea {currentState.line})
                  </span>
                  <button
                    onClick={() => setCurrentStateIndex(prev => Math.min(states.length - 1, prev + 1))}
                    disabled={currentStateIndex === states.length - 1}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>

              {/* Content based on view mode */}
              {viewMode === 'variables' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Variables en Línea {currentState.line}</h3>
                  {currentState.variables.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentState.variables.map(renderVariable)}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No hay variables definidas en este estado</p>
                  )}
                </div>
              )}

              {viewMode === 'datastructures' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Estructuras de Datos</h3>
                  {currentState.dataStructures.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {currentState.dataStructures.map(renderDataStructure)}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No hay estructuras de datos en este estado</p>
                  )}
                </div>
              )}

              {viewMode === 'memory' && renderMemoryView()}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
              <p>No hay estados de ejecución disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
