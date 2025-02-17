export interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}

export interface Guess {
  coinId: string;
  timestamp: number;
  direction: 'up' | 'down';
  amount: number;
  result?: 'win' | 'loss';
  priceAtGuess: number;
  priceAfterHolding: number;
}

export interface User {
  username: string;
  balance: number;
  completedTasks: string[];
  guessHistory: Guess[];
}