/*
1. Dela upp gissningsordet i bokstäver och lägg dem i array splitGuess
2. Dela upp svarsordet i bokstäver och lägg dem i array splitAnswer
3. Skapa arrayen result
4. Fyll result med ordet incorrect på lika många platser som gissningsordet
5. Skapa map med namnet letterCount
6. För varje bokstav:
    6:1. Addera 1 på det befintliga värdet på varje bokstav letterCount. Lika bokstäver får högre summa.
    6:2. Om bokstaven inte finns i splitPicked sätt värdet till 0 i letterCount istället för undefined.

7. För varje bokstav:
    7:1. Om gissad bokstav är lika med picked bokstav sätt correct i result
    7:2. Ta bort 1 från summan av den bokstaven i letterCount.

8. För varje bokstav:
    8:1. Om bokstav är correct gå till nästa
    8.2. Om bokstav har en summa som är mer än 0 skriv misplaced i result
    8:3. Ta bort 1 från summan för den bokstaven i letterCount
*/

//const guess = 'STORM';
//const picked = 'STARK';

export const wordle = (guess, picked) => {
    const splitPicked = picked.split('');
    const splitGuess = guess.split('');
    const result = Array(guess.length).fill('incorrect');

    const letterCount = new Map();
    splitPicked.forEach(letter => {
        letterCount.set(letter, (letterCount.get(letter) || 0) + 1);
    });

    splitGuess.forEach((letter, i) => {
        if(letter === splitPicked[i]) {
            result[i] = 'correct';
            letterCount.set(letter, letterCount.get(letter) - 1);
        }
    }); 

    splitGuess.forEach((letter, i) => {
        if (result[i] === 'correct') return;
        
        if (letterCount.get(letter) > 0) {
            result[i] = 'misplaced';
            letterCount.set(letter, letterCount.get(letter) - 1);
            
            
        }
        
    });
        // console.log(letterCount);
        // console.log(result);

    return result;
    

};



