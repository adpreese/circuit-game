import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { Gauge } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
interface ValveSettings {
  A: number;
  B: number;
  C: number;
  D: number;
}
const TARGET_X1 = 5;
const TARGET_Y1 = 8;
const TARGET_X2 = 6;
const TARGET_Y2 = 14;
const TARGET_Z2 = 8;

const TOLERANCE = 0.1;
interface GameProps {
  onComplete: (status: 'low' | 'high' | 'off') => void;
  firstStage: string;
}
const PressureBalancePuzzle = ({ onComplete, firstStage }: GameProps) => {
  const [valves, setValves] = useState<ValveSettings>({
    A: 0,
    B: 1,
    // Start at 1 to avoid multiplication by 0
    C: 0,
    D: 1
  });
  const [solved, setSolved] = useState(false);
  const {
    toast
  } = useToast();

  // Calculate pressures based on valve settings
  const gaugeX = valves.A + valves.C;
  const gaugeY = valves.B * valves.C;
  const gaugeZ = valves.B / valves.D;

  // Check if puzzle is solved
  useEffect(() => {
    const isXCorrect = Math.abs(gaugeX - TARGET_X1) <= TOLERANCE;
    const isYCorrect = Math.abs(gaugeY - TARGET_Y1) <= TOLERANCE;
    
    if (isXCorrect && isYCorrect && !solved) {
      onComplete("low")
      setSolved(true);
      toast({
        title: "Success!",
        description: "You've balanced both pressure gauges perfectly!"
      });
    } 
    const isX2Correct = Math.abs(gaugeX - TARGET_X2) <= TOLERANCE;
    const isY2Correct = Math.abs(gaugeY - TARGET_Y2) <= TOLERANCE;
    const isZ2Correct = Math.abs(gaugeZ - TARGET_Z2) <= TOLERANCE;
    
    if (isX2Correct && isY2Correct && isZ2Correct && !solved) {
      onComplete("high")
      setSolved(true);
      toast({
        title: "Success!",
        description: "You've balanced both pressure gauges perfectly!"
      });
    } 
    
    else if ((!isXCorrect || !isYCorrect) && solved) {
      setSolved(false);
    }
  }, [gaugeX, gaugeY, solved, toast]);

  // Handle valve adjustments
  const handleValveChange = (valve: keyof ValveSettings, value: number[]) => {
    setValves(prev => ({
      ...prev,
      [valve]: value[0]
    }));
  };

  // Reset puzzle
  const handleReset = () => {
    onComplete("off")
    setValves({
      A: 0,
      B: 1,
      C: 0,
      D: 1,
    });
    setSolved(false);
  };

  // Generate gauge data for visualization
  const generateGaugeData = (current: number, target: number) => {
    return [{
      name: 'Current',
      value: current
    }, {
      name: 'Target',
      value: target
    }];
  };
  return <div className="min-h-screen text-gray-400 bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 text-gray-200 bg-gray-800 border-gray-700">
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl text-gray-400 font-bold mb-2">Pressure balancing</h1>
              <p className="text-gray-400">Balance both pressure gauges to their target values simultaneously.  

Gauge X needs to be at 5 and Gauge Y needs to be at 8 {firstStage === 'complete' && `Gauge Z needs to be at 9`}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pressure Gauges */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Pressure Gauges</h2>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Gauge className="mr-2" />
                    <span>Gauge X: {gaugeX.toFixed(1)} / {TARGET_X1} {firstStage === 'complete' && `OR ${TARGET_X2}`}</span>
                  </div>
                  <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={generateGaugeData(gaugeX, TARGET_X1)}>
                      
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Gauge className="mr-2" />
                    <span>Gauge Y: {gaugeY.toFixed(1)} / {TARGET_Y1} {firstStage === 'complete' && `OR ${TARGET_Y2}`}</span>
                  </div>
                  <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={generateGaugeData(gaugeY, TARGET_Y1)}>
                      
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 16]} />
                      <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {firstStage === 'complete' && 
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Gauge className="mr-2" />
                      <span>Gauge Z: {gaugeZ.toFixed(1)} / {TARGET_Z2} </span>
                    </div>
                    <ResponsiveContainer width="100%" height={100}>
                      <LineChart data={generateGaugeData(gaugeZ, TARGET_Z2)}>
                        
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 16]} />
                        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                }
              </div>

              {/* Valve Controls */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Valve Controls</h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm">Valve A: {valves.A.toFixed(1)}</label>
                    <Slider value={[valves.A]} max={5} step={0.1} onValueChange={value => handleValveChange('A', value)} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm">Valve B: {valves.B.toFixed(1)}</label>
                    <Slider value={[valves.B]} min={1} max={5} step={0.1} onValueChange={value => handleValveChange('B', value)} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm">Valve C: {valves.C.toFixed(1)}</label>
                    <Slider value={[valves.C]} max={5} step={0.1} onValueChange={value => handleValveChange('C', value)} />
                  </div>
                  {firstStage === 'complete' && 
                  <div className="space-y-2">
                    <label className="text-sm">Valve D: {valves.D.toFixed(1)}</label>
                    <Slider value={[valves.D]} max={5} step={0.1} onValueChange={value => handleValveChange('D', value)} />
                  </div>
                  }
                </div>

                <div className="pt-4">
                  <Button onClick={handleReset} variant="destructive" className="w-full">
                    Reset Valves
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>;
};
export default PressureBalancePuzzle;