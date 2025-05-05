import React, { useState } from 'react';
import { FaChevronDown, FaWallet, FaLock, FaMoneyBillWave, FaShieldAlt, FaUsers } from 'react-icons/fa';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface FAQSection {
  title: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

function FAQ() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const toggleItem = (question: string) => {
    setOpenItems(prev => ({ ...prev, [question]: !prev[question] }));
  };

  const sections: FAQSection[] = [
    {
      title: 'Getting Started',
      icon: <FaWallet className="w-6 h-6" />,
      items: [
        {
          question: 'How do I start investing?',
          answer: (
            <div className="space-y-2">
              <p>Starting your investment journey with CryptoYield is simple:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Connect your MetaMask wallet</li>
                <li>Choose an investment plan that suits your goals</li>
                <li>Enter the amount you wish to invest</li>
                <li>Confirm the transaction</li>
              </ol>
            </div>
          )
        },
        {
          question: 'What is the minimum investment amount?',
          answer: (
            <p>The minimum investment varies by plan: Conservative (100 USDT), Balanced (500 USDT), and Growth (5000 USDT).</p>
          )
        },
        {
          question: 'Which cryptocurrencies do you accept?',
          answer: (
            <p>Currently, we only accept USDT (Tether) on the Ethereum network for investments.</p>
          )
        }
      ]
    },
    {
      title: 'Investment Plans',
      icon: <FaMoneyBillWave className="w-6 h-6" />,
      items: [
        {
          question: 'What returns can I expect?',
          answer: (
            <div className="space-y-2">
              <p>Our plans offer different fixed returns:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Conservative: 5% return after 30 days</li>
                <li>Balanced: 15% return after 90 days</li>
                <li>Growth: 25% return after 365 days</li>
              </ul>
            </div>
          )
        },
        {
          question: 'Can I withdraw before the lock period ends?',
          answer: (
            <p>No, funds are locked for the duration of the chosen plan to ensure optimal returns for all investors.</p>
          )
        },
        {
          question: 'How is the welcome bonus calculated?',
          answer: (
            <p>New investors receive a 10% welcome bonus on their first investment, automatically added to their returns.</p>
          )
        }
      ]
    },
    {
      title: 'Security',
      icon: <FaShieldAlt className="w-6 h-6" />,
      items: [
        {
          question: 'How secure are my investments?',
          answer: (
            <p>Your investments are secured through smart contracts on the Ethereum blockchain, which are immutable and transparent.</p>
          )
        },
        {
          question: 'Has the platform been audited?',
          answer: (
            <p>Yes, our smart contracts have undergone thorough security audits by leading blockchain security firms.</p>
          )
        },
        {
          question: 'What happens if I lose access to my wallet?',
          answer: (
            <p>Since investments are tied to your wallet address, it's crucial to maintain secure access to your wallet. We cannot recover funds if you lose access to your wallet.</p>
          )
        }
      ]
    },
    {
      title: 'Referral Program',
      icon: <FaUsers className="w-6 h-6" />,
      items: [
        {
          question: 'How does the referral program work?',
          answer: (
            <div className="space-y-2">
              <p>Our referral program has three levels:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Level 1: 5% of referral's earnings</li>
                <li>Level 2: 3% of referral's earnings</li>
                <li>Level 3: 1% of referral's earnings</li>
              </ul>
              <p>Earnings are automatically credited to your account.</p>
            </div>
          )
        },
        {
          question: 'When can I withdraw referral earnings?',
          answer: (
            <p>Referral earnings can be withdrawn once they reach a minimum of 100 USDT.</p>
          )
        },
        {
          question: 'Is there a limit to how many people I can refer?',
          answer: (
            <p>No, there is no limit to the number of referrals you can have.</p>
          )
        }
      ]
    },
    {
      title: 'Technical Support',
      icon: <FaLock className="w-6 h-6" />,
      items: [
        {
          question: 'What if my transaction fails?',
          answer: (
            <p>If a transaction fails, no funds are deducted. You can try again or contact support if the issue persists.</p>
          )
        },
        {
          question: 'How do I contact support?',
          answer: (
            <p>You can reach our support team through our help desk or via email at support@cryptoyield.com.</p>
          )
        },
        {
          question: 'Are there any transaction fees?',
          answer: (
            <p>The only fees are the standard Ethereum network gas fees for transactions.</p>
          )
        }
      ]
    }
  ];

  return (
    <div className="py-24">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about CryptoYield's investment platform.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {sections.map((section) => (
            <div key={section.title} className="mb-6">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full ${openSections[section.title] ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} flex items-center justify-center mr-3`}>
                    {section.icon}
                  </div>
                  <span className="text-xl font-semibold">{section.title}</span>
                </div>
                <FaChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openSections[section.title] ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {openSections[section.title] && (
                <div className="mt-4 space-y-4">
                  {section.items.map((item) => (
                    <div key={item.question} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                      <button
                        onClick={() => toggleItem(item.question)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="font-medium">{item.question}</span>
                        <FaChevronDown
                          className={`w-4 h-4 text-gray-500 transition-transform ${
                            openItems[item.question] ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      {openItems[item.question] && (
                        <div className="p-4 pt-0 text-gray-600 dark:text-gray-300">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQ;