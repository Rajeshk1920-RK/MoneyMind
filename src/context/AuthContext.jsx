import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('moneymind_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('moneymind_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('moneymind_user', JSON.stringify(user));
      setProfile(user);
    } else {
      localStorage.removeItem('moneymind_user');
      setProfile(null);
    }
  }, [user]);

  // Instant Account Creation (Name & Email)
  const createAccount = (fullName, email) => {
    const cleanName = (fullName || 'User').trim();
    const cleanEmail = (email || 'user@moneymind.app').trim();
    const newUser = {
      id: 'usr_' + Date.now(),
      email: cleanEmail,
      fullName: cleanName,
      full_name: cleanName,
      name: cleanName,
      avatar: cleanName.charAt(0).toUpperCase(),
      created_at: new Date().toISOString()
    };
    setUser(newUser);
    return newUser;
  };

  const signUp = async (email, password, fullName) => {
    const data = await authApi.register(email, password, fullName);
    setUser(data.user);
    return data.user;
  };

  const signIn = async (email, password) => {
    const data = await authApi.login(email, password);
    setUser(data.user);
    return data.user;
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
  };

  const sendOtp = async (email, fullName = '') => {
    return await authApi.sendOtp(email, fullName);
  };

  const verifyOtp = async (email, otp, fullName = '') => {
    const data = await authApi.verifyOtp(email, otp, fullName);
    setUser(data.user);
    return data.user;
  };

  const value = {
    user,
    session: user ? { user } : null,
    profile,
    loading,
    isAuthenticated: !!user,
    createAccount,
    signUp,
    signIn,
    signOut,
    sendOtp,
    verifyOtp
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
