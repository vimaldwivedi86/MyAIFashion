import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, isAuthenticated } from '../lib/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  if (isAuthenticated()) {
    navigate(from, { replace: true });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = login(username.trim(), password);
    if (!res.ok) {
      setError(res.message || 'Login failed');
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#fcfbf8] px-6 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div>
            <button type="submit" className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white">Sign in</button>
          </div>
        </form>
        <p className="mt-4 text-xs text-gray-500">Temporary dev login: <strong>admin/password123</strong> or <strong>demo/demo123</strong></p>
      </div>
    </main>
  );
}
