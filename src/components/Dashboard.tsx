import React, { useState, useEffect } from 'react';
import { FaWallet, FaChartLine, FaCalendarAlt, FaClock, FaArrowLeft, FaArrowUp, FaUsers, FaLink, FaCopy } from 'react-icons/fa';
import { useWallet } from '../context/WalletContext';
import { MOCK_ADDRESSES } from '../utils/mockData';

interface Transaction {
  id: string;
  type: 'investment' | 'return' | 'withdrawal';
  amount: string;
  date: Date;
  status: 'completed' | 'pending';
  planName?: string;
  walletAddress?: string;
}

function Dashboard({ onViewPlans }: { onViewPlans: () => void }) {
  const { 
    account = '', 
    balance = '0.00', 
    userInvestments = [], 
    referralLink = '', 
    referralStats 
  } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showCopied, setShowCopied] = useState(false);

  const formatWalletAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Actualización del enlace de referido para usar el dominio correcto
  const getCorrectReferralLink = () => {
    if (!referralLink) return '';
    
    // Extraer el código de referido (la parte después de /ref/)
    const refCode = referralLink.split('/ref/')[1];
    
    // Crear el nuevo enlace con el dominio correcto
    return `https://cryptoyieldinvest.vercel.app/ref/${refCode}`;
  };

  const copyReferralLink = async () => {
    const correctLink = getCorrectReferralLink();
    if (correctLink) {
      await navigator.clipboard.writeText(correctLink);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const totalInvested = userInvestments.reduce(
    (sum, investment) => sum + parseFloat(investment.amount),
    0
  ).toFixed(2);
  
  const totalReturns = userInvestments.reduce(
    (sum, investment) => sum + parseFloat(investment.expectedReturn),
    0
  ).toFixed(2);
  
  const totalProfit = (parseFloat(totalReturns) - parseFloat(totalInvested)).toFixed(2);
  
  const getPlanName = (planId: number) => {
    const planNames = ['Conservative', 'Balanced', 'Growth'];
    return planNames[planId - 1] || 'Unknown';
  };
  
  const getDaysRemaining = (endDate: Date) => {
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 0 ? 0 : diffDays;
  };
  
  const getPlanColor = (planId: number) => {
    return 'bg-success-500'; // Changed to always return green color
  };
  
  const getProgressPercentage = (startDate: Date, endDate: Date) => {
    const today = new Date();
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysElapsed = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    
    const percentage = (daysElapsed / totalDays) * 100;
    return Math.min(Math.max(0, percentage), 100);
  };

  return (
    <section className="pt-24 pb-16">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
          <FaWallet className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-500" />
          Your Investment Dashboard
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">USDT Balance</h3>
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <FaWallet className="w-4 h-4 text-primary-600 dark:text-primary-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{balance} USDT</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Available for investment</p>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Invested</h3>
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <FaChartLine className="w-4 h-4 text-primary-600 dark:text-primary-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{totalInvested} USDT</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Across {userInvestments.length} active plans</p>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Expected Profit</h3>
              <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                <FaChartLine className="w-4 h-4 text-success-600 dark:text-success-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-success-600 dark:text-success-500 mb-2">+{totalProfit} USDT</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Projected returns at maturity</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Referral Earnings</h3>
              <div className="w-8 h-8 rounded-full bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center">
                <FaUsers className="w-4 h-4 text-warning-600 dark:text-warning-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{referralStats.totalEarnings} USDT</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">From {referralStats.totalReferrals} referrals</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <FaUsers className="w-6 h-6 mr-2 text-warning-600 dark:text-warning-500" />
              Referral Program
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-medium mb-4">Your Referral Link</h4>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="truncate flex-1 mr-4 font-mono text-sm">
                      {getCorrectReferralLink() || 'Connect wallet to get your referral link'}
                    </div>
                    <button
                      onClick={copyReferralLink}
                      disabled={!referralLink}
                      className="btn-outline p-2"
                    >
                      {showCopied ? (
                        <span className="text-success-600">Copied!</span>
                      ) : (
                        <FaCopy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-full bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center mr-3">
                      <span className="font-semibold text-warning-600">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Level 1 Referrals</p>
                      <p className="text-gray-500">5% of referral earnings</p>
                    </div>
                    <div className="ml-auto font-medium">{referralStats.level1Count}</div>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-full bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center mr-3">
                      <span className="font-semibold text-warning-600">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Level 2 Referrals</p>
                      <p className="text-gray-500">3% of referral earnings</p>
                    </div>
                    <div className="ml-auto font-medium">{referralStats.level2Count}</div>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-full bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center mr-3">
                      <span className="font-semibold text-warning-600">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Level 3 Referrals</p>
                      <p className="text-gray-500">1% of referral earnings</p>
                    </div>
                    <div className="ml-auto font-medium">{referralStats.level3Count}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Earnings Overview</h4>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Total Earnings</span>
                      <span className="font-bold text-warning-600">{referralStats.totalEarnings} USDT</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Pending Rewards</span>
                      <span className="font-bold text-warning-600">{referralStats.pendingRewards} USDT</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h5 className="font-medium mb-3">Withdrawal Requirements</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-warning-500 mr-2"></div>
                        Minimum withdrawal: 100 USDT
                      </li>
                      <li className="flex items-center text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 rounded-full bg-warning-500 mr-2"></div>
                        No maximum referral limit
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Active Investments</h3>
            <button 
              onClick={onViewPlans}
              className="btn-outline text-sm"
            >
              View All Plans
            </button>
          </div>
          
          {userInvestments.length > 0 ? (
            <div className="space-y-4">
              {userInvestments.map((investment) => (
                <div key={investment.id} className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full ${getPlanColor(investment.planId)} flex items-center justify-center`}>
                        <FaChartLine className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-lg font-semibold">{getPlanName(investment.planId)} Plan</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Invested: {formatDate(investment.startDate)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{investment.amount} USDT</div>
                      <div className="text-sm text-success-600 dark:text-success-500">
                        +{(parseFloat(investment.expectedReturn) - parseFloat(investment.amount)).toFixed(2)} USDT
                      </div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total: {investment.expectedReturn} USDT
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="font-medium">
                        {getDaysRemaining(investment.endDate)} days remaining
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getPlanColor(investment.planId)}`}
                        style={{ width: `${getProgressPercentage(investment.startDate, investment.endDate)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <FaCalendarAlt className="w-4 h-4 mr-1" />
                      <span>Start: {formatDate(investment.startDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="w-4 h-4 mr-1" />
                      <span>End: {formatDate(investment.endDate)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-xl font-semibold mb-2">No Active Investments</h4>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                You don't have any active investments at the moment. Start investing to see your portfolio here.
              </p>
              <button onClick={onViewPlans} className="btn-primary">
                View Investment Plans
              </button>
            </div>
          )}
        </div>
        
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-4">Account Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Wallet Address:</span>
              <span className="font-medium break-all">{account}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Total Invested:</span>
              <span className="font-medium">{totalInvested} USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Expected Returns:</span>
              <span className="font-medium">{totalReturns} USDT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Projected Profit:</span>
              <span className="font-medium text-success-600 dark:text-success-500">+{totalProfit} USDT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
