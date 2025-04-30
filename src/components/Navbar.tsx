import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaWallet, FaChartLine, FaSun, FaMoon } from 'react-icons/fa';
import { useWallet } from '../context/WalletContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onDashboardClick: () => void;
  onPlansClick: () => void;
  showDashboard: boolean;
}

function Navbar({ onDashboardClick, onPlansClick, showDashboard }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isConnected, account, balance, connecting, connectWallet, disconnectWallet } = useWallet();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onDashboardClick();
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a 
              href="#" 
              onClick={handleHomeClick}
              className="flex items-center space-x-2 group"
            >
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl transform group-hover:rotate-6 transition-transform duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl transform -rotate-12 group-hover:rotate-0 transition-transform duration-300">
                  C
                  <div className="absolute w-1.5 h-1.5 bg-white rounded-full -right-0.5 top-1/2 transform -translate-y-1/2"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-success-500/20 to-primary-500/20 rounded-xl blur-xl transform group-hover:scale-110 transition-transform duration-300"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-success-600 bg-clip-text text-transparent">
                CryptoYield
              </span>
            </a>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <a 
                href="#"
                onClick={handleHomeClick}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  !showDashboard ? 'text-primary-900 dark:text-primary-100 bg-primary-100/50 dark:bg-primary-800/50' : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                Home
              </a>
              <button 
                onClick={onPlansClick}
                className="px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Plans
              </button>
              <button 
                onClick={onDashboardClick}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-1 ${
                  showDashboard ? 'text-primary-900 dark:text-primary-100 bg-primary-100/50 dark:bg-primary-800/50' : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                <FaChartLine className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'dark' ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="bg-success-50 dark:bg-success-900/30 px-4 py-2 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <FaWallet className="w-4 h-4 text-success-600 dark:text-success-400" />
                      <span className="font-medium text-success-700 dark:text-success-300">{balance} USDT</span>
                    </div>
                  </div>
                  <div className="relative group">
                    <button className="btn-outline">
                      {formatAddress(account || '')}
                    </button>
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <button
                        onClick={disconnectWallet}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="btn-primary"
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
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a 
            href="#"
            onClick={handleHomeClick}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              !showDashboard ? 'text-primary-900 dark:text-primary-100 bg-primary-100/50 dark:bg-primary-800/50' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Home
          </a>
          <button 
            onClick={() => {
              onPlansClick();
              setIsMenuOpen(false);
            }}
            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300"
          >
            Plans
          </button>
          <button 
            onClick={() => {
              onDashboardClick();
              setIsMenuOpen(false);
            }}
            className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${
              showDashboard ? 'text-primary-900 dark:text-primary-100 bg-primary-100/50 dark:bg-primary-800/50' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button 
            onClick={toggleTheme} 
            className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300"
          >
            {theme === 'dark' ? (
              <>
                <FaSun className="w-5 h-5 mr-2" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <FaMoon className="w-5 h-5 mr-2" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
        <div className="px-4 pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          {isConnected ? (
            <div className="space-y-3">
              <div className="bg-success-50 dark:bg-success-900/30 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaWallet className="w-4 h-4 text-success-600 dark:text-success-400" />
                    <span className="font-medium text-success-700 dark:text-success-300">{balance} USDT</span>
                  </div>
                  <span className="text-sm text-success-600 dark:text-success-400">Available</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {formatAddress(account || '')}
                </div>
              </div>
              <button
                onClick={disconnectWallet}
                className="w-full btn-outline mt-2"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={connecting}
              className="w-full btn-primary"
            >
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;