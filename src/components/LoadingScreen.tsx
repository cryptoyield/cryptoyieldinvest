import React from 'react';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-900 to-primary-950 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Logo container with glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-success-500/20 to-primary-500/20 rounded-xl blur-2xl transform animate-pulse"></div>
          
          {/* Rotating border */}
          <div className="absolute inset-0 rounded-xl border-4 border-primary-500/30 border-t-primary-500 animate-spin"></div>
          
          {/* Logo */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl transform rotate-12">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-4xl transform -rotate-12">
              C
              <div className="absolute w-2 h-2 bg-white rounded-full -right-0.5 top-1/2 transform -translate-y-1/2"></div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-success-600 bg-clip-text text-transparent mb-3">
          CryptoYield
        </h2>
        <p className="text-primary-200 text-lg mb-8">Loading your investment dashboard...</p>
        
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;