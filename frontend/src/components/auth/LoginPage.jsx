import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { User, Lock, LogIn, AlertCircle } from 'lucide-react';

export const LoginPage = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const { addToast } = useToast();

  const [identity, setIdentity] = useState(''); // Stores email or username
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!identity.trim()) {
      setFormError('Please enter your username or email');
      return;
    }
    if (!password) {
      setFormError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      // Backend expects { username, email, password }
      const isEmail = identity.includes('@');
      const credentials = {
        username: isEmail ? '' : identity.trim(),
        email: isEmail ? identity.trim() : '',
        password,
      };

      await login(credentials);
      addToast('Logged in successfully!', 'success');
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setFormError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }} className="gradient-text">
          Welcome Back
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Sign in to your FoundrCast creator account
        </p>
      </div>

      {formError && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            fontSize: '13px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Input
          label="Username or Email"
          placeholder="e.g. founder@cast.com or creator"
          value={identity}
          onChange={(e) => setIdentity(e.target.value)}
          icon={User}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
          required
        />

        <Button type="submit" isLoading={loading} style={{ width: '100%', marginTop: '0.5rem', padding: '12px' }}>
          <LogIn size={18} /> Sign In
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '13px', color: 'var(--text-secondary)' }}>
        Don't have a channel yet?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--brand-cyan)',
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Create Channel
        </button>
      </div>
    </div>
  );
};
