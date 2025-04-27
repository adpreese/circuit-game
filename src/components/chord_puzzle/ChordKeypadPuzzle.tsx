
import { useState, useEffect } from 'react';
import KeypadButton from './KeypadButton';
import { NoteName, playInterval, playSuccessSound, playErrorSound, playChord } from '@/utils/audioUtils';
import { Music } from 'lucide-react';
import { toast } from "sonner";

// Define the row and column notes
const ROW_NOTES: NoteName[] = ['A', 'B', 'C#', 'E'];
const COLUMN_NOTES: NoteName[] = ['G#', 'B', 'D#', 'F#'];

// Define a major 7th chord structure - needs to contain root, major 3rd, perfect 5th, major 7th
// For EMaj7: E (root), G# (major 3rd), B (perfect 5th), D# (major 7th)
const EMAJ_7_CHORD_NOTES: NoteName[] = ['E', 'G#', 'B', 'D#'];
const CSHARP_MIN_7_CHORD_NOTES: NoteName[] = ['C#', 'E', 'G#', 'B'];
const FSHARP_MIN_7_CHORD_NOTES: NoteName[] = ['F#', 'A', 'C#', 'E'];

type KeyPress = {
  row: number;
  col: number;
  rowNote: NoteName;
  colNote: NoteName;
};

interface GameProps {
  onComplete: (status: 'low' | 'high' | 'off') => void;
  firstStageComplete: boolean
}

export default function ChordKeypadPuzzle({ onComplete, firstStageComplete}: GameProps) {
  const [pressedKeys, setPressedKeys] = useState<KeyPress[]>([]);
  const [activeCells, setActiveCells] = useState<{[key: string]: boolean}>({});
  const [successState, setSuccessState] = useState<boolean | null>(null);
  const [noteLog, setNoteLog] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState(false);

  // Method to check if two keypresses complete the major 7th chord
  const checkForChord = (keys: KeyPress[]): "off" | "low" | "high" => {
    if (keys.length !== 2) return null;

    // Get all the notes from the two key presses
    const notes = keys.flatMap(key => [key.rowNote, key.colNote]);
    
    if(EMAJ_7_CHORD_NOTES.every(note => notes.includes(note))){
      return "low";
    }else if (CSHARP_MIN_7_CHORD_NOTES.every(note => notes.includes(note)) || FSHARP_MIN_7_CHORD_NOTES.every(note => notes.includes(note))){
      return "high";
    }
    return "off";
  };

  // Handle key press
  const handleKeyPress = (row: number, col: number) => {
    if (isSolved) return;

    const rowNote = ROW_NOTES[row];
    const colNote = COLUMN_NOTES[col];
    
    // Play the interval
    playInterval(rowNote, colNote, 800);
    
    // Add to pressed keys
    const newKeyPress = { row, col, rowNote, colNote };
    const newPressedKeys = [...pressedKeys, newKeyPress];
    setPressedKeys(newPressedKeys);
    
    // Update active cells
    const cellKey = `${row}-${col}`;
    setActiveCells(prev => ({ ...prev, [cellKey]: true }));
    
    // Add to note log
    setNoteLog(prev => [...prev, `Played: ${rowNote} + ${colNote}`]);
    
    // Check if two keys have been pressed
    if (newPressedKeys.length === 2) {
      // Check if the two key presses form the major 7th chord
      const chordSuccess = checkForChord(newPressedKeys);
      const success = chordSuccess !== null && chordSuccess !== "off";
      if(success){
        onComplete(chordSuccess);
      }
      setTimeout(() => {
        setSuccessState(success);
        
        if (success) {
          playSuccessSound();
          setIsSolved(true);
          setNoteLog(prev => [...prev, "Success! You played the chord!"]);
          toast.success("Puzzle solved! You found the chord!");
        } else {
          playErrorSound();
          setNoteLog(prev => [...prev, "Incorrect combination. Try again."]);
          
          // Reset after a short delay
          setTimeout(() => {
            setPressedKeys([]);
            setActiveCells({});
            setSuccessState(null);
          }, 1500);
        }
      }, 300);
    }
  };

  // Reset the puzzle
  const resetPuzzle = () => {
    setPressedKeys([]);
    setActiveCells({});
    setSuccessState(null);
    setIsSolved(false);
    setNoteLog(["Puzzle reset. Find the EMaj7 chord!"]);
  };

  // Auto-scroll the note log to the bottom
  useEffect(() => {
    const logElement = document.getElementById("note-log");
    if (logElement) {
      logElement.scrollTop = logElement.scrollHeight;
    }
  }, [noteLog]);

  // Initialize with instructions
  useEffect(() => {
    setNoteLog([
      firstStageComplete ? "Play a major 7th chord tuned to the crystal's resonance" : "Play a major or minor 7th chord tuned to the crystal's resonance",
    ]);
  }, []);

  // Helper function to determine if a cell is in success or error state
  const getCellState = (row: number, col: number) => {
    const cellKey = `${row}-${col}`;
    const isActive = activeCells[cellKey];
    
    if (isActive) {
      return {
        isActive: true,
        isSuccess: successState === true,
        isError: successState === false
      };
    }
    
    return {
      isActive: false,
      isSuccess: false,
      isError: false
    };
  };

  // Create 4x4 keypad
  const renderKeypad = () => {
    const keypad = [];
    
    for (let row = 0; row < 4; row++) {
      const rowButtons = [];
      
      for (let col = 0; col < 4; col++) {
        const { isActive, isSuccess, isError } = getCellState(row, col);
        
        rowButtons.push(
          <div key={`key-${row}-${col}`} className="m-1">
            <KeypadButton
              rowIndex={row}
              colIndex={col}
              onPress={handleKeyPress}
              isActive={isActive}
              isSuccess={isSuccess}
              isError={isError}
            />
          </div>
        );
      }
      
      keypad.push(
        <div key={`row-${row}`} className="flex justify-center">
          {rowButtons}
        </div>
      );
    }
    
    return keypad;
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto gap-6 p-4">
      {/* Left side - Note log */}
      <div className="w-full md:w-1/3 bg-puzzle-dark rounded-lg p-4 shadow-lg">
        <div className="flex items-center mb-4 text-white">
          <Music className="w-6 h-6 text-puzzle-primary mr-2" />
          <h2 className="text-xl font-bold">Musical Notes Log</h2>
        </div>
        <div 
          id="note-log"
          className="h-64 md:h-96 overflow-y-auto bg-black bg-opacity-30 rounded p-3 text-white text-sm font-mono"
        >
          {noteLog.map((note, index) => (
            <div key={index} className="py-1">{note}</div>
          ))}
        </div>
      </div>

      {/* Right side - Keypad */}
      <div className="w-full md:w-2/3 bg-puzzle-background rounded-lg p-6 shadow-lg">
        {/* Keypad */}
        <div className="flex flex-col items-center gap-2">
          {renderKeypad()}
        </div>

        {/* Row and Column labels */}
        <div className="mt-6 flex justify-center text-puzzle-neutral">
          <div className="grid grid-cols-2 gap-x-16 gap-y-2">
           
          </div>
        </div>

        {/* Reset button */}
        {isSolved && (
          <div className="text-center mt-6">
            <button
              onClick={resetPuzzle}
              className="bg-puzzle-primary hover:bg-puzzle-secondary text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
