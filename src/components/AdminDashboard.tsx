import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { useWallet } from '../context/WalletContext';
import { FaUsers } from 'react-icons/fa';

function AdminDashboard() {
  const { isAdmin } = useAdmin();
  const { account } = useWallet();

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-error-100 dark:bg-error-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUsers className="w-8 h-8 text-error-600 dark:text-error-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">
            This area is restricted to authorized administrators only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20">
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">
              Connected as: <span className="font-mono">{account}</span>
            </p>
          </div>
        </div>

        <div className="card p-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>Connect to the smart contract to view real-time data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;