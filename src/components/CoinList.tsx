import React from 'react';
import { useQuery } from 'react-query';
import { Coin } from '../types';

const COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 37000 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 2000 },
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: 60 },
  { id: 'pepe', name: 'Pepe', symbol: 'PEPE', price: 0.000001 },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', price: 0.08 },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.38 },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', price: 5.2 },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', price: 15 },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX', price: 22 },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC', price: 0.8 },
  { id: 'shiba-inu', name: 'Shiba Inu', symbol: 'SHIB', price: 0.000008 },
  { id: 'uniswap', name: 'Uniswap', symbol: 'UNI', price: 5.5 },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC', price: 70 },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB', price: 230 },
  { id: 'ripple', name: 'XRP', symbol: 'XRP', price: 0.63 },
];

const CoinList: React.FC<{ onSelectCoin: (coin: Coin) => void }> = ({ onSelectCoin }) => {
  const { data: coins } = useQuery('coins', () => {
    return COINS.map(coin => ({
      ...coin,
      current_price: coin.price * (1 + (Math.random() - 0.5) * 0.01), // Random ±0.5% variation
      image: `https://assets.coingecko.com/coins/images/1/small/${coin.id}.png`,
    }));
  }, {
    refetchInterval: 1000, // Update prices every second
  });

  if (!coins) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {coins.map((coin) => (
        <button
          key={coin.id}
          onClick={() => onSelectCoin(coin)}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-center mb-2">
            <img 
              src={`https://assets.coingecko.com/coins/images/1/small/${coin.id}.png`}
              alt={coin.name}
              className="w-12 h-12"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png';
              }}
            />
          </div>
          <h3 className="text-lg font-semibold text-center dark:text-white">{coin.name}</h3>
          <p className="text-center text-gray-600 dark:text-gray-300">
            ${coin.current_price.toFixed(coin.current_price < 1 ? 6 : 2)}
          </p>
        </button>
      ))}
    </div>
  );
};

export default CoinList;