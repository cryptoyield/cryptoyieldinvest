import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  checkAdminAccess: (address: string) => boolean;
}

const ADMIN_ADDRESS = '0xbbf2774687047eaDf48012568Da0369092a4875D';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminAccess = (address: string): boolean => {
    const isAuthorized = address.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
    setIsAdmin(isAuthorized);
    return isAuthorized;
  };

  return (
    <AdminContext.Provider value={{
      isAdmin,
      checkAdminAccess
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}