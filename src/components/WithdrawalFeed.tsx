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

// Función para formatear direcciones en formato Arbitrum (4 primeros dígitos + 4 últimos dígitos)
const formatArbitrumAddress = (address: string) => {
  if (!address || address.length < 8) return address;
  
  // Asegurarse de que la dirección empiece con "0x"
  const formattedAddress = address.startsWith('0x') ? address : `0x${address}`;
  
  // Tomar los primeros 4 y últimos 4 caracteres después del "0x"
  return `${formattedAddress.substring(0, 6)}...${formattedAddress.substring(formattedAddress.length - 4)}`;
};

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
      // Intervalos más largos: entre 10-20 segundos para que no aparezcan tan rápido
      const interval = Math.random() * 10000 + 10000;
      
      return setTimeout(() => {
        const newWithdrawals = generateUniqueWithdrawals();
        
        setWithdrawals(prev => {
          // Keep only the last 10 withdrawals to manage memory
          return [...newWithdrawals, ...prev].slice(0, 10);
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
  
  useEffect(() => {
    // Aumentar el tiempo de visualización a 20 segundos + tiempo extra basado en el índice
    const timer = setTimeout(() => {
      setVisible(false);
    }, 20000 + (index * 2000)); // Duración más larga: 20 segundos base + 2 segundos por índice
    
    return () => clearTimeout(timer);
  }, [index]);
  
  if (!visible) return null;
  
  return (
    <div
      className={`
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
        rounded-lg shadow-lg p-4 mb-2 flex items-center
        transform transition-all duration-500 ease-in-out
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
        border border-gray-100 dark:border-gray-700
      `}
    >
      <div className="w-8 h-8 rounded-full bg-green-100/80 dark:bg-green-900/30 flex items-center justify-center mr-3">
        <FaArrowUp className="w-4 h-4 text-green-600 dark:text-green-500 transform rotate-45" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {formatArbitrumAddress(withdrawal.wallet)}
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
      <div className="space-y-2 animate-fade-in">
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
