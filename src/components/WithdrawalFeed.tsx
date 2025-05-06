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
  
  // Usar useRef para mantener un registro de las direcciones usadas sin causar re-renderizaciones
  const usedAddressesRef = React.useRef<Set<string>>(new Set());
  
  useEffect(() => {
    // Function to generate unique withdrawals (no address repeats)
    const generateUniqueWithdrawal = () => {
      // Generar SOLO UNA notificación a la vez
      let newWithdrawal;
      do {
        newWithdrawal = MOCK_ADDRESSES.generateWithdrawals(1)[0];
      } while (usedAddressesRef.current.has(newWithdrawal.wallet));
      
      // Actualizar el ref de direcciones usadas (sin causar re-render)
      usedAddressesRef.current.add(newWithdrawal.wallet);
      
      return newWithdrawal;
    };

    // Añadir solo UNA notificación inicial
    const initialWithdrawal = generateUniqueWithdrawal();
    setWithdrawals([initialWithdrawal]);

    // Función para añadir nuevas notificaciones a intervalos muy espaciados
    const addNewWithdrawal = () => {
      // Intervalos mucho más largos: entre 30-60 segundos
      const interval = Math.random() * 30000 + 30000;
      
      return setTimeout(() => {
        const newWithdrawal = generateUniqueWithdrawal();
        
        setWithdrawals(prev => {
          // Mantener solo las últimas 5 notificaciones para evitar acumulación
          return [newWithdrawal, ...prev].slice(0, 5);
        });
        
        // Resetear usedAddresses si se hace demasiado grande
        if (usedAddressesRef.current.size > 500) {
          usedAddressesRef.current = new Set();
        }
        
        timeoutId = addNewWithdrawal(); // Programar la siguiente notificación
      }, interval);
    };
    
    // Esperar 5 segundos antes de empezar a mostrar nuevas notificaciones
    // para evitar que aparezcan demasiadas al inicio
    const initialDelay = setTimeout(() => {
      timeoutId = addNewWithdrawal();
    }, 5000);
    
    let timeoutId: ReturnType<typeof setTimeout>;
    
    return () => {
      clearTimeout(initialDelay);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <WithdrawalFeedContext.Provider value={{ withdrawals }}>
      {children}
    </WithdrawalFeedContext.Provider>
  );
}

function WithdrawalNotification({ withdrawal, index }: { withdrawal: Withdrawal, index: number }) {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);
  
  useEffect(() => {
    // Tiempo total que la notificación permanecerá visible: 40-60 segundos
    const visibilityDuration = 40000 + (index * 5000);
    
    // Comenzar a desvanecer la notificación después de 30 segundos
    const fadeTimer = setTimeout(() => {
      setOpacity(0.7);
      
      // Después de 5 segundos más, bajar más la opacidad
      setTimeout(() => {
        setOpacity(0.4);
      }, 5000);
      
    }, 30000);
    
    // Eliminar la notificación después del tiempo total
    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, visibilityDuration);
    
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [index]);
  
  if (!visible) return null;
  
  return (
    <div
      style={{ opacity }}
      className={`
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
        rounded-lg shadow-lg p-4 mb-2 flex items-center
        transform transition-all duration-1000 ease-in-out
        ${visible ? 'translate-y-0' : 'translate-y-8 opacity-0'}
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
