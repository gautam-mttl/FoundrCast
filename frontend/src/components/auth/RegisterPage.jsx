import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { FileUploadInput } from '../common/FileUploadInput';
import { User, Mail, AtSign, Lock, UserPlus, AlertCircle } from 'lucide-react';

export const RegisterPage = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim() || !email.trim() || !username.trim() || !password) {
      setFormError('All text fields are required');
      return;
    }

    if (!avatarFile) {
      setFormError('Avatar image file is required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('email', email.trim().toLowerCase());
      formData.append('username', username.trim().toLowerCase());
      formData.append('password', password);
      formData.append('avatar', avatarFile);
      if (coverFile) {
        formData.append('coverImage', coverFile);
      }

      await register(formData);
      addToast('Account registered successfully! Please log in.', 'success');
      if (onSwitchToLogin) onSwitchToLogin();
    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.';
      setFormError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', width: '100%', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }} className="gradient-text">
          Join FoundrCast
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Create your creator channel profile
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <Input
          label="Full Name"
          placeholder="e.g. Gautam Mittal"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          icon={User}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. gautam@foundrcast.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
          required
        />

        <Input
          label="Username / Channel Handle"
          placeholder="e.g. gautammttl"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          icon={AtSign}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
          required
        />

        <FileUploadInput
          label="Channel Avatar Image"
          onChange={(file) => setAvatarFile(file)}
          required
        />

        <FileUploadInput
          label="Cover Banner Image (Optional)"
          onChange={(file) => setCoverFile(file)}
        />

        <Button type="submit" isLoading={loading} style={{ width: '100%', marginTop: '0.5rem', padding: '12px' }}>
          <UserPlus size={18} /> Register Channel
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '13px', color: 'var(--text-secondary)' }}>
        Already have a channel?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--brand-cyan)',
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};
