import React, { useState, useEffect } from 'react';
import { Info, ArrowRight, AlertTriangle, ChevronDown, ChevronUp, TrendingUp, Award, Shield, Zap, Star } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import InvestModal from './InvestModal';

// Historical performance data (January through May)
const historicalReturns = {
  starter: [
    { month: 'Jan', return: 9.5 },
    { month: 'Feb', return: 11.2 },
    { month: 'Mar', return: 9.7 },
    { month: 'Apr', return: 10.8 },
    { month: 'May', return: 9.8 }
  ],
  conservative: [
    { month: 'Jan', return: 19.5 },
    { month: 'Feb', return: 20.2 },
    { month: 'Mar', return: 19.8 },
    { month: 'Apr', return: 20.4 },
    { month: 'May', return: 20.1 }
  ],
  balanced: [
    { month: 'Jan', return: 46.5 },
    { month: 'Feb', return: 47.2 },
    { month: 'Mar', return: 46.8 },
    { month: 'Apr', return: 47.4 },
    { month: 'May', return: 47.1 }
  ],
  growth: [
    { month: 'Jan', return: 59.5 },
    { month: 'Feb', return: 60.2 },
    { month: 'Mar', return: 59.8 },
    { month: 'Apr', return: 60.4 },
    { month: 'May', return: 60.1 }
  ]
};

// Market benchmark for comparison (average crypto staking returns)
const marketBenchmark = 7.5;

const plans = [
  {
    id: 0,
    name: 'Starter',
    icon: Star,
    rate: 10,
    duration: 14,
    minInvestment: 10,
    maxInvestment: 100,
    description: 'Perfect for beginners with a guaranteed 10% return after a short 14-day lock period.',
    color: 'from-amber-500 to-amber-600',
    textColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
    historicalData: historicalReturns.starter,
    riskLevel: 'Very Low',
    features: ['No experience needed', 'Quick 14-day returns', 'Maximum cap of 100 USDT']
  },
  {
    id: 1,
    name: 'Conservative',
    icon: Shield,
    rate: 20,
    duration: 30,
    minInvestment: 100,
    maxInvestment: 500,
    description: 'Entry-level investment plan with consistent 20% returns over the past months.',
    color: 'from-blue-500 to-primary-600',
    textColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    historicalData: historicalReturns.conservative,
    riskLevel: 'Low',
    features: ['No lock-in penalties', 'Weekly payouts', '24/7 Support']
  },
  {
    id: 2,
    name: 'Balanced',
    icon: Award,
    rate: 47,
    duration: 90,
    minInvestment: 500,
    maxInvestment: 5000,
    description: 'Balanced risk-reward plan maintaining steady 47% returns.',
    color: 'from-success-500 to-success-700',
    textColor: 'text-success-600 dark:text-success-400',
    bgColor: 'bg-success-50 dark:bg-success-900/20',
    borderColor: 'border-success-200 dark:border-success-800',
    recommended: true,
    historicalData: historicalReturns.balanced,
    riskLevel: 'Medium',
    features: ['Priority withdrawals', 'Daily compounding', 'Quarterly reports']
  },
  {
    id: 3,
    name: 'Growth',
    icon: Zap,
    rate: 60,
    duration: 365,
    minInvestment: 5000,
    maxInvestment: 100000,
    description: 'Aggressive growth plan consistently delivering 60% returns.',
    color: 'from-purple-500 to-purple-700',
    textColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    historicalData: historicalReturns.growth,
    riskLevel: 'High',
    features: ['Annual bonus', 'VIP portfolio management', 'Early access to new plans']
  }
];
