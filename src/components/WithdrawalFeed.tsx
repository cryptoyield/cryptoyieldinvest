import React, { useState, useEffect, useRef } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { MOCK_ADDRESSES } from '../utils/mockData';

interface Withdrawal {
  id: string;
  amount: string;
  wallet: string;
  timestamp: Date;
  visible?: boolean;
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Function to generate unique withdrawals (no address repeats)
    const generateUniqueWithdrawals = () => {
      const newWithdrawals: Withdrawal[] = [];
      const count = Math.floor(Math.random() * 2) + 1; // 1-2 withdrawals
      
      for (let i = 0; i < count; i++) {
        let newWithdrawal;
        do {
          newWithdrawal = MOCK_ADDRESSES.generateWithdrawals(1)[0];
        } while (usedAddresses.has(newWithdrawal.wallet));
        
        newWithdrawals.push({
          ...newWithdrawal,
          visible: true
        });
        
        setUsedAddresses(prev => new Set(prev).add(newWithdrawal.wallet));
      }
      
      return newWithdrawals;
    };

    // Add initial withdrawals
    setWithdrawals(generateUniqueWithdrawals());

    // Function to manage withdrawal lifecycle
    const manageWithdrawals = () => {
      // Between 10-20 seconds between new withdrawals
      const interval = Math.random() * 10000 + 10000;
      
      timeoutRef.current = setTimeout(() => {
        const newWithdrawals = generateUniqueWithdrawals();
        
        // Add new withdrawals to the list
        setWithdrawals(prev => {
          const updatedWithdrawals = [...newWithdrawals, ...prev];
          
          // Only keep the most recent 6 withdrawals to avoid clutter
          return updatedWithdrawals.slice(0, 6);
        });
        
        // Reset used addresses set if it gets too large
        if (usedAddresses.size > 500) {
          setUsedAddresses(new Set());
        }
        
        // Schedule next update
        timeoutRef.current = setTimeout(manageWithdrawals, interval);
      }, interval);
    };
    
    // Start the cycle
    manageWithdrawals();
    
    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <WithdrawalFeedContext.Provider value={{ withdrawals }}>
      {children}
    </WithdrawalFeedContext.Provider>
  );
}

function WithdrawalNotification({ withdrawal }: { withdrawal: Withdrawal }) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Make notification visible for 15 seconds, then remove
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 15000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div
      className={`
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
        rounded-lg shadow-lg p-4 mb-3 flex items-center
        animate-[fade-in_0.5s_ease-out_forwards,fade-out_1s_ease-in_14s_forwards]
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
      className="fixed left-4 bottom-10 z-50 max-w-sm overflow-hidden pointer-events-none"
    >
      <div className="space-y-1">
        {withdrawals.map((withdrawal) => (
          <WithdrawalNotification 
            key={withdrawal.id} 
            withdrawal={withdrawal}
          />
        ))}
      </div>
    </div>
  );
}

export default WithdrawalFeed;
