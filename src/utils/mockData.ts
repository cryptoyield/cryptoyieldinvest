// Mock data for development and testing purposes
export const MOCK_ADDRESSES = {
  // Obscured wallet addresses for demonstration
  wallets: [
    "0xf3B2c1A4E1C5F3D8B6E1c9A2B1D8E9F7A6B5C4D3",
    "0xE9D4C2B3A1F8E7D6C5B4A3F2E1D8C7B6A5F4E3D2",
    "0xD8C7B6A5F4E3D2C1B0A9F8E7D6C5B4A3F2E1D9C8",
    "0xC7B6A5F4E3D2C1B0A9F8E7D6C5B4A3F2E1D9C8B7",
    "0xB6A5F4E3D2C1B0A9F8E7D6C5B4A3F2E1D9C8B7A6",
    "0xA5F4E3D2C1B0A9F8E7D6C5B4A3F2E1D9C8B7A6B5",
    "0x94E3D2C1B0A9F8E7D6C5B4A3F2E1D9C8B7A6B5C4",
    "0x83D2C1B0A9F8E7D6C5B4A3F2E1D9C8B7A6B5C4D3"
  ],
  
  // Helper function to format wallet address
  formatAddress: (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  },
  
  // Generate mock withdrawal data
  generateWithdrawal: () => {
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