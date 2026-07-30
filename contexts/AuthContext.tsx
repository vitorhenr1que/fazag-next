import { createContext, useContext, useEffect, useState } from 'react';

export type AdminPermission =
  | 'courses'
  | 'academic_calendar'
  | 'nusp'
  | 'ombudsman'
  | 'institutional_publications';

export interface User {
  id: string;
  email: string;
  name: string | null;
  isSuperAdmin: boolean;
  permissions: AdminPermission[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  hasPermission: (permission: AdminPermission) => boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  login: () => {},
  logout: async () => {},
  hasPermission: () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (response) => {
        if (!response.ok) return null;
        const data = await response.json();
        return data.user as User;
      })
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
    }
  };

  const hasPermission = (permission: AdminPermission) =>
    Boolean(user && (user.isSuperAdmin || user.permissions.includes(permission)));

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
