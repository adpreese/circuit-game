
import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface PowerData {
  inputPower: number;
  outputPower: number;
  isOn: boolean;
}

interface EndNodeProps {
  onClick: () => void;
  puzzleName: string;
  powerData?: PowerData;
}

const EndBlock: React.FC<EndNodeProps> = ({ 
  onClick, 
  puzzleName,
  powerData = { inputPower: 0, outputPower: 0, isOn: false }
}) => {
  const { inputPower, isOn } = powerData;
  
  // Determine status text and color
  let statusText = 'OFF';
  let statusColor = 'text-red-600';
  
  if (inputPower >= 15) {
    statusText = 'OVERLOAD!';
    statusColor = 'text-red-600';
  } else if (inputPower >= 13) {
    statusText = 'HIGH POWER';
    statusColor = 'text-green-600';
  } else if (inputPower >= 6) {
    statusText = 'POWERED';
    statusColor = 'text-blue-600';
  }
  
  // Background color based on power level
  let bgColor = "bg-white";
  if (inputPower >= 15) {
    bgColor = "bg-red-100";
  } else if (inputPower >= 13) {
    bgColor = "bg-green-100";
  } else if (inputPower >= 6) {
    bgColor = "bg-blue-100";
  } else if (inputPower > 0) {
    bgColor = "bg-gray-100";
  }
  
  return (
    <div 
      className={`w-32 h-32 rounded-lg shadow-lg ${bgColor} cursor-pointer hover:bg-gray-50 transition-colors duration-200`}
      
    >
       {/* Left handles (inputs) */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-1"
        style={{ top: '25%' }}
        className="w-4 h-4 border-2 border-white bg-gray-300"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-2"
        style={{ top: '75%' }}
        className="w-4 h-4 border-2 border-white bg-gray-300"
      />

      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="font-bold text-gray-600">
          {puzzleName}
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <div>Input: {inputPower.toFixed(1)}</div>
          <div className={`font-medium ${statusColor}`}>
            {statusText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndBlock;
