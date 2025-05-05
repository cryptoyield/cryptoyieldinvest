import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAdmin } from './AdminContext';

interface ReferralStats {
  totalEarnings: number;
  totalReferrals: number;
  level1Count: number;
  level2Count: number;
  level3Count: number;
  pendingRewards: number;
}

interface Investment {
  id: string;
  planId: number;
  amount: string;
  startDate: Date;
  endDate: Date;
  expectedReturn: string;
  progress: number;
}

interface WalletContextType {
  balance: string;
  isConnected: boolean;
  connecting: boolean;
  referralStats: ReferralStats;
  referralLink: string;
  account: string;
  userInvestments: Investment[];
  networkError: string | null;
  updateBalance: (newBalance: string) => void;
  calculateExpectedReturn: (amount: string, planId: number, welcomeBonus: string) => string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToArbitrum: () => Promise<void>;
  investInPlan: (amount: string, planId: number) => Promise<boolean>;
}

const defaultReferralStats: ReferralStats = {
  totalEarnings: 0,
  totalReferrals: 0,
  level1Count: 0,
  level2Count: 0,
  level3Count: 0,
  pendingRewards: 0
};

const ARBITRUM_CHAIN_ID = '0xa4b1';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState('0.00');
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [referralStats, setReferralStats] = useState<ReferralStats>(defaultReferralStats);
  const [referralLink, setReferralLink] = useState('');
  const [account, setAccount] = useState('');
  const [userInvestments, setUserInvestments] = useState<Investment[]>([]);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const { checkAdminAccess } = useAdmin();

  const updateBalance = (newBalance: string) => {
    setBalance(newBalance);
  };

  const generateReferralLink = (address: string) => {
    const addressPart = `${address.slice(0, 6)}${address.slice(-4)}`;
    return `https://cryptoyield.com/ref/${addressPart}`;
  };

  const switchToArbitrum = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARBITRUM_CHAIN_ID }],
      });
      setNetworkError(null);
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: ARBITRUM_CHAIN_ID,
              chainName: 'Arbitrum One',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://arb1.arbitrum.io/rpc'],
              blockExplorerUrls: ['https://arbiscan.io/']
            }]
          });
          setNetworkError(null);
        } catch (addError) {
          setNetworkError('Failed to add Arbitrum network');
        }
      } else {
        setNetworkError('Please switch to Arbitrum One network');
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setNetworkError('Please install MetaMask');
      return;
    }

    try {
      setConnecting(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== ARBITRUM_CHAIN_ID) {
        await switchToArbitrum();
        return;
      }

      const mockAddress = accounts[0];
      setIsConnected(true);
      setAccount(mockAddress);
      setReferralLink(generateReferralLink(mockAddress));
      setNetworkError(null);

      // Check if the connected wallet is the admin
      checkAdminAccess(mockAddress);

      window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
        if (newAccounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(newAccounts[0]);
          setReferralLink(generateReferralLink(newAccounts[0]));
          checkAdminAccess(newAccounts[0]);
        }
      });

      window.ethereum.on('chainChanged', (newChainId: string) => {
        if (newChainId !== ARBITRUM_CHAIN_ID) {
          setNetworkError('Please switch to Arbitrum One network');
        } else {
          setNetworkError(null);
        }
      });

    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setNetworkError('Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setBalance('0.00');
    setAccount('');
    setReferralLink('');
    setReferralStats(defaultReferralStats);
    setUserInvestments([]);
    setNetworkError(null);

    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', () => {});
      window.ethereum.removeListener('chainChanged', () => {});
    }
  };

  const calculateExpectedReturn = (amount: string, planId: number, welcomeBonus: string): string => {
    const rates = [0.20, 0.47, 0.60];
    const rate = rates[planId - 1] || 0.20;
    const principal = parseFloat(amount);
    const bonus = parseFloat(welcomeBonus);
    const returns = principal + (principal * rate) + bonus;
    return returns.toFixed(2);
  };

  const investInPlan = async (amount: string, planId: number): Promise<boolean> => {
    try {
      const amountNum = parseFloat(amount);
      const balanceNum = parseFloat(balance);

      if (amountNum > balanceNum) {
        throw new Error('Insufficient balance');
      }

      const durations = [30, 90, 365];
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + durations[planId - 1]);

      const welcomeBonus = userInvestments.length === 0 ? (amountNum * 0.1).toString() : '0';
      const expectedReturn = calculateExpectedReturn(amount, planId, welcomeBonus);

      const newInvestment: Investment = {
        id: `inv-${Date.now()}`,
        planId,
        amount,
        startDate,
        endDate,
        expectedReturn,
        progress: 0
      };

      setUserInvestments(prev => [...prev, newInvestment]);
      setBalance((balanceNum - amountNum).toFixed(2));

      return true;
    } catch (error) {
      console.error('Investment failed:', error);
      return false;
    }
  };

  return (
    <WalletContext.Provider value={{ 
      balance, 
      isConnected, 
      connecting, 
      referralStats,
      referralLink,
      account,
      userInvestments,
      networkError,
      updateBalance, 
      calculateExpectedReturn,
      connectWallet,
      disconnectWallet,
      switchToArbitrum,
      investInPlan
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}