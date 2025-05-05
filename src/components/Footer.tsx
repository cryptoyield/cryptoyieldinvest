import React, { useState } from 'react';
import { FaWallet, FaChartLine, FaArrowRight, FaShieldAlt, FaQuestionCircle, FaBook, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  const [showGuide, setShowGuide] = useState(false);

  const steps = [
    {
      icon: <FaWallet />,
      title: "Connect Your Wallet",
      description: "Make sure you're using MetaMask and connected to the Arbitrum One network. If you need to bridge assets to Arbitrum One, use the official Arbitrum Bridge.",
      link: "https://bridge.arbitrum.io",
      linkText: "Bridge to Arbitrum One"
    },
    {
      icon: <FaChartLine />,
      title: "Choose Your Plan",
      description: "Select from our Conservative (5% APY), Balanced (17% APY), or Growth (25% APY) investment plans based on your risk tolerance and investment goals."
    },
    {
      icon: <FaShieldAlt />,
      title: "Make Your Investment",
      description: "Send USDT to our secure investment address on Arbitrum One: 0x113db953308b9a75c84e0abd7128f6d755079221. Ensure you're on the correct network to avoid losing funds."
    }
  ];

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <FaWallet className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-success-600 bg-clip-text text-transparent">
                CryptoYield
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Connect your wallet and grow your USDT with our secure investment plans on Arbitrum One.
            </p>
            <div className="flex items-start space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <FaMapMarkerAlt className="w-4 h-4 mt-1 flex-shrink-0" />
              <p>34C Bd Joseph II, 1840 Ville-Haute Luxembourg, Luxemburgo</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
              Platform
            </h4>
            <ul className="space-y-2">
              <li><a href="#" onClick={() => window.scrollTo(0, 0)} className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">Home</a></li>
              <li><a href="#plans" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">Investment Plans</a></li>
              <li>
                <button 
                  onClick={() => setShowGuide(!showGuide)} 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 transition-colors flex items-center"
                >
                  Getting Started
                  <FaBook className="ml-2 w-4 h-4" />
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('showFAQ'))} 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('showLegal'))} 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
              Network
            </h4>
            <div className="bg-warning-50 dark:bg-warning-900/20 rounded-lg p-4">
              <h5 className="font-medium text-warning-800 dark:text-warning-200 mb-2">Important Notice</h5>
              <p className="text-sm text-warning-700 dark:text-warning-300">
                All transactions must be made on the Arbitrum One network to avoid loss of funds.
              </p>
              <a 
                href="https://bridge.arbitrum.io" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center mt-2 text-sm text-warning-800 dark:text-warning-200 hover:underline"
              >
                Bridge to Arbitrum One
                <FaArrowRight className="ml-1 w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {showGuide && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <FaQuestionCircle className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-500" />
                Getting Started Guide
              </h3>
              
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-4">
                      <div className="w-6 h-6 text-primary-600 dark:text-primary-500">
                        {step.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {step.description}
                      </p>
                      {step.link && (
                        <a 
                          href={step.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary-600 dark:text-primary-500 hover:underline"
                        >
                          {step.linkText}
                          <FaArrowRight className="ml-1 w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mt-6">
                  <h4 className="text-lg font-semibold mb-4">Additional Resources</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2">New to Arbitrum?</h5>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <a 
                            href="https://arbitrum.io/get-started" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-500 hover:underline flex items-center"
                          >
                            Getting Started with Arbitrum
                            <FaArrowRight className="ml-1 w-3 h-3" />
                          </a>
                        </li>
                        <li>
                          <a 
                            href="https://bridge.arbitrum.io" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-500 hover:underline flex items-center"
                          >
                            Bridge Assets to Arbitrum
                            <FaArrowRight className="ml-1 w-3 h-3" />
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Need Help?</h5>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <button 
                            onClick={() => window.dispatchEvent(new CustomEvent('showFAQ'))}
                            className="text-primary-600 dark:text-primary-500 hover:underline flex items-center"
                          >
                            View FAQ
                            <FaArrowRight className="ml-1 w-3 h-3" />
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} CryptoYield. All rights reserved. 
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;