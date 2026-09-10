import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { api } from '../api';
import type { User } from '../types';
interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
function normalizeRole(role: unknown): User['role'] {
  return String(role).toLowerCase() === 'professor' ? 'professor' : 'aluno';
}
function userFromToken(token: string): User | null {
  try {
    const encodedPayload = token.split('.')[1];
    const payload = JSON.parse(
      atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/')),
    );
    if (!payload.username || !payload.role) return null;
    return {
      id: payload.sub,
      username: payload.username,
      role: normalizeRole(payload.role),
    };
  } catch {
    return null;
  }
}
function initialToken(): string | null {
  const token = localStorage.getItem('academic_blog_token');
  if (!token || !userFromToken(token)) {
    localStorage.removeItem('academic_blog_token');
    return null;
  }
  return token;
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(initialToken);
  const user = token ? userFromToken(token) : null;
  useEffect(() => {
    const expire = () => {
      localStorage.removeItem('academic_blog_token');
      setToken(null);
    };
    window.addEventListener('auth:expired', expire);
    return () => window.removeEventListener('auth:expired', expire);
  }, []);
  const value = useMemo(
    () => ({
      user,
      token,
      login: async (username: string, password: string) => {
        const response = await api.post<{ access_token: string }>(
          '/auth/login',
          { username, password },
        );
        localStorage.setItem('academic_blog_token', response.data.access_token);
        setToken(response.data.access_token);
      },
      logout: () => {
        localStorage.removeItem('academic_blog_token');
        setToken(null);
      },
    }),
    [token, user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
