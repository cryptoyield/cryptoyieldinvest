import React from 'react';
import { FaChartLine, FaShieldAlt, FaClock, FaWallet, FaGift, FaRocket, FaStar, FaUsers } from 'react-icons/fa';
import { useWallet } from '../context/WalletContext';

function Hero() {
  const { isConnected, connectWallet, connecting } = useWallet();

  const handleConnectWallet = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const bonusFeatures = [
    {
      icon: <FaGift className="w-6 h-6" />,
      title: "10% Welcome Bonus",
      description: "Get an instant 10% bonus on your first deposit",
      color: "from-purple-500 to-purple-700",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      icon: <FaRocket className="w-6 h-6" />,
      title: "Instant Activation",
      description: "Your bonus is credited immediately after deposit",
      color: "from-primary-500 to-primary-700",
      textColor: "text-primary-600 dark:text-primary-400"
    },
    {
      icon: <FaStar className="w-6 h-6" />,
      title: "No Limits",
      description: "Bonus applies to any investment amount",
      color: "from-success-500 to-success-700",
      textColor: "text-success-600 dark:text-success-400"
    }
  ];

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative mb-6">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-primary-500/20 to-success-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-success-500/20 to-primary-500/20 rounded-full blur-xl"></div>
              <div className="relative">
                <span className="inline-block px-4 py-2 rounded-full bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 text-sm font-medium mb-4 animate-fade-in">
                  🎉 Limited Time Offer
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  <span className="block">Get a </span>
                  <span className="bg-gradient-to-r from-primary-600 to-success-500 bg-clip-text text-transparent">
                    10% Welcome Bonus
                  </span>
                  <span className="block">on Your First Deposit</span>
                </h1>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
              Start your investment journey today with our exclusive welcome bonus. Connect your wallet and choose from our range of investment plans.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              {!isConnected && (
                <button
                  onClick={handleConnectWallet}
                  disabled={connecting}
                  className="btn-primary text-base py-3 px-8 w-full sm:w-auto transform hover:scale-105 transition-transform duration-200"
                >
                  {connecting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <FaWallet className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </>
                  )}
                </button>
              )}
              <a 
                href="#plans" 
                className={`btn-outline text-base py-3 px-8 ${isConnected ? 'w-full sm:w-auto text-center' : ''} transform hover:scale-105 transition-transform duration-200`}
              >
                View Plans
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bonusFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className={`text-lg font-semibold mb-1 ${feature.textColor}`}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-72 h-72 md:w-80 md:h-80 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full opacity-20 dark:opacity-10 absolute top-0 right-0"></div>
              <div className="relative z-10 space-y-4">
                <div className="card glass p-6 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-success-500 to-success-700 flex items-center justify-center">
                        <FaGift className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold ml-3">Welcome Package</h3>
                    </div>
                    <span className="px-2 py-1 bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 text-sm rounded-full">
                      Active
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/20 dark:bg-black/20 rounded-lg p-4">
                      <div className="text-3xl font-bold mb-1">+10%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Bonus on first deposit
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/20 dark:bg-black/20 rounded-lg p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Min Deposit
                        </div>
                        <div className="font-semibold">100 USDT</div>
                      </div>
                      <div className="bg-white/20 dark:bg-black/20 rounded-lg p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Max Bonus
                        </div>
                        <div className="font-semibold">No Limit</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card glass p-6 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                      <FaUsers className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold ml-3">Referral Bonus</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/20 dark:bg-black/20 rounded-lg">
                      <span>Level 1</span>
                      <span className="font-semibold">5%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/20 dark:bg-black/20 rounded-lg">
                      <span>Level 2</span>
                      <span className="font-semibold">3%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/20 dark:bg-black/20 rounded-lg">
                      <span>Level 3</span>
                      <span className="font-semibold">1%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;