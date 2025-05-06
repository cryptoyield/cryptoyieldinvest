// utils/mockData.ts

// Lista amplia de direcciones para evitar repeticiones
const WALLET_PREFIXES = [
  '0x', 'bc1', '3', '1', 'bnb', 'ltc', 'xrp', 'doge', 'dot', 'ada', 'sol'
];

// Función para generar una dirección aleatoria
const generateRandomAddress = (prefix: string = '0x'): string => {
  const characters = '0123456789abcdefABCDEF';
  let result = prefix;
  
  // Longitud variable según el tipo de dirección
  const length = prefix === '0x' ? 40 : 
                 (prefix === 'bc1' || prefix.length <= 2) ? 32 : 24;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

// Formatea direcciones para mostrar
const formatAddress = (address: string): string => {
  // Detecta el tipo de prefijo
  const prefix = WALLET_PREFIXES.find(p => address.startsWith(p)) || '';
  
  if (!prefix) return address;
  
  const start = address.substring(0, prefix.length + 4);
  const end = address.substring(address.length - 4);
  
  return `${start}...${end}`;
};

// Genera montos de retiro realistas
const generateAmount = (): string => {
  // Genera montos más variados y realistas
  const baseAmount = (Math.random() * 995 + 5).toFixed(1); // Entre 5 y 1000 USDT
  
  // A veces usar números redondos (más comunes en retiros reales)
  if (Math.random() > 0.7) {
    return Math.floor(parseFloat(baseAmount) / 5) * 5 + '';
  }
  
  return baseAmount;
};

// Genera retiros únicos
const generateWithdrawals = (count: number = 3): any[] => {
  const withdrawals = [];
  
  // Generar entre 1 y el número solicitado de retiros
  const actualCount = count === 1 ? 1 : Math.floor(Math.random() * count) + 1;
  
  for (let i = 0; i < actualCount; i++) {
    // Seleccionar un prefijo aleatorio para crear diferentes tipos de billeteras
    const prefix = WALLET_PREFIXES[Math.floor(Math.random() * WALLET_PREFIXES.length)];
    
    withdrawals.push({
      id: Math.random().toString(36).substring(2, 11),
      amount: generateAmount(),
      wallet: generateRandomAddress(prefix),
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
