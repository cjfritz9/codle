export interface DailyWordDocument {
  word: string;
  updatedAt: string;
}

export interface WordListDocument {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

export interface FullWordListDocument {
  list: string[];
}

export interface UserDataDocument {
  updatedAt: string;
  guesses: string[];
  guessMap: string;
  didWin: boolean;
}

export interface UserDataParams {
  guesses: any[];
  guessMap: string;
  didWin: boolean;
}

export interface UserData {
  id: string;
  updatedAt: string;
  guesses: string[];
  guessMap: string;
  didWin: boolean;
}
