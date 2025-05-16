// utils/mockData.ts
// Función para generar una dirección aleatoria
const generateRandomAddress = (): string => {
  const characters = '0123456789abcdefABCDEF';
  let result = '0x';
  
  // Generar una dirección de 40 caracteres (como las direcciones Ethereum)
  for (let i = 0; i < 40; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

// Formatea direcciones para mostrar solo los primeros 4 y últimos 4 caracteres después del prefijo
const formatAddress = (address: string): string => {
  // Mantener el 0x y los primeros 4 caracteres, luego los últimos 4
  const prefix = '0x';
  const start = address.substring(2, 6); // 4 caracteres después del 0x
  const end = address.substring(address.length - 4);
  
  return `${prefix}${start}...${end}`;
};

// Genera montos de retiro realistas entre 10.05 y 4999 USDT
const generateAmount = (): string => {
  // Generar montos entre 10.05 y 9999 USDT
  const baseAmount = (Math.random() * 4868.95 + 10.05).toFixed(2);
  
  // A veces usar números redondos (más comunes en retiros reales)
  if (Math.random() > 0.7) {
    return Math.floor(parseFloat(baseAmount) / 10) * 10 + '';
  }
  
  return baseAmount;
};

// Genera retiros únicos
const generateWithdrawals = (count: number = 3): any[] => {
  const withdrawals = [];
  
  // Generar entre 1 y el número solicitado de retiros
  const actualCount = count === 1 ? 1 : Math.floor(Math.random() * count) + 1;
  
  for (let i = 0; i < actualCount; i++) {
    withdrawals.push({
      id: Math.random().toString(36).substring(2, 11),
      amount: generateAmount(),
      wallet: generateRandomAddress(),
      timestamp: new Date()
    });
  }
  
  return withdrawals;
};

export const MOCK_ADDRESSES = {
  generateRandomAddress,
  formatAddress,
  generateWithdrawals
};
