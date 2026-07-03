import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import { generateId } from '../utils/id';

// ⚠️  MOCK AUTH — plaintext passwords, localStorage-only.
// This is a placeholder for a real backend auth flow (JWT, bcrypt, etc.).
// Do NOT copy this pattern into production code.
interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthSession {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthContextValue {
  user: AuthSession | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { ok: true;} | {ok: false;error: string;};
  signup: (
  name: string,
  email: string,
  phone: string,
  password: string)
  => {ok: true;} | {ok: false;error: string;};
  logout: () => void;
  updateProfile: (data: { name?: string; phone?: string }) => void;
  authModalOpened: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USERS_KEY = 'almoedat-mock-users';
const SESSION_KEY = 'almoedat-auth-session';

const DEMO_USER: MockUser = {
  id: 'user-demo-001',
  name: 'مستخدم تجريبي',
  email: 'demo@almoedat.com',
  phone: '0500000000',
  password: '123456'
};

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [users, setUsers] = useLocalStorage<MockUser[]>({
    key: USERS_KEY,
    defaultValue: [DEMO_USER]
  });
  const [session, setSession] = useLocalStorage<AuthSession | null>({
    key: SESSION_KEY,
    defaultValue: null
  });
  const [authModalOpened, setAuthModalOpened] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Ensure demo user always exists
  useEffect(() => {
    setUsers((current) => {
      if (current.some((u) => u.email === DEMO_USER.email)) {
        return current;
      }
      return [DEMO_USER, ...current];
    });
  }, []);

  const login: AuthContextValue['login'] = (email, password) => {
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      return { ok: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }
    setSession({ id: found.id, name: found.name, email: found.email, phone: found.phone });
    return { ok: true };
  };

  const signup: AuthContextValue['signup'] = (name, email, phone, password) => {
    if (users.some((u) => u.email === email)) {
      return { ok: false, error: 'يوجد حساب مسجل بهذا البريد الإلكتروني بالفعل' };
    }
    const newUser: MockUser = {
      id: `user-${generateId()}`,
      name,
      email,
      phone,
      password
    };
    setUsers((current) => [...current, newUser]);
    setSession({ id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone });
    return { ok: true };
  };

  const logout = () => setSession(null);

  const updateProfile: AuthContextValue['updateProfile'] = (data) => {
    if (!session) return;
    const updated: AuthSession = { ...session, ...data };
    setSession(updated);
    setUsers((current) =>
      current.map((u) => (u.id === session.id ? { ...u, ...data } : u))
    );
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpened(true);
  };
  const closeAuthModal = () => setAuthModalOpened(false);

  return (
    <AuthContext.Provider
      value={{
        user: session,
        isAuthenticated: session !== null,
        login,
        signup,
        logout,
        updateProfile,
        authModalOpened,
        authModalMode,
        openAuthModal,
        closeAuthModal
      }}>

      {children}
    </AuthContext.Provider>);

}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
