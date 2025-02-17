import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useTheme } from 'next-themes';
import CoinList from './components/CoinList';
import CoinModal from './components/CoinModal';
import Tasks from './components/Tasks';
import { tg, getUserData, saveUserData } from './utils/telegram';
import { Coin, User, Guess } from './types';
import { IoMoon, IoSunny } from 'react-icons/io5';

const queryClient = new QueryClient();

const DEFAULT_USER: User = {
  username: tg.initDataUnsafe?.user?.username || 'Guest',
  balance: 50,
  completedTasks: [],
  guessHistory: [],
};

function AppContent() {
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    tg.ready();
    const savedData = getUserData();
    if (savedData) {
      setUser(savedData);
    }
  }, []);

  const handleGuess = (direction: 'up' | 'down', amount: number) => {
    if (!selectedCoin || user.balance < amount) return;

    const currentPrice = selectedCoin.current_price;
    const guess: Guess = {
      coinId: selectedCoin.id,
      timestamp: Date.now(),
      direction,
      amount,
      priceAtGuess: currentPrice,
      priceAfterHolding: currentPrice,
    };

    // Deduct bet amount immediately
    const newUser = {
      ...user,
      balance: user.balance - amount,
      guessHistory: [...user.guessHistory, guess],
    };
    setUser(newUser);
    saveUserData(newUser);
    
    setTimeout(() => {
      // Simulate price change after 1 minute
      const priceChange = Math.random() * 2 - 1; // Random price change
      const newPrice = currentPrice * (1 + priceChange / 100);
      
      const isWin = (direction === 'up' && newPrice > currentPrice) ||
                   (direction === 'down' && newPrice < currentPrice);
      
      const updatedGuess: Guess = {
        ...guess,
        result: isWin ? 'win' : 'loss',
        priceAfterHolding: newPrice,
      };

      const finalUser = {
        ...newUser,
        balance: newUser.balance + (isWin ? amount * 2 : 0),
        guessHistory: newUser.guessHistory.map(g => 
          g.timestamp === guess.timestamp ? updatedGuess : g
        ),
      };

      setUser(finalUser);
      saveUserData(finalUser);
    }, 60000); // 1 minute
  };

  const handleCompleteTask = (taskId: string, reward: number) => {
    if (user.completedTasks.includes(taskId)) return;

    const newUser = {
      ...user,
      balance: user.balance + reward,
      completedTasks: [...user.completedTasks, taskId],
    };

    setUser(newUser);
    saveUserData(newUser);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold dark:text-white">Price Guesser</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                {theme === 'dark' ? <IoSunny className="w-5 h-5" /> : <IoMoon className="w-5 h-5" />}
              </button>
              <div className="text-right">
                <p className="font-semibold dark:text-white">{user.username}</p>
                <p className="text-gray-600 dark:text-gray-300">Wallet: ${user.balance}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <CoinList onSelectCoin={setSelectedCoin} />
        
        {selectedCoin && (
          <CoinModal
            coin={selectedCoin}
            isOpen={!!selectedCoin}
            onClose={() => setSelectedCoin(null)}
            onGuess={handleGuess}
            guessHistory={user.guessHistory.filter(g => g.coinId === selectedCoin.id)}
          />
        )}

        <Tasks
          completedTasks={user.completedTasks}
          onCompleteTask={handleCompleteTask}
        />
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;