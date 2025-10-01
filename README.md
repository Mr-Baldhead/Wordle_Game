## Projektbeskrivning
Detta projekt är ett försök att återskapa det populära ordspelet Wordle. Spelet går ut på att gissa ett ord på ett visst antal bokstäver inom sex försök. Efter varje gissning får spelaren feedback om vilka bokstäver som är korrekta och på rätt plats, vilka som är korrekta men på fel plats, och vilka som inte finns i ordet.
Projektet utvecklades som en del av en JavaScript-kurs för att demonstrera kunskaper inom fullstack-utveckling med React, Express och MongoDB.
Funktioner

- Spela med ord av olika längd (4-8 bokstäver)
- Valmöjlighet att tillåta eller förbjuda dubbla bokstäver
- Färgkodad feedback på gissningar
- Tidtagning för att mäta hur snabbt spelaren löser ordet
- Highscore-system som sparar de bästa resultaten i en databas
- Responsiv design som fungerar på både mobila enheter och datorer

Teknisk stack - Projektet använder följande teknologier:
React
Node.js
Express
MongoDB
Mongoose
Vite
EJS

Hur man spelar
1. Välj ordlängd (4-8 bokstäver) och om du vill tillåta dubbla bokstäver. 2. Klicka på "Starta spel".
2.  Gissa ordet genom att skriva in ditt förslag och trycka på Enter eller klicka på "Gissa".
3. Efter varje gissning får du färgkodad feedback:
🟩 - Bokstaven är korrekt och på rätt plats
🟨 - Bokstaven finns i ordet men på fel plats
⬜ - Bokstaven finns inte i ordet
4. Du har maximalt sex försök på dig att gissa ordet.
5. Om du lyckas kan du skicka in ditt resultat till highscore-listan!


