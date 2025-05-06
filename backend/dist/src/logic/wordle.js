export const wordle = (guess, picked) => {
    const splitPicked = picked.split('');
    const splitGuess = guess.split('');
    const result = Array(guess.length).fill('incorrect');
    const letterCount = new Map();
    splitPicked.forEach(letter => {
        letterCount.set(letter, (letterCount.get(letter) || 0) + 1);
    });
    // Kontrollera korrekta bokstäver på rätt plats
    splitGuess.forEach((letter, i) => {
        if (letter === splitPicked[i]) {
            result[i] = 'correct';
            letterCount.set(letter, letterCount.get(letter) - 1);
        }
    });
    // Kontrollera "misplaced" bokstäver
    splitGuess.forEach((letter, i) => {
        if (result[i] === 'correct')
            return;
        if (letterCount.get(letter) && letterCount.get(letter) > 0) {
            result[i] = 'misplaced';
            letterCount.set(letter, letterCount.get(letter) - 1);
        }
    });
    return result;
};
