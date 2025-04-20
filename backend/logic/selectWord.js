
export function selectWord(words, length, allowDuplicates) {
  const filteredWords = words.filter(word => word.length === length);
  if (filteredWords.length === 0) {
    return { error: 'Inget ord med det valda antalet bokstäver finns att tillgå.' };
  }

  let finalWords;

  if (allowDuplicates) {
    finalWords = filteredWords;
  } else {
    finalWords = filteredWords.filter(word => {
      let uniqueLetters = new Set(word);
      return uniqueLetters.size === word.length;
    });
  }

  if (finalWords.length === 0) {
    return { error: 'Inget ord med unika bokstäver finns som matchar kriterierna.' };
  }

  const randomIndex = Math.floor(Math.random() * finalWords.length);
  const selectedWord = finalWords[randomIndex];
  return { word: selectedWord };
}