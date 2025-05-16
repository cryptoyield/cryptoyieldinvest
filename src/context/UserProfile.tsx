import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile: React.FC = () => {
  const { user, updateProfile, logout, authMethod } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!user) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const success = await updateProfile({
        displayName: formData.displayName,
        email: formData.email
      });

      if (success) {
        setSuccessMessage('Profile updated successfully');
        setIsEditing(false);
      } else {
        setErrorMessage('Failed to update profile');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred');
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: user.displayName || '',
      email: user.email || ''
    });
    setIsEditing(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Profile</h2>
        <div className="flex space-x-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          ) : null}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Display Name
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {user.email && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={authMethod !== 'email_password'}
              />
              {authMethod !== 'email_password' && (
                <p className="text-xs text-gray-500 mt-1">
                  You can't change your email for accounts linked with {authMethod}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="h-16 w-16 rounded-full mr-4"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                <span className="text-xl font-medium text-blue-700 dark:text-blue-300">
                  {user.displayName?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {user.displayName}
              </h3>
              {user.email && (
                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Account Type: {authMethod?.replace('_', ' ').toUpperCase()}
            </p>
            {user.walletAddress && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span className="font-medium">Wallet Address:</span> {user.walletAddress}
              </p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span className="font-medium">Joined:</span>{' '}
              {user.registrationDate?.toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
