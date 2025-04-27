
import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface PowerData {
  inputPower: number;
  outputPower: number;
  isOn: boolean;
}

interface StartNodeProps {
  onClick: () => void;
  puzzleName: string;
  powerData?: PowerData;
}

const StartBlock: React.FC<StartNodeProps> = ({ 
  onClick, 
  puzzleName,
  powerData = { inputPower: 0, outputPower: 1, isOn: true }
}) => {
  const { outputPower } = powerData;
  
  return (
    <div 
      className="w-32 h-32 rounded-lg shadow-lg bg-green-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      
    >
      {/* Right handles (outputs) */}
      <Handle
        type="source"
        position={Position.Right}
        id="right-1"
        style={{ top: '25%' }}
        className="w-4 h-4 border-2 border-white bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-2"
        style={{ top: '75%' }}
        className="w-4 h-4 border-2 border-white bg-green-500"
      />

      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="font-bold text-gray-600">
          {puzzleName}
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <div>Output: {outputPower.toFixed(1)}</div>
          <div className="text-green-600 font-medium">ALWAYS ON</div>
        </div>
      </div>
    </div>
  );
};

export default StartBlock;
