import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type UserRecord = { username: string } | null;

// Temporary in-memory users — for dev only. Override by editing this file.
const USERS: Record<string, string> = {
  admin: 'password123',
  demo: 'demo123',
  'vimalendukumar@scrutora.com': 'abcdefgh',
};

const STORAGE_KEY = 'myaifashion_session';

export function login(username: string, password: string): { ok: boolean; message?: string } {
  const expected = USERS[username];
  if (!expected) return { ok: false, message: 'Unknown user' };
  if (expected !== password) return { ok: false, message: 'Invalid password' };

  const token = `${username}:${Date.now().toString(36)}`;
  const payload = { username, token };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return { ok: true };
  } catch (err) {
    return { ok: false, message: 'Storage error' };
  }
}

export function logout(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  // no-op
}

export function getUser(): UserRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { username: parsed.username };
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getUser());
}

// React hook for components that need the auth state
export function useAuth() {
  const [user, setUser] = useState<UserRecord>(() => getUser());
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = () => setUser(getUser());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const doLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  return { user, isAuthenticated: Boolean(user), logout: doLogout };
}

