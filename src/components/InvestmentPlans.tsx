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

function InvestmentPlans() {
  const { isConnected, connectWallet, connecting } = useWallet();
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState<string>('1000');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

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
    } else if (days >= 30) {
      return `${days} days`;
    } else {
      return `${days} days`;
    }
  };

  const toggleDetails = (planId: number) => {
    if (expandedDetails === planId) {
      setExpandedDetails(null);
    } else {
      setExpandedDetails(planId);
    }
  };

  const calculateReturns = (amount: number, rate: number) => {
    return (amount * (rate / 100)).toFixed(2);
  };

  const showInfoTooltip = (key: string) => {
    setActiveTooltip(key);
    setTimeout(() => setActiveTooltip(null), 3000);
  };

  const renderHistoricalChart = (plan: typeof plans[0]) => {
    // Use a consistent scale for all charts for better comparison
    const maxValue = 70; // Slightly higher than our highest value
    const minValue = 0;
    const range = maxValue - minValue;
    const height = 120;

    return (
      <div className="relative h-[120px] mt-4">
        {/* Market benchmark line */}
        <div 
          className="absolute left-0 right-0 border-t border-dashed border-gray-400 flex items-center"
          style={{ 
            bottom: `${(marketBenchmark / maxValue) * height}px`,
            zIndex: 5
          }}
        >
          <span className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded text-gray-500">
            Market avg {marketBenchmark}%
          </span>
        </div>

        <div className="absolute inset-0 flex items-end justify-between">
          {plan.historicalData.map((data, index) => {
            const percentage = (data.return / maxValue);
            const barHeight = height * percentage;
            
            return (
              <div key={index} className="relative flex-1 mx-0.5 group">
                <div
                  className={`absolute bottom-0 inset-x-0 rounded-t-sm bg-gradient-to-t ${plan.color} transition-all duration-300 group-hover:opacity-100`}
                  style={{ height: `${barHeight}px`, opacity: 0.8 }}
                >
                </div>
                
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded p-2 z-10 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {data.month}: {data.return}%
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
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

  const renderCalculator = () => {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/80 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Investment Calculator
        </h3>
        
        <div className="mb-4">
          <label htmlFor="investment-amount" className="block text-sm font-medium mb-1">
            Investment Amount (USDT)
          </label>
          <input
            id="investment-amount"
            type="number"
            min="10"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            className="block w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {plans.map(plan => {
            const amount = parseFloat(investmentAmount) || 0;
            const isOverMax = plan.maxInvestment && amount > plan.maxInvestment;
            const effectiveAmount = isOverMax ? plan.maxInvestment : amount;
            const returns = calculateReturns(effectiveAmount, plan.rate);
            const isMinimumMet = amount >= plan.minInvestment;
            
            return (
              <div key={plan.id} className={`border rounded-lg p-4 ${plan.borderColor} ${!isMinimumMet ? 'opacity-60' : ''}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-medium ${plan.textColor}`}>{plan.name}</span>
                  <span className="text-sm text-gray-500">
                    {formatDuration(plan.duration)}
                  </span>
                </div>
                
                <div className="text-xl font-bold mb-1">
                  +{returns} USDT
                </div>
                
                {!isMinimumMet && (
                  <div className="text-xs flex items-center text-warning-500">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Min. {plan.minInvestment} USDT required
                  </div>
                )}
                
                {isOverMax && (
                  <div className="text-xs flex items-center text-info-500">
                    <Info className="w-3 h-3 mr-1" />
                    Max. {plan.maxInvestment} USDT applied
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderComparisonTable = () => {
    return (
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="p-4 text-left">Feature</th>
              {plans.map(plan => (
                <th key={plan.id} className={`p-4 text-center ${plan.textColor}`}>
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-4 font-medium">Return Rate</td>
              {plans.map(plan => (
                <td key={plan.id} className="p-4 text-center font-bold">
                  {plan.rate}%
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-4 font-medium">Lock Period</td>
              {plans.map(plan => (
                <td key={plan.id} className="p-4 text-center">
                  {formatDuration(plan.duration)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-4 font-medium">Min. Investment</td>
              {plans.map(plan => (
                <td key={plan.id} className="p-4 text-center">
                  {plan.minInvestment.toLocaleString()} USDT
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-4 font-medium">Max. Investment</td>
              {plans.map(plan => (
                <td key={plan.id} className="p-4 text-center">
                  {plan.maxInvestment ? `${plan.maxInvestment.toLocaleString()} USDT` : 'Unlimited'}
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-4 font-medium">Risk Level</td>
              {plans.map(plan => (
                <td key={plan.id} className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    plan.riskLevel === 'Very Low' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    plan.riskLevel === 'Low' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                    plan.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {plan.riskLevel}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium">Special Features</td>
              {plans.map(plan => (
                <td key={plan.id} className="p-4 text-center">
                  <ul className="text-sm text-left pl-4 space-y-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="list-disc">{feature}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <section id="plans" className="py-16 bg-gray-50 dark:bg-gray-800/50">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Investment Plans</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose from our investment plans with proven track record of returns.
            <span className="block mt-2 text-sm text-gray-500">*Historical performance from January through May</span>
          </p>
        </div>

        {/* Tools */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <button 
            onClick={() => setShowComparison(!showComparison)}
            className="btn-outline flex items-center justify-center"
          >
            {showComparison ? 'Hide Comparison' : 'Compare Plans'}
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showComparison ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Comparison Table (Conditional) */}
        {showComparison && renderComparisonTable()}

        {/* Calculator */}
        {renderCalculator()}
        
        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`card card-hover relative border ${plan.borderColor} ${plan.recommended ? 'mt-6' : ''} transition-all duration-300 hover:shadow-lg`}
            >
              {plan.recommended && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-success-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Recommended
                  </div>
                </div>
              )}
              
              <div className={`h-2 w-full rounded-t-xl bg-gradient-to-r ${plan.color}`}></div>
              
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <plan.icon className={`w-5 h-5 mr-2 ${plan.textColor}`} />
                  <h3 className={`text-xl font-bold ${plan.textColor}`}>{plan.name}</h3>
                </div>
                
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
                  {plan.maxInvestment && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Max. Investment</span>
                      <span className="font-medium">{plan.maxInvestment.toLocaleString()} USDT</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center">
                      Risk Level
                      <button 
                        onClick={() => showInfoTooltip(`risk-${plan.id}`)}
                        className="ml-1 text-gray-400 hover:text-gray-600"
                      >
                        <Info className="w-3 h-3" />
                      </button>
                      
                      {activeTooltip === `risk-${plan.id}` && (
                        <div className="absolute mt-1 bg-gray-800 text-white text-xs rounded p-2 z-10 max-w-xs">
                          Risk levels indicate volatility and potential for both gains and losses.
                        </div>
                      )}
                    </span>
                    <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${
                      plan.riskLevel === 'Very Low' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      plan.riskLevel === 'Low' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      plan.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {plan.riskLevel}
                    </span>
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
                  onClick={() => toggleDetails(plan.id)}
                  className="w-full btn-outline mb-3 flex items-center justify-center"
                >
                  {expandedDetails === plan.id ? 'Hide Details' : 'View Details'}
                  <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${expandedDetails === plan.id ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedDetails === plan.id && (
                  <div className="mb-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Plan Features</h4>
                    <ul className="space-y-2 pl-5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 list-disc">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <button
                  onClick={() => handleInvestClick(plan)}
                  className={`w-full btn bg-gradient-to-r ${plan.color} text-white hover:opacity-90 transition-all duration-300 transform hover:translate-y-px active:translate-y-0.5`}
                >
                  {isConnected ? (
                    <span className="flex items-center justify-center">
                      Invest Now <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                  ) : connecting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting Wallet...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Connect Wallet to Invest
                    </span>
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
