import React, { createContext, useContext, useState } from 'react';

type Role = 'kae' | 'kam' | null;

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  isAuthenticated: boolean;
  role: Role;
  user: User | null;
  login: (username: string, password: string, role: 'kae' | 'kam') => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS = {
  kae: { id: 1, name: 'Rajan Kumar', email: 'rajan@bwg.com', username: 'admin', password: 'password' },
  kam: { id: 100, name: 'Arjun Mehta', email: 'arjun.mehta@bwg.com', username: 'kam', password: 'kam123' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [role, setRole] = useState<Role>(() =>
    (localStorage.getItem('userRole') as Role) || null
  );
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string, loginRole: 'kae' | 'kam'): Promise<boolean> => {
    const mock = MOCK_USERS[loginRole];
    if (username === mock.username && password === mock.password) {
      const userData: User = { id: mock.id, name: mock.name, email: mock.email, role: loginRole };
      setIsAuthenticated(true);
      setRole(loginRole);
      setUser(userData);
      setError(null);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', loginRole);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    setError('Invalid username or password');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
