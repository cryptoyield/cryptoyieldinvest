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
  
  // Usar useRef para mantener un registro de las direcciones usadas sin causar re-renderizaciones
  const usedAddressesRef = React.useRef<Set<string>>(new Set());
  
  useEffect(() => {
    console.log("WithdrawalFeedProvider mounted");
    
    // Function to generate unique withdrawals (no address repeats)
    const generateUniqueWithdrawal = () => {
      // Generar SOLO UNA notificación a la vez
      let newWithdrawal;
      let attempts = 0;
      
      do {
        newWithdrawal = MOCK_ADDRESSES.generateWithdrawals(1)[0];
        attempts++;
        // Evitar bucles infinitos si no se pueden encontrar más direcciones únicas
        if (attempts > 100) {
          usedAddressesRef.current.clear();
          break;
        }
      } while (usedAddressesRef.current.has(newWithdrawal.wallet));
      
      // Actualizar el ref de direcciones usadas (sin causar re-render)
      usedAddressesRef.current.add(newWithdrawal.wallet);
      
      // Asignar un ID realmente único basado en timestamp para evitar problemas de key en React
      newWithdrawal.id = `withdrawal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      return newWithdrawal;
    };

    // ESPERAR 10 SEGUNDOS antes de mostrar la primera notificación
    const initialDelay = setTimeout(() => {
      console.log("Adding initial withdrawal");
      // Añadir solo UNA notificación inicial
      const initialWithdrawal = generateUniqueWithdrawal();
      setWithdrawals([initialWithdrawal]);
      
      // Esperar otros 20 segundos antes de añadir la siguiente notificación
      setTimeout(() => {
        timeoutId = addNewWithdrawal();
      }, 20000);
    }, 10000);

    // Función para añadir nuevas notificaciones a intervalos muy espaciados
    const addNewWithdrawal = () => {
      // Intervalos extremadamente largos: entre 45-90 segundos
      const interval = Math.random() * 45000 + 45000;
      console.log(`Scheduling next withdrawal in ${Math.round(interval/1000)} seconds`);
      
      return setTimeout(() => {
        console.log("Adding new withdrawal");
        const newWithdrawal = generateUniqueWithdrawal();
        
        setWithdrawals(prev => {
          // IMPORTANTE: Añadir al FINAL del array para mantener el orden existente y evitar re-ordenamientos
          const updatedWithdrawals = [...prev, newWithdrawal].slice(0, 5);
          console.log("Current withdrawals count:", updatedWithdrawals.length);
          return updatedWithdrawals;
        });
        
        // Resetear usedAddresses si se hace demasiado grande
        if (usedAddressesRef.current.size > 100) {
          usedAddressesRef.current.clear();
        }
        
        timeoutId = addNewWithdrawal(); // Programar la siguiente notificación
      }, interval);
    };
    
    let timeoutId: ReturnType<typeof setTimeout>;
    
    return () => {
      console.log("WithdrawalFeedProvider unmounting, cleaning up timers");
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
  
  // Usar useRef para mantener el control del estado de montaje
  const isMounted = React.useRef(true);
  
  useEffect(() => {
    console.log(`Notification ${withdrawal.id} mounted, index: ${index}`);
    
    // Tiempo extremadamente largo para que las notificaciones permanezcan visibles
    const visibilityDuration = 90000 + (index * 10000); // 90 segundos + 10 segundos por índice
    
    // Desvanecimiento muy gradual en tres etapas
    const fade1 = setTimeout(() => {
      if (isMounted.current) setOpacity(0.8);
    }, 60000); // Primera reducción después de 60 segundos
    
    const fade2 = setTimeout(() => {
      if (isMounted.current) setOpacity(0.6);
    }, 70000); // Segunda reducción después de 70 segundos
    
    const fade3 = setTimeout(() => {
      if (isMounted.current) setOpacity(0.4);
    }, 80000); // Tercera reducción después de 80 segundos
    
    // Finalmente eliminar después del tiempo total
    const removeTimer = setTimeout(() => {
      if (isMounted.current) {
        console.log(`Removing notification ${withdrawal.id}`);
        setVisible(false);
      }
    }, visibilityDuration);
    
    // Cleanup function
    return () => {
      console.log(`Notification ${withdrawal.id} unmounting`);
      isMounted.current = false;
      clearTimeout(fade1);
      clearTimeout(fade2);
      clearTimeout(fade3);
      clearTimeout(removeTimer);
    };
  }, []); // Usar array vacío para que se ejecute solo una vez al montar
  
  if (!visible) return null;
  
  if (!visible) return null;
  
  return (
    <div
      style={{ opacity }}
      className={`
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
        rounded-lg shadow-lg p-4 mb-2 flex items-center
        transform transition-opacity duration-3000 ease-in-out
        ${visible ? 'opacity-[var(--opacity)]' : 'opacity-0'}
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
      {/* Eliminada la clase animate-fade-in que podría estar causando animaciones no deseadas */}
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
