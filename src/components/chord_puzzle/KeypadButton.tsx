
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

// Define musical symbols for buttons
const MUSICAL_SYMBOLS = [
  "💠", "◼️", "🔮", "🜙", "🕳️", "🗝️", "🕯️", "🦴",
  "☁️", "🕸️", "🌑", "🐉", "🗿", "🧩", "📜", "🧿"
];

type KeypadButtonProps = {
  rowIndex: number;
  colIndex: number;
  onPress: (row: number, col: number) => void;
  isActive: boolean;
  isSuccess?: boolean;
  isError?: boolean;
};

export default function KeypadButton({ 
  rowIndex, 
  colIndex, 
  onPress, 
  isActive,
  isSuccess,
  isError
}: KeypadButtonProps) {
  const [symbol, setSymbol] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Use a deterministic symbol based on position
    const symbolIndex = (rowIndex * 4 + colIndex) % MUSICAL_SYMBOLS.length;
    setSymbol(MUSICAL_SYMBOLS[symbolIndex]);
  }, [rowIndex, colIndex]);

  const handleClick = () => {
    onPress(rowIndex, colIndex);
  };

  return (
    <button
      className={cn(
        "w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center",
        "transition-all  transform",
        "text-white text-2xl font-bold",
        "border-2 border-puzzle-neutral",
        "bg-puzzle-background",
        isHovered ? "border-puzzle-highlight scale-105" : "",
        isActive ? "animate-flash border-puzzle-primary bg-puzzle-dark" : "",
        isSuccess ? "animate-success-flash border-puzzle-success" : "",
        isError ? "animate-error-flash border-puzzle-error" : "",
        !isActive && !isSuccess && !isError ? "animate-pulse-glow" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {symbol}
    </button>
  );
}
