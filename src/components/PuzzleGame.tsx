import React, { useMemo, useEffect, useState } from 'react';
import { ReactFlow, Background, useNodesState, Connection, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Block from './Block';
import StartBlock from './StartNode';
import EndBlock from './EndNode';
import { useNavigate } from 'react-router-dom';
import { initialGameState, useGameState } from '@/context/GameStateContext';
import { Button } from './ui/button';
import { RefreshCw, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import GameRulesModal from './GameRulesModal';

interface PowerData {
  inputPower: number;
  outputPower: number;
  isOn: boolean;
}

const PuzzleGame = () => {
  const navigate = useNavigate();
  const { gameState, setEdges, updateGameState, updatePuzzleState } = useGameState();
  const [powerStatus, setPowerStatus] = useState<Record<string, PowerData>>({});
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Create nodes based on game state
  const initialNodes = useMemo(() => {
    const nodes = [
      {
        id: '1',
        type: 'blockNode',
        position: { x: 0, y: 0 },
        data: { 
          puzzleId: 1, 
          puzzleName: 'Grid Realignment',
          powerState: gameState.puzzle1,
          powerData: powerStatus['1'] || { inputPower: 0, outputPower: 0, isOn: false }
        },
      }
    ];

    // Only show puzzle 2 if puzzle 1 is set to "low"
    if (gameState.puzzle1 === 'low' || gameState.puzzle1 === 'high') {
      nodes.push({
        id: '2',
        type: 'blockNode',
        position: { x: 200, y: 0 },
        data: { 
          puzzleId: 2, 
          puzzleName: 'Resonance Station',
          powerState: gameState.puzzle2,
          powerData: powerStatus['2'] || { inputPower: 0, outputPower: 0, isOn: false }
        },
      });
    }

    // Only show puzzle 3 if puzzle 2 is completed (not "off")
    if (gameState.puzzle2 !== 'off') {
      nodes.push({
        id: '3',
        type: 'blockNode',
        position: { x: 0, y: 200 },
        data: { 
          puzzleId: 3, 
          puzzleName: 'Pressure Balancing',
          powerState: gameState.puzzle3,
          powerData: powerStatus['3'] || { inputPower: 0, outputPower: 0, isOn: false }
        },
      });
    }

    // Only show puzzle 4 if puzzle 3 is completed (not "off")
    if (gameState.puzzle3 !== 'off') {
      nodes.push({
        id: '4',
        type: 'blockNode',
        position: { x: 200, y: 200 },
        data: { 
          puzzleId: 4, 
          puzzleName: 'Plant Breeding',
          powerState: gameState.puzzle4,
          powerData: powerStatus['4'] || { inputPower: 0, outputPower: 0, isOn: false }
        },
      });
    }

    // Only show Input and Output if puzzle 4 is completed (not "off")
    if (gameState.puzzle4 !== 'off') {
      nodes.push({
        id: '5',
        type: 'startNode',
        position: { x: -200, y: 0 },
        data: { 
          puzzleId: 5, 
          puzzleName: 'Input',
          powerState: null,
          powerData: { inputPower: 0, outputPower: 1, isOn: true }
        },
      });
      
      nodes.push({
        id: '6',
        type: 'endNode',
        position: { x: 400, y: 200 },
        data: { 
          puzzleId: 6, 
          puzzleName: 'Output',
          powerState: null,
          powerData: powerStatus['6'] || { inputPower: 0, outputPower: 0, isOn: false }
        },
      });
    }
    
    return nodes;
  }, [gameState.puzzle1, gameState.puzzle2, gameState.puzzle3, gameState.puzzle4, powerStatus]);

  const [nodes, setNodes] = useNodesState(initialNodes);

    // Update nodes when power status changes
    useMemo(() => {
      setNodes(nodes => nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          powerData: powerStatus[node.id] || { inputPower: 0, outputPower: 0, isOn: false }
        }
      })));
    }, [powerStatus, setNodes]);

  // Function to calculate power for each node
  const calculatePower = () => {
    const nodePowerStatus: Record<string, PowerData> = {
      '5': { inputPower: 0, outputPower: 1, isOn: true } // Start node is always on with 1 power output
    };
    
    // Define power requirements for each node
    const powerRequirements = {
      '1': { 
        lowThreshold: 2, 
        highThreshold: 2,
        lowOutput: 1.5, 
        highOutput: 3,
        maxPower: Infinity
      },
      '2': { 
        lowThreshold: 3, 
        highThreshold: 3,
        lowOutput: 2, 
        highOutput: 5,
        maxPower: Infinity
      },
      '3': { 
        lowThreshold: 4, 
        highThreshold: 7,
        lowOutput: 2.5, 
        highOutput: 6,
        maxPower: 10
      },
      '4': { 
        lowThreshold: 5, 
        highThreshold: 5,
        lowOutput: 3, 
        highOutput: 8,
        maxPower: Infinity
      },
      '6': { 
        lowThreshold: 6, 
        highThreshold: 13,
        lowOutput: 0,
        highOutput: 0,
        maxPower: 15 // End node overloads at 15+ power
      }
    };

    // Create a graph representation for traversal
    const graph: Record<string, {targets: string[], sourceHandle: string, targetHandle: string}[]> = {};
    gameState.edges.forEach(edge => {
      if (!graph[edge.source]) {
        graph[edge.source] = [];
      }
      graph[edge.source].push({
        targets: [edge.target],
        sourceHandle: edge.sourceHandle || '',
        targetHandle: edge.targetHandle || ''
      });
    });

    // Process nodes in topological order (we assume no cycles for simplicity)
    // Start with node 5 (the input node) and traverse the graph
    const processQueue = ['5']; // Start with the input node
    const processed = new Set<string>();

    while (processQueue.length > 0) {
      const nodeId = processQueue.shift()!;
      if (processed.has(nodeId)) continue;
      
      // Get all incoming edges to calculate input power
      let inputPower = 0;
      gameState.edges.forEach(edge => {
        if (edge.target === nodeId && processed.has(edge.source)) {
          // Get power from the source node
          const sourcePower = nodePowerStatus[edge.source]?.outputPower || 0;
          const sourceIsOn = nodePowerStatus[edge.source]?.isOn || false;
          
          if (sourceIsOn) {
            inputPower += sourcePower;
          }
        }
      });

      // Check if this node has unprocessed sources
      let hasUnprocessedSources = false;
      gameState.edges.forEach(edge => {
        if (edge.target === nodeId && !processed.has(edge.source)) {
          hasUnprocessedSources = true;
        }
      });

      if (hasUnprocessedSources) {
        processQueue.push(nodeId); // Put it back in the queue
        continue;
      }

      // Calculate if the node is on and its output power
      let isOn = false;
      let outputPower = 0;
      
      // Skip node 5 (input) as it's always on
      if (nodeId !== '5') {
        const requirements = powerRequirements[nodeId as keyof typeof powerRequirements];
        const nodeState = nodeId === '6' ? 'high' : gameState[`puzzle${nodeId}` as keyof typeof gameState];

        if (!requirements) {
          isOn = false;
        } else if (inputPower > requirements.maxPower) {
          // Node overloaded
          isOn = false;
        } else if (nodeState === 'low' && inputPower >= requirements.lowThreshold) {
          isOn = true;
          outputPower = requirements.lowOutput || 0;
        } else if (nodeState === 'high' && inputPower >= requirements.highThreshold) {
          isOn = true;
          outputPower = requirements.highOutput || 0;
        }
      } else {
        // Node 5 (input) is always on with 1 power output
        isOn = true;
        outputPower = 1;
      }

      nodePowerStatus[nodeId] = { inputPower, outputPower, isOn };
      processed.add(nodeId);

      // Add connected nodes to the queue
      if (graph[nodeId]) {
        graph[nodeId].forEach(conn => {
          if (!processed.has(conn.targets[0])) {
            processQueue.push(conn.targets[0]);
          }
        });
      }
    }

    setPowerStatus(nodePowerStatus);
    
    // Check if end node (node 6) meets completion criteria
    if (nodePowerStatus['6']) {
      const endNodePower = nodePowerStatus['6'].inputPower;
      
      if (endNodePower >= 6 && gameState.firstStage === 'incomplete') {
        // Complete round 1
        updateGameState({ firstStage: 'complete' });
        toast({
          title: "Round 1 Completed!",
          description: "You've successfully powered the output node. Now try for round 2!",
          variant: "default",
        });
      }
      
      if (endNodePower >= 13 && endNodePower < 15 && gameState.secondStage === 'incomplete') {
        // Complete round 2
        updateGameState({ secondStage: 'complete' });
        toast({
          title: "Round 2 Completed!",
          description: "Perfect power balance achieved! You've mastered the puzzle!",
          variant: "default",
        });
      } else if (endNodePower >= 15) {
        toast({
          title: "Overload!",
          description: "The output node has too much power. Try to reduce it below 15.",
          variant: "destructive",
        });
      }
    }
  };

  // Recalculate power when edges or game state changes
  useEffect(() => {
    calculatePower();
  }, [gameState.edges, gameState.puzzle1, gameState.puzzle2, gameState.puzzle3, gameState.puzzle4]);

  const onConnect = React.useCallback(
    (params: Connection) => {
      // Create a new edge with a unique ID
      const newEdge: Edge = {
        id: `e-${params.source}-${params.target}-${params.sourceHandle}-${params.targetHandle}`,
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle!,
        targetHandle: params.targetHandle!,
        type: 'default'
      };
      
      const cleanEdges = gameState.edges.filter(e => 
        `${params.source}-${params.sourceHandle}` !== `${e.source}-${e.sourceHandle}` && 
        `${params.target}-${params.targetHandle}` !== `${e.target}-${e.targetHandle}`
      );
      
      // Update the edges in the game state
      setEdges([...cleanEdges, newEdge]);
    },
    [gameState.edges, setEdges]
  );

  const resetEdges = () => {
    setEdges([]);
    updatePuzzleState('puzzle1', 'low');
    updatePuzzleState('puzzle2', 'low');
    updatePuzzleState('puzzle3', 'low');
    updatePuzzleState('puzzle4', 'low');
    updateGameState({ firstStage: 'incomplete' });
    updateGameState({ secondStage: 'incomplete' });
    updateGameState({...initialGameState, puzzle1: 'low', puzzle2: 'low', puzzle3: 'low', puzzle4: 'low'});

    toast({
      title: "Connections Reset",
      description: "All connections have been cleared.",
    });
  };

  const BlockNode = ({ data }: { data: { puzzleId: number, puzzleName: string, powerState?: 'low' | 'medium' | 'high' | 'off', powerData?: PowerData } }) => {
    const { powerData = { inputPower: 0, outputPower: 0, isOn: false }, powerState = 'off' } = data;
    
    return (
      <Block 
        onClick={() => navigate(`/puzzle${data.puzzleId}`)} 
        puzzleName={data.puzzleName} 
        powerState={powerState}
        powerData={powerData}
      />
    );
  };

  const StartNode = ({ data }: { data: { puzzleId: number, puzzleName: string, powerData?: PowerData } }) => {
    return (
      <StartBlock 
        onClick={() => navigate(`/puzzle${data.puzzleId}`)} 
        puzzleName={data.puzzleName} 
        powerData={data.powerData}
      />
    );
  };

  const EndNode = ({ data }: { data: { puzzleId: number, puzzleName: string, powerData?: PowerData } }) => {
    return (
      <EndBlock 
        onClick={() => navigate(`/puzzle${data.puzzleId}`)} 
        puzzleName={data.puzzleName} 
        powerData={data.powerData}
      />
    );
  };

  const nodeTypes = {
    blockNode: BlockNode,
    startNode: StartNode,
    endNode: EndNode,
  };

  return (
    <div className="w-full h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Power Distribution Network
          </h2>
          
          <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
            {gameState.firstStage === 'complete' &&
            
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span>Refinery: 🟢</span>
                 
                </div>
                <div className="flex justify-between">
                  <span>Factory: {gameState.secondStage === 'complete' ?  `🟢` : `🟨`} </span>
                  
                </div>
              
            </div>
            }
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetEdges}
                  className="flex items-center space-x-1"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRulesModal(true)}
                  className="flex items-center space-x-1"
                >
                  <Info className="h-4 w-4 mr-1" />
                  Info
                </Button>
              </div>
            </div>
            
          </div>
        </div>
        
        <div className="w-full h-[600px] bg-white rounded-xl shadow-sm">
          <ReactFlow
            nodes={nodes}
            edges={gameState.edges}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            fitView
          >
            <Background />
          </ReactFlow>
        </div>
      </div>
      
      <GameRulesModal 
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />
    </div>
  );
};

export default PuzzleGame;
