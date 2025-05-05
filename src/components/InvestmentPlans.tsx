import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import InvestModal from './InvestModal';

// Historical performance data (January through May)
const historicalReturns = {
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

const plans = [
  {
    id: 1,
    name: 'Conservative',
    rate: 20,
    duration: 30,
    minInvestment: 100,
    description: 'Entry-level investment plan with consistent 20% returns over the past months.',
    color: 'from-blue-500 to-primary-600',
    textColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    historicalData: historicalReturns.conservative
  },
  {
    id: 2,
    name: 'Balanced',
    rate: 47,
    duration: 90,
    minInvestment: 500,
    description: 'Balanced risk-reward plan maintaining steady 47% returns.',
    color: 'from-success-500 to-success-700',
    textColor: 'text-success-600 dark:text-success-400',
    bgColor: 'bg-success-50 dark:bg-success-900/20',
    borderColor: 'border-success-200 dark:border-success-800',
    recommended: true,
    historicalData: historicalReturns.balanced
  },
  {
    id: 3,
    name: 'Growth',
    rate: 60,
    duration: 365,
    minInvestment: 5000,
    description: 'Aggressive growth plan consistently delivering 60% returns.',
    color: 'from-purple-500 to-purple-700',
    textColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    historicalData: historicalReturns.growth
  }
];

function InvestmentPlans() {
  const { isConnected, connectWallet, connecting } = useWallet();
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleInvestClick = (plan: typeof plans[0]) => {
    if (isConnected) {
      setSelectedPlan(plan);
      setShowModal(true);
    } else {
      connectWallet();
    }
  };

  const formatDuration = (days: number) => {
    if (days >= 365) {
      return '1 year';
    } else if (days >= 90) {
      return '3 months';
    } else {
      return `${days} days`;
    }
  };

  const renderHistoricalChart = (plan: typeof plans[0]) => {
    const maxReturn = Math.max(...plan.historicalData.map(d => d.return));
    const minReturn = Math.min(...plan.historicalData.map(d => d.return));
    const range = maxReturn - minReturn;
    const height = 120;

    return (
      <div className="relative h-[120px] mt-4">
        <div className="absolute inset-0 flex items-end justify-between">
          {plan.historicalData.map((data, index) => {
            const percentage = ((data.return - minReturn) / range) * 0.8 + 0.2;
            const barHeight = height * percentage;
            
            return (
              <div key={index} className="relative flex-1 mx-0.5">
                <div
                  className={`absolute bottom-0 inset-x-0 rounded-t-sm bg-gradient-to-t ${plan.color}`}
                  style={{ height: `${barHeight}px`, opacity: 0.8 }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                    {data.return}%
                  </div>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-6 text-xs text-gray-500">
                  {data.month}
                </div>
              </div>
            );
          })}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200 dark:bg-gray-700"></div>
      </div>
    );
  };

  return (
    <section id="plans" className="py-16 bg-gray-50 dark:bg-gray-800/50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Investment Plans</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose from our investment plans with proven track record of returns.
            <span className="block mt-2 text-sm text-gray-500">*Historical performance from January through May</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`card card-hover relative border ${plan.borderColor} ${plan.recommended ? 'mt-6' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-success-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                    Recommended
                  </div>
                </div>
              )}
              
              <div className={`h-2 w-full rounded-t-xl bg-gradient-to-r ${plan.color}`}></div>
              
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-2 ${plan.textColor}`}>{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl md:text-4xl font-bold">{plan.rate}%</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">Return Rate</span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Lock Period</span>
                    <span className="font-medium">{formatDuration(plan.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Min. Investment</span>
                    <span className="font-medium">{plan.minInvestment.toLocaleString()} USDT</span>
                  </div>
                  <div className="flex items-start">
                    <Info className="w-4 h-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                  </div>
                </div>
                
                <div className={`${plan.bgColor} p-4 rounded-lg mb-6`}>
                  <div className="text-sm mb-2">Historical Performance</div>
                  {renderHistoricalChart(plan)}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                    Last 5 months performance
                  </div>
                </div>
                
                <button
                  onClick={() => handleInvestClick(plan)}
                  className={`w-full btn bg-gradient-to-r ${plan.color} text-white hover:opacity-90 transition-opacity`}
                >
                  {isConnected ? (
                    <span className="flex items-center justify-center">
                      Invest Now <Info className="w-4 h-4 ml-2" />
                    </span>
                  ) : connecting ? (
                    'Connecting Wallet...'
                  ) : (
                    'Connect Wallet to Invest'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {showModal && selectedPlan && (
        <InvestModal 
          plan={selectedPlan} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </section>
  );
}

export default InvestmentPlans;