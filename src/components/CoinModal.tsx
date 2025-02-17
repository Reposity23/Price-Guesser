import React, { useState, useEffect } from 'react';
import { Coin, Guess } from '../types';
import { IoArrowBack } from 'react-icons/io5';
import PriceChart from './PriceChart';

interface Props {
  coin: Coin;
  isOpen: boolean;
  onClose: () => void;
  onGuess: (direction: 'up' | 'down', amount: number) => void;
  guessHistory: Guess[];
}

const CoinModal: React.FC<Props> = ({ coin, isOpen, onClose, onGuess, guessHistory }) => {
  const [showGuessOptions, setShowGuessOptions] = useState(false);
  const [betAmount, setBetAmount] = useState(5);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [currentPrice, setCurrentPrice] = useState(coin.current_price);

  useEffect(() => {
    // Initialize price history with current price
    setPriceHistory([coin.current_price]);

    // Simulate price changes every second
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * (prev * 0.002); // Random price change ±0.1%
        const newPrice = prev + change;
        setPriceHistory(history => [...history.slice(-50), newPrice]); // Keep last 50 points
        return newPrice;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [coin.current_price]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-auto">
      <div className="p-4">
        <button 
          onClick={onClose}
          className="flex items-center text-gray-600 dark:text-gray-300 mb-4 hover:text-gray-900 dark:hover:text-white"
        >
          <IoArrowBack className="w-6 h-6 mr-2" />
          <span>Back</span>
        </button>

        <h2 className="text-2xl font-bold mb-4 dark:text-white">{coin.name}</h2>
        <div className="mb-4 h-64 rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800">
          <PriceChart data={priceHistory} />
        </div>
        
        <div className="mb-4">
          <h3 className="text-xl font-semibold dark:text-white">Current Price</h3>
          <p className="text-2xl dark:text-white">${currentPrice.toFixed(2)}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2 dark:text-white">Guess History</h3>
          {guessHistory.length === 0 ? (
            <p className="dark:text-gray-300">No guesses yet</p>
          ) : (
            <div className="space-y-2">
              {guessHistory.map((guess, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <span className="dark:text-gray-300">
                    {coin.name} guess: {guess.direction}
                  </span>
                  <span className={
                    !guess.result 
                      ? 'text-yellow-500'
                      : guess.result === 'win'
                        ? 'text-green-500'
                        : 'text-red-500'
                  }>
                    {!guess.result 
                      ? `pending ($${guess.amount})`
                      : guess.result === 'win'
                        ? `+$${guess.amount}`
                        : `-$${guess.amount}`
                    }
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {showGuessOptions ? (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-lg">
            <div className="max-w-md mx-auto">
              <p className="text-lg mb-2 dark:text-white">Current Price: ${currentPrice.toFixed(2)}</p>
              <p className="text-lg mb-4 dark:text-white">Holding: 1 min</p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bet Amount ($)
                </label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(1, Math.min(100, Number(e.target.value))))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="1"
                  max="100"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    onGuess('down', betAmount);
                    setShowGuessOptions(false);
                  }}
                  className="bg-red-500 text-white p-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Bearish
                </button>
                <button
                  onClick={() => {
                    onGuess('up', betAmount);
                    setShowGuessOptions(false);
                  }}
                  className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Bullish
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowGuessOptions(true)}
            className="w-full bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Make a Guess
          </button>
        )}
      </div>
    </div>
  );
};

export default CoinModal;