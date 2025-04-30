import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FaTimes, FaInfoCircle, FaCheckCircle, FaUsers, FaCopy, FaExternalLinkAlt } from 'react-icons/fa';
import { useWallet } from '../context/WalletContext';

interface Plan {
  id: number;
  name: string;
  rate: number;
  duration: number;
  minInvestment: number;
  description: string;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  recommended?: boolean;
}

interface InvestModalProps {
  plan: Plan;
  onClose: () => void;
}

const INVESTMENT_ADDRESS = "0x113db953308b9a75c84e0abd7128f6d755079221";

function InvestModal({ plan, onClose }: InvestModalProps) {
  const { balance, investInPlan } = useWallet();
  const [amount, setAmount] = useState(plan.minInvestment.toString());
  const [error, setError] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [welcomeBonus, setWelcomeBonus] = useState('0');
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    const bonus = parseFloat(amount) * 0.1;
    setWelcomeBonus(isNaN(bonus) ? '0' : bonus.toFixed(2));
  }, [amount]);

  const calculateExpectedReturn = (principal: number) => {
    return principal * (1 + (plan.rate / 100));
  };

  const expectedReturn = calculateExpectedReturn(parseFloat(amount) || 0);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    
    if (value === '') {
      setError('Amount is required');
    } else if (parseFloat(value) < plan.minInvestment) {
      setError(`Minimum investment is ${plan.minInvestment} USDT`);
    } else if (parseFloat(value) > parseFloat(balance)) {
      setError('Amount exceeds your balance');
    } else {
      setError('');
    }
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(INVESTMENT_ADDRESS);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (error || amount === '') {
      return;
    }

    setIsInvesting(true);
    try {
      const success = await investInPlan(amount, plan.id);
      if (success) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setError('Investment failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsInvesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-modal="true" role="dialog">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>
        
        <div className="w-full max-w-md transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all relative z-10">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="w-8 h-8 text-success-600 dark:text-success-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Investment Successful!</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Your investment of {amount} USDT in the {plan.name} plan has been processed successfully.
              </p>
              <div className="bg-success-50 dark:bg-success-900/20 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center text-success-600 dark:text-success-500">
                  <FaUsers className="w-4 h-4 mr-2" />
                  <span>Welcome Bonus: +{welcomeBonus} USDT (10%)</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Visit your dashboard to track your investments.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-1">Invest in {plan.name} Plan</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {plan.description}
                </p>
              </div>

              <div className="bg-warning-50 dark:bg-warning-900/20 p-4 rounded-lg mb-6">
                <h4 className="font-medium mb-2 flex items-center text-warning-700 dark:text-warning-400">
                  <FaInfoCircle className="w-4 h-4 mr-2" />
                  Network Information
                </h4>
                <div className="text-sm text-warning-600 dark:text-warning-400">
                  <p className="mb-2">Please ensure you're using the <strong>Arbitrum One</strong> network for this transaction.</p>
                  <a 
                    href="https://arbitrum.io/bridge" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-warning-700 dark:text-warning-400 hover:underline"
                  >
                    Bridge to Arbitrum One
                    <FaExternalLinkAlt className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
              
              <div className={`${plan.bgColor} ${plan.textColor} p-4 rounded-lg mb-6`}>
                <div className="flex justify-between items-center mb-2">
                  <span>Total Return:</span>
                  <span className="font-bold">{plan.rate}%</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Lock Period:</span>
                  <span className="font-bold">{plan.duration} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Minimum Investment:</span>
                  <span className="font-bold">{plan.minInvestment} USDT</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Investment Address (Arbitrum One)</h4>
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-2 rounded-lg">
                    <QRCodeSVG 
                      value={INVESTMENT_ADDRESS}
                      size={180}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono break-all">
                      {INVESTMENT_ADDRESS}
                    </code>
                    <button
                      onClick={copyAddress}
                      className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
                    >
                      {showCopied ? (
                        <span className="text-success-600">Copied!</span>
                      ) : (
                        <FaCopy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Investment Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={handleAmountChange}
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-700 shadow-sm py-2 pl-3 pr-12 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Enter amount"
                      min={plan.minInvestment}
                      step="0.01"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 pl-2">USDT</span>
                    </div>
                  </div>
                  {error && (
                    <div className="mt-1 flex items-center text-sm text-error-600 dark:text-error-500">
                      <FaInfoCircle className="w-4 h-4 mr-1" />
                      {error}
                    </div>
                  )}
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Available: {balance} USDT
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-300">Expected Return:</span>
                    <span className="font-bold text-success-600 dark:text-success-500">
                      {isNaN(expectedReturn) ? '0.00' : expectedReturn.toFixed(2)} USDT
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-300">Welcome Bonus (10%):</span>
                    <span className="font-bold text-warning-600 dark:text-warning-500">
                      +{welcomeBonus} USDT
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Total Profit:</span>
                    <span className="font-bold text-success-600 dark:text-success-500">
                      {isNaN(expectedReturn) ? '0.00' : (expectedReturn - parseFloat(amount || '0') + parseFloat(welcomeBonus)).toFixed(2)} USDT
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    *Returns paid at the end of the {plan.duration}-day period
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!!error || isInvesting || amount === ''}
                    className={`btn bg-gradient-to-r ${plan.color} text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isInvesting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Confirm Investment'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvestModal;