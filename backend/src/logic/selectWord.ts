
export interface SelectWordResult {
  word?: string;
  error?: string;
}

export default function selectWord(
  words: string[], 
  length: number, 
  allowDuplicates: boolean
): SelectWordResult {
  // Filtrera ord baserat på längd
  const filteredWords = words.filter(word => word.length === length);
  if (filteredWords.length === 0) {
    return { error: 'Inget ord med det valda antalet bokstäver finns att tillgå.' };
  }

  let finalWords: string[];

  // Kontrollera om dubbletter är tillåtna
  if (allowDuplicates) {
    finalWords = filteredWords;
  } else {
    finalWords = filteredWords.filter(word => {
      const uniqueLetters = new Set(word);
      return uniqueLetters.size === word.length; // Kontrollera att alla bokstäver är unika
    });
  }

  if (finalWords.length === 0) {
    return { error: 'Inget ord med unika bokstäver finns som matchar kriterierna.' };
  }

  // Välj ett slumpmässigt ord från resultatlistan
  const randomIndex = Math.floor(Math.random() * finalWords.length);
  const selectedWord = finalWords[randomIndex];
  return { word: selectedWord };
}