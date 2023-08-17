import http from 'http';
import app from './app.js';
import { getWordsObject } from './models/codle.model.js';
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
server.listen(PORT, () => {
    const wordsData = getWordsObject();
    for (const word in wordsData) {
        console.log('word', word);
        console.log('words data', wordsData[word]);
        // weekdays.doc(word).update({words: wordsData[word as keyof typeof wordsData]})
    }
    console.log('Server listening on port: ' + PORT);
});
