
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const GameInstructions = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-industrial-bg border-industrial-grid/50 hover:bg-industrial-grid/20">
          How to Play
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-industrial-bg border-industrial-grid text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl text-industrial-highlight">Grid Shift Navigator</DialogTitle>
          <DialogDescription className="text-foreground/80">
            Industrial Path Finding Puzzle
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-industrial-current mb-1">Objective</h3>
            <p className="text-sm">
              Navigate through a 12x12 industrial grid to reach one of two goal positions using a queue of predefined moves.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-industrial-current mb-1">Move Queue</h3>
            <p className="text-sm">
              You must use moves in the order they appear. Each move shows how many steps you must take in X and Y directions.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-industrial-current mb-1">Rotation Freedom</h3>
            <p className="text-sm">
              For each move, you choose the direction. For example, a move (2,1) means:
            </p>
            <ul className="text-xs list-disc list-inside mt-1 pl-2">
              <li>2 right, 1 up</li>
              <li>2 left, 1 up</li>
              <li>2 right, 1 down</li>
              <li>2 left, 1 down</li>
              <li>1 right, 2 up</li>
              <li>1 left, 2 up</li>
              <li>1 right, 2 down</li>
              <li>1 left, 2 down</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-industrial-current mb-1">Rules</h3>
            <ul className="text-xs list-disc list-inside pl-2 space-y-1">
              <li>Moves must be used in order</li>
              <li>Moving off the grid results in failure</li>
              <li>Reach either goal before using all moves to win</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameInstructions;
