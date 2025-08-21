import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
const logoUrl = new URL('../assets/login-logo.png', import.meta.url).href;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(username, password);
      navigate('/vcs');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#181C44' }}>
      <img src={logoUrl} alt="Digi-Vrtti Wallet" className="object-contain p-20 ml-10" />
      <div className="card w-full max-w-md">
        <form className="mt-6" onSubmit={handleSubmit}>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            placeholder="Username"
          />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="Password"
          />
          {error && (
            <div className="text-red-600 text-sm text-center mb-2">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Signing in...' : 'Log in'}
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
