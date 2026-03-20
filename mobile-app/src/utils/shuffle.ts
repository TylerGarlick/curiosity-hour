// Fisher-Yates shuffle implementation
// Produces an unbiased random permutation of an array

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  
  for (let i = result.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at i and j
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}

// Fisher-Yates shuffle that also returns the shuffled array (in-place variant)
export function shuffleInPlace<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Pick a random element from an array
export function randomPick<T>(array: T[]): T | null {
  if (array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

// Pick n random elements from an array (without replacement)
export function randomPickN<T>(array: T[], n: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(n, array.length));
}
