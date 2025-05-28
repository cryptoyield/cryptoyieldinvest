import React from 'react';
import { FaHandshake, FaCoins, FaUsers, FaChartLine, FaWallet } from 'react-icons/fa';
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

  const features = [
    {
      icon: <FaHandshake className="w-6 h-6" />,
      title: "Fair Credit Access",
      description: "Micro-loans without traditional bank history, assessed by digital reputation and community staking.",
      color: "from-primary-500 to-primary-700",
      textColor: "text-primary-600 dark:text-primary-400"
    },
    {
      icon: <FaCoins className="w-6 h-6" />,
      title: "Stablecoin Returns",
      description: "DeFi investors earn stable returns by funding tokenized loans.",
      color: "from-success-500 to-success-700",
      textColor: "text-success-600 dark:text-success-400"
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: "Empowered Community",
      description: "Fosters collaboration and social impact through decentralized financing.",
      color: "from-purple-500 to-purple-700",
      textColor: "text-purple-600 dark:text-purple-400"
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
                <span className="inline-block px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4 animate-fade-in">
                  🚀 Decentralized Financial Innovation
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  <span className="block">Access </span>
                  <span className="bg-gradient-to-r from-primary-600 to-success-500 bg-clip-text text-transparent">
                    Decentralized Collaborative Credits
                  </span>
                  <span className="block">for a Fair Future</span>
                </h1>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
              Connecting micro-entrepreneurs without formal credit access to DeFi investors seeking social impact and sustainable returns. Our platform eliminates intermediaries, promotes digital reputation, and empowers communities.
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
                href="#how-it-works" // Link to a section explaining how it works
                className={`btn-outline text-base py-3 px-8 ${isConnected ? 'w-full sm:w-auto text-center' : ''} transform hover:scale-105 transition-transform duration-200`}
              >
                Discover How It Works
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {features.map((feature, index) => (
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
                {/* Visual representation of the CCD model - could be simplified cards */}
                <div className="card glass p-6 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                        <FaHandshake className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold ml-3">Micro-entrepreneurs</h3>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full">
                      Seeking Credit
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/20 dark:bg-black/20 rounded-lg p-4">
                      <div className="text-xl font-bold mb-1">Quick Access</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Micro-loans for working capital or investment.
                      </div>
                    </div>
                    
                    <div className="bg-white/20 dark:bg-black/20 rounded-lg p-4">
                      <div className="text-xl font-bold mb-1">Fair Evaluation</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Based on digital reputation and community support.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card glass p-6 transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                      <FaChartLine className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold ml-3">DeFi Investors</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/20 dark:bg-black/20 rounded-lg">
                      <span>Competitive Returns</span>
                      <span className="font-semibold">In Stablecoins</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/20 dark:bg-black/20 rounded-lg">
                      <span>Social Impact</span>
                      <span className="font-semibold">Invest with Purpose</span>
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
