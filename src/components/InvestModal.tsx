// components/InvestModal.tsx
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  FaTimes, FaInfoCircle, FaCheckCircle, FaUsers,
  FaCopy, FaExternalLinkAlt
} from 'react-icons/fa';
import { useWallet } from '../context/WalletContext';
import useEscapeKey from '../hooks/useEscapeKey';
import useCopyToClipboard from '../hooks/useCopyToClipboard';

const INVESTMENT_ADDRESS = "0x113db953308b9a75c84e0abd7128f6d755079221";

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

const InvestModal = ({ plan, onClose }: InvestModalProps) => {
  const { balance, investInPlan } = useWallet();
  const [amount, setAmount] = useState(plan.minInvestment.toString());
  const [error, setError] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [welcomeBonus, setWelcomeBonus] = useState('0');
  const [copied, copy] = useCopyToClipboard();

  useEscapeKey(onClose);

  useEffect(() => {
    const bonus = parseFloat(amount) * 0.1;
    setWelcomeBonus(isNaN(bonus) ? '0' : bonus.toFixed(2));
  }, [amount]);

  const expectedReturn = parseFloat(amount) * (1 + plan.rate / 100) || 0;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    const val = parseFloat(value);
    if (!value) setError('Amount is required');
    else if (val < plan.minInvestment) setError(`Minimum investment is ${plan.minInvestment} USDT`);
    else if (val > parseFloat(balance)) setError('Amount exceeds your balance');
    else setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error || !amount) return;

    setIsInvesting(true);
    try {
      const success = await investInPlan(amount, plan.id);
      if (success) {
        setIsSuccess(true);
        setTimeout(onClose, 3000);
      } else {
        setError('Investment failed. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsInvesting(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>

          {isSuccess ? (
            <SuccessMessage plan={plan} amount={amount} bonus={welcomeBonus} />
          ) : (
            <>
              <PlanDetails plan={plan} />
              <NetworkAlert />
              <QRCodeSection address={INVESTMENT_ADDRESS} onCopy={copy} copied={copied} />
              <InvestmentForm
                amount={amount}
                error={error}
                onChange={handleAmountChange}
                onSubmit={handleSubmit}
                isInvesting={isInvesting}
                minInvestment={plan.minInvestment}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestModal;
