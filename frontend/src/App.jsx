import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import { getHealthcheck } from './api/healthcheck.api';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { UserProfileCard } from './components/profile/UserProfileCard';
import { Button } from './components/common/Button';
import { Spinner } from './components/common/Spinner';
import { Radio, Activity, CheckCircle2, XCircle } from 'lucide-react';

export function App() {
  const { isAuthenticated, loading: authLoading, checkAuth } = useAuth();
  const { addToast } = useToast();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [healthStatus, setHealthStatus] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);

  const fetchHealth = async () => {
    setHealthLoading(true);
    try {
      const response = await getHealthcheck();
      setHealthStatus(response);
    } catch (err) {
      setHealthStatus(null);
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-dark-base)',
          color: 'var(--text-secondary)',
          gap: '1rem',
        }}
      >
        <Spinner size={36} />
        <span style={{ fontSize: '14px', fontWeight: 500 }}>Connecting to FoundrCast...</span>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, #181c28 0%, #090a0f 100%)',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header Navigation */}
      <header
        className="glass-panel"
        style={{
          borderRadius: 0,
          borderLeft: 'none',
          borderRight: 'none',
          borderTop: 'none',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--glow-primary)',
            }}
          >
            <Radio size={22} color="#ffffff" />
          </div>
          <span
            className="gradient-text"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.5px',
            }}
          >
            FoundrCast
          </span>
        </div>

        {/* Healthcheck Indicator Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              background: 'var(--bg-dark-surface)',
              border: '1px solid var(--glass-border)',
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            <Activity size={14} color="var(--brand-cyan)" />
            {healthStatus ? (
              <span style={{ color: 'var(--state-success)' }}>API Status 200 OK</span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>Backend Offline / Checking</span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1.5rem',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {isAuthenticated ? (
          /* Authenticated User Profile & Settings View */
          <div style={{ maxWidth: '640px', width: '100%' }}>
            <UserProfileCard />
          </div>
        ) : (
          /* Unauthenticated Guest Mode (Login / Register Tabs) */
          <div
            className="glass-panel"
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: '2.25rem',
              borderRadius: '20px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            }}
          >
            {authMode === 'login' ? (
              <LoginPage onSwitchToRegister={() => setAuthMode('register')} />
            ) : (
              <RegisterPage onSwitchToLogin={() => setAuthMode('login')} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
