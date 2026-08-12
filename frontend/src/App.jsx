import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import { getHealthcheck } from './api/healthcheck.api';
import { Button } from './components/common/Button';
import { Spinner } from './components/common/Spinner';
import { Activity, ShieldCheck, Database, Radio, Server, CheckCircle2, XCircle } from 'lucide-react';

export function App() {
  const { user, isAuthenticated, loading: authLoading, checkAuth } = useAuth();
  const { addToast } = useToast();

  const [healthStatus, setHealthStatus] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState(null);

  const fetchHealth = async () => {
    setHealthLoading(true);
    setHealthError(null);
    try {
      const response = await getHealthcheck();
      setHealthStatus(response);
      addToast('Backend healthcheck response received!', 'success');
    } catch (err) {
      setHealthError(err.message || 'Failed to connect to backend');
      addToast(`Healthcheck failed: ${err.message}`, 'error');
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'radial-gradient(circle at top, #181c28 0%, #090a0f 100%)',
      }}
    >
      <main
        className="glass-panel"
        style={{
          maxWidth: '640px',
          width: '100%',
          padding: '2.5rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'var(--brand-gradient)',
              marginBottom: '1rem',
              boxShadow: 'var(--glow-primary)',
            }}
          >
            <Radio size={32} color="#ffffff" />
          </div>
          <h1
            className="gradient-text"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.25rem',
              fontWeight: 800,
              letterSpacing: '-0.5px',
            }}
          >
            FoundrCast
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            Phase 1: Architecture & API Client Verification
          </p>
        </div>

        {/* Verification Status Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Card 1: API Configuration */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              background: 'var(--bg-dark-card)',
              border: '1px solid var(--glass-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Server size={20} color="var(--brand-cyan)" />
              <strong style={{ fontSize: '0.95rem' }}>API Client Target</strong>
            </div>
            <code
              style={{
                display: 'block',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                background: 'var(--bg-dark-base)',
                color: 'var(--brand-cyan)',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                wordBreak: 'break-all',
              }}
            >
              {apiBaseUrl}
            </code>
          </div>

          {/* Card 2: Backend Healthcheck Status */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              background: 'var(--bg-dark-card)',
              border: '1px solid var(--glass-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Activity size={20} color="var(--brand-primary)" />
                <strong style={{ fontSize: '0.95rem' }}>Backend Connectivity</strong>
              </div>
              <Button variant="secondary" onClick={fetchHealth} isLoading={healthLoading} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                Test Ping
              </Button>
            </div>

            {healthLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Spinner size={16} /> <span>Pinging Express server at {apiBaseUrl}/healthcheck/test...</span>
              </div>
            ) : healthError ? (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--state-error)' }}>
                <XCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Healthcheck Error:</strong>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.2rem', color: 'var(--text-secondary)' }}>{healthError}</div>
                </div>
              </div>
            ) : healthStatus ? (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--state-success)' }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Status {healthStatus.statusCode || 200}: Healthy</strong>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.2rem', color: 'var(--text-secondary)' }}>
                    Message: "{healthStatus.message}"
                  </div>
                  <pre
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      background: 'var(--bg-dark-base)',
                      fontSize: '0.75rem',
                      color: 'var(--text-primary)',
                      overflowX: 'auto',
                    }}
                  >
                    {JSON.stringify(healthStatus.data, null, 2)}
                  </pre>
                </div>
              </div>
            ) : null}
          </div>

          {/* Card 3: Auth Session Bootstrap */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              background: 'var(--bg-dark-card)',
              border: '1px solid var(--glass-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={20} color="var(--brand-accent)" />
                <strong style={{ fontSize: '0.95rem' }}>Auth Session Bootstrap</strong>
              </div>
              <Button variant="ghost" onClick={checkAuth} isLoading={authLoading} style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                Re-check
              </Button>
            </div>

            {authLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Spinner size={16} color="var(--brand-accent)" /> <span>Bootstrapping AuthContext via /users/current-user...</span>
              </div>
            ) : isAuthenticated ? (
              <div style={{ color: 'var(--state-success)' }}>
                <strong>Authenticated Session Active</strong>
                <pre
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    background: 'var(--bg-dark-base)',
                    fontSize: '0.75rem',
                    color: 'var(--text-primary)',
                    overflowX: 'auto',
                  }}
                >
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                No active cookie session found (Unauthenticated / Guest user state verified). Session handling ready for Phase 2.
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          FoundrCast Frontend Core Setup Complete • Phase 1 Verified
        </div>
      </main>
    </div>
  );
}
