import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  verifyAccess: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

const ADMIN_PASSWORD = 'admin2024';

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  const verifyAccess = (password: string) => {
    const isValid = password === ADMIN_PASSWORD;
    if (isValid) {
      localStorage.setItem('isAdmin', 'true');
      setIsAdmin(true);
    }
    return isValid;
  };

  const logout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, verifyAccess, logout }}>
      {children}
    </AdminContext.Provider>
  );
};