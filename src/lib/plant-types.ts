
// Plant trait types
export type BerryColor = "Blue" | "Red" | "Yellow" | "Purple" | "Green" | "Orange" | "Brown" | "Teal" | "Blurple";
export type Shape = "Short" | "Medium" | "Tall" | "Bushy" | "Vine" | "Sprawling" | "Twisted" | "Drooping" | "Split";
export type PetalCount = 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const shapeIndex: { [K in Shape]: number } = {
  Short:    0,
  Medium:   1,
  Tall:     2,
  Bushy:    3,
  Vine:     4,
  Sprawling:5,
  Twisted:  6,
  Drooping: 7,
  Split:    8,
};

// Plant data structure
export interface Plant {
  id: string;
  berryColor: BerryColor;
  shape: Shape;
  petalCount: PetalCount;
}

// Color wheel positions for berry colors (in degrees on a 360 color wheel)
export const colorPositions: Record<BerryColor, number> = {
  Red: 0,
  Brown: 15,
  Orange: 30, 
  Yellow: 60,
  Green: 120, 
  Teal: 150,
  Blue: 200,
  Blurple: 250,
  Purple: 300
};


// Get color from position on the wheel
export function getColorFromPosition(position: number): BerryColor {
  // Normalize position to 0-360 range
  position = ((position % 360) + 360) % 360;
  
  // Find the closest color
  const colors = Object.entries(colorPositions);
  let closestColor: BerryColor = "Red";
  let minDistance = 360;
  
  for (const [color, pos] of colors) {
    const distance = Math.min(
      Math.abs(position - pos), 
      Math.abs(position - (pos + 360)),
      Math.abs((position + 360) - pos)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color as BerryColor;
    }
  }
  
  return closestColor;
}

// Mix two colors based on the color wheel
export function mixColors(color1: BerryColor, color2: BerryColor): BerryColor {
  if (color1 === color2) return color1;
  
  const pos1 = colorPositions[color1];
  const pos2 = colorPositions[color2];
  
  // Calculate the average position, handling the wrap-around
  let avgPos;
  const diff = Math.abs(pos1 - pos2);
  
  if (diff > 180) {
    // Colors are across the wheel, special handling required
    const min = Math.min(pos1, pos2);
    const max = Math.max(pos1, pos2);
    avgPos = (min + max + 360) / 2;
    if (avgPos >= 360) avgPos -= 360;
  } else {
    // Normal average
    avgPos = (pos1 + pos2) / 2;
  }
  
  return getColorFromPosition(avgPos);
}

export function mixShapes(shape1: Shape, shape2: Shape): Shape {
  const upperShape =
    shapeIndex[shape1] > shapeIndex[shape2] ? shape1 : shape2;
  const lowerShape =
    shapeIndex[shape2] > shapeIndex[shape1] ? shape1 : shape2;

  if (upperShape === lowerShape) {
    return lowerShape;
  }

  // Height mixing
  if (
    lowerShape === "Short" &&
    (upperShape === "Medium" || upperShape === "Tall")
  ) {
    return "Medium";
  }
  if (lowerShape === "Medium" && upperShape === "Tall") {
    return "Medium";
  }

  // Vining / sprawling
  if (
    lowerShape === "Short" &&
    (upperShape === "Vine" || upperShape === "Sprawling")
  ) {
    return "Bushy";
  }
  if (
    lowerShape === "Tall" &&
    (upperShape === "Vine" || upperShape === "Sprawling")
  ) {
    return "Vine";
  }
  if (
    lowerShape === "Medium" &&
    (upperShape === "Vine" ||
      upperShape === "Sprawling" ||
      upperShape === "Twisted" ||
      upperShape === "Drooping")
  ) {
    return "Drooping";
  }

  // Short + exotic
  if (lowerShape === "Short" && upperShape === "Twisted") {
    return "Bushy";
  }
  if (lowerShape === "Short" && upperShape === "Drooping") {
    return "Sprawling";
  }
  if (lowerShape === "Short" && upperShape === "Split") {
    return "Bushy";
  }

  // Tall + exotic
  if (lowerShape === "Tall" && upperShape === "Twisted") {
    return "Twisted";
  }
  if (lowerShape === "Tall" && upperShape === "Drooping") {
    return "Drooping";
  }
  if (lowerShape === "Tall" && upperShape === "Split") {
    return "Split";
  }

  // Medium + split
  if (lowerShape === "Medium" && upperShape === "Split") {
    return "Split";
  }

  // Bushy with anything
  if (lowerShape === "Bushy" && upperShape === "Vine") {
    return "Bushy";
  }
  if (lowerShape === "Bushy" && upperShape === "Sprawling") {
    return "Sprawling";
  }
  if (lowerShape === "Bushy" && upperShape === "Twisted") {
    return "Twisted";
  }
  if (lowerShape === "Bushy" && upperShape === "Drooping") {
    return "Drooping";
  }
  if (lowerShape === "Bushy" && upperShape === "Split") {
    return "Split";
  }

  // Vine with higher forms
  if (lowerShape === "Vine" && upperShape === "Sprawling") {
    return "Sprawling";
  }
  if (lowerShape === "Vine" && upperShape === "Twisted") {
    return "Twisted";
  }
  if (lowerShape === "Vine" && upperShape === "Drooping") {
    return "Drooping";
  }
  if (lowerShape === "Vine" && upperShape === "Split") {
    return "Split";
  }

  // Sprawling with higher forms
  if (lowerShape === "Sprawling" && upperShape === "Twisted") {
    return "Twisted";
  }
  if (lowerShape === "Sprawling" && upperShape === "Drooping") {
    return "Drooping";
  }
  if (lowerShape === "Sprawling" && upperShape === "Split") {
    return "Split";
  }

  // Twisted + higher
  if (lowerShape === "Twisted" && upperShape === "Drooping") {
    return "Drooping";
  }
  if (lowerShape === "Twisted" && upperShape === "Split") {
    return "Split";
  }

  // Drooping + split
  if (lowerShape === "Drooping" && upperShape === "Split") {
    return "Split";
  }

  // Fallback
  return "Medium";
}
// Mix petal counts based on the rule
export function mixPetalCounts(count1: PetalCount, count2: PetalCount): PetalCount {
  if (count1 === count2) return count1;
  if((count1 + count2) <= 9 ){
    return (count1 + count2) as PetalCount;
  }
  else {
    return 9 as PetalCount;
  }
}

// Generate a hybrid plant from two parents
export function hybridize(parent1: Plant, parent2: Plant): Plant {
  const berryColor = mixColors(parent1.berryColor, parent2.berryColor);
  const shape = mixShapes(parent1.shape, parent2.shape);
  const petalCount = mixPetalCounts(parent1.petalCount, parent2.petalCount);
  
  return {
    id: `hybrid-${parent1.id}-${parent2.id}`,
    berryColor,
    shape,
    petalCount
  };
}

// Generate the initial plants based on the rules
export function generateInitialPlants(): Plant[] {

  const plants: Plant[] = [
    // Blue variants
    { id: "1", berryColor: "Blue",   shape: "Short",    petalCount: 3 },
    { id: "2", berryColor: "Blue",   shape: "Medium",   petalCount: 4 },
    { id: "3", berryColor: "Blue",   shape: "Tall",     petalCount: 5 },
    { id: "4", berryColor: "Blue",   shape: "Bushy",    petalCount: 6 },
  
    // Red variants
    { id: "5", berryColor: "Red",    shape: "Vine",     petalCount: 4 },
    { id: "6", berryColor: "Red",    shape: "Sprawling",petalCount: 5 },
    { id: "7", berryColor: "Red",    shape: "Twisted",  petalCount: 6 },
    { id: "8", berryColor: "Red",    shape: "Drooping", petalCount: 7 },
  
    // Yellow variants
    { id: "9", berryColor: "Yellow", shape: "Split",    petalCount: 5 },
    { id: "10", berryColor: "Yellow", shape: "Short",    petalCount: 6 },
    { id: "11", berryColor: "Yellow", shape: "Vine",     petalCount: 7 },
    { id: "12", berryColor: "Yellow", shape: "Sprawling",petalCount: 8 },
  
    // Purple variants
    { id: "13", berryColor: "Purple", shape: "Medium",   petalCount: 3 },
    { id: "14", berryColor: "Purple", shape: "Tall",     petalCount: 5 },
    { id: "15", berryColor: "Purple", shape: "Twisted",  petalCount: 7 },
    { id: "16", berryColor: "Purple", shape: "Split",    petalCount: 9 },
  
    // Green variants
    { id: "17", berryColor: "Green",  shape: "Bushy",    petalCount: 4 },
    { id: "18", berryColor: "Green",  shape: "Drooping", petalCount: 6 },
    { id: "19", berryColor: "Green",  shape: "Sprawling",petalCount: 8 },
    { id: "20", berryColor: "Green",  shape: "Short",    petalCount: 9 },
  
    // Orange variants
    { id: "21", berryColor: "Orange", shape: "Twisted",  petalCount: 3 },
    { id: "22", berryColor: "Orange", shape: "Split",    petalCount: 4 },
    { id: "23", berryColor: "Orange", shape: "Medium",   petalCount: 5 },
    { id: "24", berryColor: "Orange", shape: "Tall",     petalCount: 6 },
  
    // Brown variants
    { id: "25", berryColor: "Brown",  shape: "Vine",     petalCount: 7 },
    { id: "26", berryColor: "Brown",  shape: "Drooping", petalCount: 8 },
    { id: "27", berryColor: "Brown",  shape: "Bushy",    petalCount: 9 },
    { id: "28", berryColor: "Brown",  shape: "Split",    petalCount: 3 },

    { id: "29", berryColor: "Yellow", shape: "Split",    petalCount: 4 },
    { id: "30", berryColor: "Yellow", shape: "Tall",    petalCount: 3 },
    { id: "31", berryColor: "Blue", shape: "Sprawling",    petalCount: 7 },
    { id: "32", berryColor: "Green", shape: "Sprawling",    petalCount: 7 },

  ];
  shuffle(plants);
  return plants;
}
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

// Define the target plant
export const targetPlant: Plant = {
  id: "target",
  berryColor: "Green",
  shape: "Bushy",
  petalCount: 7
};

export const targetPlant2: Plant = {
  id: "target2",
  berryColor: "Blurple",
  shape: "Twisted",
  petalCount: 9
};