import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
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
  const [loading, setLoading] = useState(true);

  // Sync Supabase Auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const u = session.user;
          const metaName = u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'User';
          const syncedUser = {
            id: u.id,
            email: u.email,
            fullName: metaName,
            full_name: metaName,
            name: metaName,
            avatar: metaName.charAt(0).toUpperCase(),
            created_at: u.created_at
          };
          setUser(syncedUser);
          localStorage.setItem('finai_user_name', metaName);
        }
      } catch (err) {
        console.warn('Supabase getSession note:', err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const u = session.user;
        const metaName = u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'User';
        const syncedUser = {
          id: u.id,
          email: u.email,
          fullName: metaName,
          full_name: metaName,
          name: metaName,
          avatar: metaName.charAt(0).toUpperCase(),
          created_at: u.created_at
        };
        setUser(syncedUser);
        localStorage.setItem('finai_user_name', metaName);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('moneymind_user', JSON.stringify(user));
      setProfile(user);
    } else {
      localStorage.removeItem('moneymind_user');
      setProfile(null);
    }
  }, [user]);

  // Instant Account Creation / Supabase Sign Up
  const createAccount = async (fullName, email, password = '') => {
    const cleanName = (fullName || 'User').trim();
    const cleanEmail = (email || 'user@moneymind.app').trim();
    localStorage.setItem('finai_user_name', cleanName);

    try {
      if (password && password.length >= 6) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: { full_name: cleanName }
          }
        });

        if (data?.user) {
          const newUser = {
            id: data.user.id,
            email: cleanEmail,
            fullName: cleanName,
            full_name: cleanName,
            name: cleanName,
            avatar: cleanName.charAt(0).toUpperCase(),
            hasPassword: Boolean(password),
            created_at: data.user.created_at || new Date().toISOString()
          };
          setUser(newUser);
          return newUser;
        }
      }
    } catch (err) {
      console.warn('Supabase signUp fallback note:', err.message);
    }

    // Local / offline instant fallback
    const localUser = {
      id: 'usr_' + Date.now(),
      email: cleanEmail,
      fullName: cleanName,
      full_name: cleanName,
      name: cleanName,
      avatar: cleanName.charAt(0).toUpperCase(),
      hasPassword: Boolean(password),
      created_at: new Date().toISOString()
    };
    setUser(localUser);
    return localUser;
  };

  const updateProfileName = async (newName) => {
    if (!newName || !newName.trim()) return;
    const clean = newName.trim();
    localStorage.setItem('finai_user_name', clean);

    if (user?.id && !user.id.startsWith('usr_')) {
      try {
        await supabase.from('profiles').update({ full_name: clean }).eq('id', user.id);
        await supabase.auth.updateUser({ data: { full_name: clean } });
      } catch (err) {
        console.warn('Supabase updateProfileName note:', err.message);
      }
    }

    setUser(prev => prev ? {
      ...prev,
      fullName: clean,
      full_name: clean,
      name: clean,
      avatar: clean.charAt(0).toUpperCase()
    } : null);
  };

  const signUp = async (email, password, fullName) => {
    return await createAccount(fullName, email, password);
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (data?.user) {
        const metaName = data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User';
        const loggedUser = {
          id: data.user.id,
          email: data.user.email,
          fullName: metaName,
          full_name: metaName,
          name: metaName,
          avatar: metaName.charAt(0).toUpperCase(),
          created_at: data.user.created_at
        };
        setUser(loggedUser);
        return loggedUser;
      }
    } catch (err) {
      console.warn('Supabase signIn note:', err.message);
    }

    const data = await authApi.login(email, password);
    setUser(data.user);
    return data.user;
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut note:', err.message);
    }
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
    updateProfileName,
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
