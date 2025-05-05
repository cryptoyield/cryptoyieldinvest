import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { MOCK_ADDRESSES } from '../utils/mockData';

interface Withdrawal {
  id: string;
  amount: string;
  wallet: string;
  timestamp: Date;
}

function WithdrawalFeed() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Add initial withdrawals (2-3)
    setWithdrawals(MOCK_ADDRESSES.generateWithdrawals());

    // Set up interval for new withdrawals
    const createInterval = () => {
      // Random interval between 8-15 seconds
      const interval = Math.random() * 7000 + 8000;
      
      return setTimeout(() => {
        if (mounted) {
          setWithdrawals(prev => {
            const newWithdrawals = MOCK_ADDRESSES.generateWithdrawals();
            return [...newWithdrawals, ...prev].slice(0, 4); // Keep only last 4 withdrawals
          });
        }
        intervalId = createInterval(); // Create next interval
      }, interval);
    };

    let intervalId = createInterval();

    return () => {
      setMounted(false);
      clearTimeout(intervalId);
    };
  }, []);

  return (
    <div 
      className="fixed left-4 z-40 max-w-sm" 
      style={{ 
        bottom: '40px',
        maxHeight: '50vh', // Limit to half of viewport height
        overflow: 'hidden'
      }}
    >
      {withdrawals.map((withdrawal, index) => (
        <div
          key={withdrawal.id}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-4 mb-2 flex items-center animate-fade-in"
          style={{
            animation: `fadeIn 0.3s ease-out forwards, fadeOut 0.3s ease-out ${5 - index}s forwards`,
            opacity: 0
          }}
        >
          <div className="w-8 h-8 rounded-full bg-success-100/80 dark:bg-success-900/30 flex items-center justify-center mr-3">
            <FaArrowUp className="w-4 h-4 text-success-600 dark:text-success-500 transform rotate-45" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {MOCK_ADDRESSES.formatAddress(withdrawal.wallet)}
            </p>
            <p className="text-xs text-success-600 dark:text-success-500 font-medium">
              +{withdrawal.amount} USDT
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WithdrawalFeed;