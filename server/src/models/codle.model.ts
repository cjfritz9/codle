const wordList: string[] = [
  'debug',
  'linux',
  'swift',
  'array',
  'shell',
  'patch',
  'regex',
  'stack',
  'queue',
  'error',
  'ascii',
  'class',
  'token',
  'loops',
  'scope',
  'timer',
  'input',
  'float',
  'catch',
  'break',
  'index',
  'merge',
  'event',
  'enums',
  'print',
  'cache',
  'value',
  'mutex',
  'parse',
  'logic',
  'nodes',
  'lists',
  'union',
  'watch',
  'build',
  'click',
  'cloud',
  'flask',
  'mysql',
  'pixel',
  'react',
  'agile',
  'https',
  'await',
  'query',
  'mongo',
  'figma',
  'bytes'
];

const getList = () => {
  if (isListValid(wordList)) {
    return wordList;
  } else {
    return;
  }
};

const isListValid = (list: typeof wordList) => {
  const invalidItems = list.filter((word) => word.length !== 5);
  if (hasDuplicates(list)) {
    const duplicates = getDuplicates(list);
    throw new Error('List contains duplicate items', {
      cause: { duplicates }
    });
  }

  if (invalidItems.length !== 0) {
    throw new Error('Invalid word(s) in list', {
      cause: { invalidItems }
    });
  }

  return true;
};

const hasDuplicates = (list: typeof wordList) => {
  if ([...new Set(list)].length !== list.length) {
    return true;
  } else {
    return false;
  }
};

const getDuplicates = (list: typeof wordList) => {
  return list.filter((word, i) => list.indexOf(word) !== i);
};

const removeDuplicates = (list: typeof wordList) => {
  return list.filter((word, i) => list.indexOf(word) === i);
};

const getNewDailyWord = (): string | undefined => {
  const wordsPerDay = Math.floor(wordList.length / 7);
  const dayNumber = new Date().getDay() + 1;
  const wordChoices = wordList.slice(
    (dayNumber - 1) * wordsPerDay,
    dayNumber * wordsPerDay
  );
  return wordChoices[Math.floor(Math.random() * wordChoices.length)];
};

export const getWordsObject = () => {
  const wordsPerDay = Math.round(wordList.length / 7);

  return {
    monday: wordList.slice(wordsPerDay * 0, wordsPerDay * 1),
    tuesday: wordList.slice(wordsPerDay * 1, wordsPerDay * 2),
    wednesday: wordList.slice(wordsPerDay * 2, wordsPerDay * 3),
    thursday: wordList.slice(wordsPerDay * 3, wordsPerDay * 4),
    friday: wordList.slice(wordsPerDay * 4, wordsPerDay * 5),
    saturday: wordList.slice(wordsPerDay * 5, wordsPerDay * 6),
    sunday: wordList.slice(wordsPerDay * 6)
  };
};

const wordsData = getWordsObject();

for (const word in wordsData) {
  console.log(word);
  console.log(wordsData[word as keyof typeof wordsData]);
  // weekdays.doc(word).update({words: wordsData[word as keyof typeof wordsData]})
}

export default getNewDailyWord;
