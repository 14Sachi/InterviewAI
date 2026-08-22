import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, name: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => Promise<{ success: boolean; token?: string; user?: User; error?: string }>;
  logout: () => void;
  updateUserInContext: (updated: User) => void;
  setSessionAuth: (token: string, user: User) => void;
  claimAdminRole: (passkey?: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('interview_ai_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(
    (localStorage.getItem('interview_ai_theme') as 'dark' | 'light') || 'dark'
  );

  useEffect(() => {
    // Apply dark class and colorScheme to root
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('interview_ai_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Token invalid or expired, clear user
          localStorage.removeItem('interview_ai_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to verify token:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [token]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      localStorage.setItem('interview_ai_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const signup = async (email: string, name: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Signup failed' };
      }

      localStorage.setItem('interview_ai_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const loginAsGuest = async () => {
    try {
      const res = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Guest initialization failed' };
      }

      localStorage.setItem('interview_ai_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, token: data.token, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const setSessionAuth = (newToken: string, newUser: User) => {
    localStorage.setItem('interview_ai_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('interview_ai_token');
    setToken(null);
    setUser(null);
  };

  const updateUserInContext = (updated: User) => {
    setUser(updated);
  };

  const claimAdminRole = async (passkey?: string) => {
    try {
      let currentToken = token;
      // If guest or no user, initialize first
      if (!currentToken) {
        const guestRes = await loginAsGuest();
        if (!guestRes.success || !guestRes.token) {
          return { success: false, error: 'Could not initialize session' };
        }
        currentToken = guestRes.token;
      }

      const res = await fetch('/api/admin/claim-ownership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ passkey: passkey || 'admin123' }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to verify admin passkey' };
      }

      localStorage.setItem('interview_ai_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        theme,
        toggleTheme,
        login,
        signup,
        loginAsGuest,
        logout,
        updateUserInContext,
        setSessionAuth,
        claimAdminRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
