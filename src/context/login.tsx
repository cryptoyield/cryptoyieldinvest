import React, { useState } from 'react';
import { useAuth, AuthMethod } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';

interface LoginProps {
  onComplete?: () => void;
}

const Login: React.FC<LoginProps> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  
  const { 
    loginWithEmailPassword, 
    registerWithEmailPassword, 
    loginWithGoogle, 
    loginWithFacebook,
    loginWithTwitter,
    requestMagicLink,
    resetPassword,
    authError,
    isAuthenticating,
    authMethod
  } = useAuth();
  
  const { connectWallet, connecting, networkError } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;
    
    if (activeTab === 'login') {
      success = await loginWithEmailPassword(email, password);
    } else if (activeTab === 'register') {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      success = await registerWithEmailPassword(email, password, displayName);
    } else if (activeTab === 'reset') {
      success = await resetPassword(email);
      if (success) {
        alert('Password reset instructions have been sent to your email');
        setActiveTab('login');
      }
    }
    
    if (success && onComplete) {
      onComplete();
    }
  };

  const handleMagicLinkRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await requestMagicLink(email);
    if (success) {
      setMagicLinkSent(true);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'twitter') => {
    let success = false;
    
    if (provider === 'google') {
      success = await loginWithGoogle();
    } else if (provider === 'facebook') {
      success = await loginWithFacebook();
    } else if (provider === 'twitter') {
      success = await loginWithTwitter();
    }
    
    if (success && onComplete) {
      onComplete();
    }
  };

  const handleWalletConnect = async () => {
    await connectWallet();
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 max-w-md w-full mx-auto">
      <div className="flex justify-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {activeTab === 'login' ? 'Sign In' : activeTab === 'register' ? 'Create Account' : 'Reset Password'}
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('login')}
          className={`pb-4 px-4 ${activeTab === 'login' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
        >
          Sign In
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`pb-4 px-4 ${activeTab === 'register' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
        >
          Register
        </button>
        <button
          onClick={() => setActiveTab('reset')}
          className={`pb-4 px-4 ${activeTab === 'reset' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
        >
          Forgot Password
        </button>
      </div>

      {/* Error display */}
      {authError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {authError}
        </div>
      )}

      {/* Network error for wallet */}
      {networkError && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          {networkError}
        </div>
      )}

      {/* Magic link confirmation */}
      {magicLinkSent && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Check your email for a magic link to sign in!
        </div>
      )}

      {/* Email/Password Form */}
      {!magicLinkSent && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'register' && (
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required={activeTab === 'register'}
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          {activeTab !== 'reset' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required={activeTab !== 'reset'}
              />
            </div>
          )}
          
          {activeTab === 'register' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required={activeTab === 'register'}
              />
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isAuthenticating ? 'Processing...' : 
               activeTab === 'login' ? 'Sign In' : 
               activeTab === 'register' ? 'Create Account' : 
               'Reset Password'}
            </button>
          </div>
        </form>
      )}

      {/* Magic Link Option */}
      {activeTab === 'login' && !magicLinkSent && (
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or</span>
            </div>
          </div>
          
          <form onSubmit={handleMagicLinkRequest} className="mt-4">
            <div className="flex space-x-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={isAuthenticating}
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
              >
                Magic Link
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Social Login Options */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-6">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isAuthenticating}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.545, 10.239v3.821h5.445c-0.712, 2.315-2.647, 3.972-5.445, 3.972-3.332, 0-6.033-2.701-6.033-6.032s2.701-6.032, 6.033-6.032c1.498, 0, 2.866, 0.549, 3.921, 1.453l2.814-2.814C17.503, 2.988, 15.139, 2, 12.545, 2 7.021, 2, 2.543, 6.477, 2.543, 12s4.478, 10, 10.002, 10c8.396, 0, 10.249-7.85, 9.426-11.748l-9.426, 0.002z" />
            </svg>
          </button>
          <button
            onClick={() => handleSocialLogin('facebook')}
            disabled={isAuthenticating}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => handleSocialLogin('twitter')}
            disabled={isAuthenticating}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </button>
          <button
            onClick={handleWalletConnect}
            disabled={connecting}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="#627EEA"/>
              <path d="M20.5 8V16.0875L27.5 19.2625L20.5 8Z" fill="white" fillOpacity="0.602"/>
              <path d="M20.5 8L13.5 19.2625L20.5 16.0875V8Z" fill="white"/>
              <path d="M20.5 26.9999V32.4999L27.5 21.7124L20.5 26.9999Z" fill="white" fillOpacity="0.602"/>
              <path d="M20.5 32.4999V26.9999L13.5 21.7124L20.5 32.4999Z" fill="white"/>
              <path d="M20.5 25.3625L27.5 20.0751L20.5 16.9126V25.3625Z" fill="white" fillOpacity="0.2"/>
              <path d="M13.5 20.0751L20.5 25.3625V16.9126L13.5 20.0751Z" fill="white" fillOpacity="0.602"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
