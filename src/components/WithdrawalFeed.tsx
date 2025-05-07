import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { MOCK_ADDRESSES } from '../utils/mockData';

interface Withdrawal {
  id: string;
  amount: string;
  wallet: string;
  timestamp: Date;
}

// Context to make the withdrawal feed globally available
export const WithdrawalFeedContext = React.createContext<{
  withdrawals: Withdrawal[];
}>({
  withdrawals: [],
});

export function WithdrawalFeedProvider({ children }: { children: React.ReactNode }) {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [usedAddresses, setUsedAddresses] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    // Function to generate unique withdrawals (no address repeats)
    const generateUniqueWithdrawals = () => {
      const newWithdrawals: Withdrawal[] = [];
      const count = Math.floor(Math.random() * 2) + 1; // Generate 1-2 withdrawals at a time
      
      for (let i = 0; i < count; i++) {
        let newWithdrawal;
        do {
          newWithdrawal = MOCK_ADDRESSES.generateWithdrawals(1)[0];
        } while (usedAddresses.has(newWithdrawal.wallet));
        
        newWithdrawals.push(newWithdrawal);
        setUsedAddresses(prev => new Set(prev).add(newWithdrawal.wallet));
      }
      
      return newWithdrawals;
    };

    // Add initial withdrawals (2-3)
    const initialWithdrawals = generateUniqueWithdrawals();
    setWithdrawals(initialWithdrawals);

    // Function to add new withdrawal at random intervals
    const addNewWithdrawal = () => {
      // Random interval between 7-15 seconds para un ritmo más natural
      const interval = Math.random() * 8000 + 7000;
      
      return setTimeout(() => {
        const newWithdrawals = generateUniqueWithdrawals();
        
        setWithdrawals(prev => {
          // Keep only the last 8 withdrawals to manage memory
          return [...newWithdrawals, ...prev].slice(0, 8);
        });
        
        // Reset usedAddresses if it gets too large to prevent running out of addresses
        if (usedAddresses.size > 1000) {
          setUsedAddresses(new Set());
        }
        
        timeoutId = addNewWithdrawal(); // Schedule next withdrawal
      }, interval);
    };
    
    let timeoutId = addNewWithdrawal();
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [usedAddresses]);

  return (
    <WithdrawalFeedContext.Provider value={{ withdrawals }}>
      {children}
    </WithdrawalFeedContext.Provider>
  );
}

function WithdrawalNotification({ withdrawal, index }: { withdrawal: Withdrawal, index: number }) {
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    // Duración más larga para cada notificación (entre 15 y 20 segundos)
    const displayDuration = 15000 + (index * 1500); // Duración base de 15 segundos + 1.5 segundos por cada posición
    
    // Agregar fase de salida animada
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, displayDuration);
    
    // Eliminar notificación del DOM después de la animación de salida
    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, displayDuration + 1000); // 1 segundo extra para la animación de salida
    
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [index]);
  
  if (!visible) return null;
  
  return (
    <div
      className={`
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
        rounded-lg shadow-lg p-4 mb-2 flex items-center
        transform transition-all duration-700 ease-in-out
        ${isExiting ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}
        border border-gray-100 dark:border-gray-700
      `}
    >
      <div className="w-8 h-8 rounded-full bg-green-100/80 dark:bg-green-900/30 flex items-center justify-center mr-3">
        <FaArrowUp className="w-4 h-4 text-green-600 dark:text-green-500 transform rotate-45" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {MOCK_ADDRESSES.formatAddress(withdrawal.wallet)}
        </p>
        <p className="text-xs text-green-600 dark:text-green-500 font-medium">
          +{withdrawal.amount} USDT
        </p>
      </div>
    </div>
  );
}

function WithdrawalFeed() {
  const { withdrawals } = React.useContext(WithdrawalFeedContext);
  
  return (
    <div 
      className="fixed left-4 bottom-10 z-50 max-w-sm max-h-96 overflow-hidden pointer-events-none"
    >
      <div className="space-y-2">
        {withdrawals.map((withdrawal, index) => (
          <WithdrawalNotification 
            key={withdrawal.id} 
            withdrawal={withdrawal}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

export default WithdrawalFeed;
