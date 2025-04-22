import { selectWord } from './selectWord.js';

// Export the wordService object with the methods we need
export const wordService = {
  getRandomWord(length = 5, allowDuplicates = false) {
    return selectWord(length, allowDuplicates);
  },
  
  getWordsByLength(length = 5, allowDuplicates = false) {

    const word = selectWord(length, allowDuplicates);
    return word ? true : false;
  }
};