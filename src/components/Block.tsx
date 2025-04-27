
import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface PowerData {
  inputPower: number;
  outputPower: number;
  isOn: boolean;
}

interface BlockProps {
  onClick: () => void;
  puzzleName: string;
  powerState?: 'low' | 'medium' | 'high' | 'off';
  powerData?: PowerData;
}

const Block: React.FC<BlockProps> = ({ onClick, puzzleName, powerState = 'off', powerData = { inputPower: 0, outputPower: 0, isOn: false } }) => {
  const { inputPower, outputPower, isOn } = powerData;
  
  // Determine background color based on power state and on/off status
  let bgColor = "bg-white";
  if (isOn) {
    switch (powerState) {
      case 'high':
        bgColor = "bg-green-100";
        break;
      case 'low':
        bgColor = "bg-blue-100";
        break;
      case 'medium':
        bgColor = "bg-yellow-100";
        break;
      default:
        bgColor = "bg-white";
    }
  } else if (powerState !== 'off') {
    // Block has a state but not enough power
    bgColor = "bg-gray-100";
  }

  return (
    <div 
      className={`w-32 h-32 rounded-lg shadow-lg ${bgColor} cursor-pointer hover:bg-gray-50 transition-colors duration-200 relative`}
      onClick={onClick}
    >
      {/* Left handles (inputs) */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-1"
        style={{ top: '25%' }}
        className={`connector-target ${isOn ? 'bg-blue-500' : 'bg-gray-300'}`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-2"
        style={{ top: '75%' }}
        className={`connector-target ${isOn ? 'bg-blue-500' : 'bg-gray-300'}`}
      />

      {/* Right handles (outputs) - only active if node is on */}
      <Handle
        type="source"
        position={Position.Right}
        id="right-1"
        style={{ top: '25%' }}
        className={`connector-source ${isOn ? 'bg-green-500' : 'bg-gray-300'}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-2"
        style={{ top: '75%' }}
        className={`connector-source ${isOn ? 'bg-green-500' : 'bg-gray-300'}`}
      />

      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="font-bold text-gray-600">
          {puzzleName}
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          <div>In: {inputPower.toFixed(1)}</div>
          <div>Out: {isOn ? outputPower.toFixed(1) : '0.0'}</div>
          <div className={`font-medium ${isOn ? 'text-green-600' : 'text-red-600'}`}>
            {isOn ? 'Energized' : 'Inactive'}
            <div>Running: {powerState}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Block;
