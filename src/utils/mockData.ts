// Mock data for development and testing purposes
export const MOCK_ADDRESSES = {
  // Generate a random Ethereum address
  generateAddress: () => {
    const chars = '0123456789abcdefABCDEF';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  },
  
  // Generate a list of unique addresses
  getUniqueAddresses: (count: number) => {
    const addresses = new Set<string>();
    while (addresses.size < count) {
      addresses.add(MOCK_ADDRESSES.generateAddress());
    }
    return Array.from(addresses);
  },
  
  // Cache of unique addresses
  wallets: [] as string[],
  
  // Helper function to format wallet address
  formatAddress: (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  },
  
  // Generate mock withdrawal data
  generateWithdrawal: () => {
    // Initialize wallets if empty
    if (MOCK_ADDRESSES.wallets.length === 0) {
      MOCK_ADDRESSES.wallets = MOCK_ADDRESSES.getUniqueAddresses(8);
    }
    
    const wallet = MOCK_ADDRESSES.wallets[Math.floor(Math.random() * MOCK_ADDRESSES.wallets.length)];
    return {
      id: `w-${Date.now()}`,
      amount: (Math.random() * 1000 + 100).toFixed(2),
      wallet,
      timestamp: new Date()
    };
  },
  
  // Generate multiple withdrawals
  generateWithdrawals: () => {
    const count = Math.floor(Math.random() * 2) + 2; // Generate 2-3 withdrawals
    const withdrawals = [];
    
    for (let i = 0; i < count; i++) {
      withdrawals.push(MOCK_ADDRESSES.generateWithdrawal());
    }
    
    return withdrawals;
  }
};