import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { AccountSettingsModal } from './AccountSettingsModal';
import { Button } from '../common/Button';
import { User, Settings, LogOut, Mail, Calendar, ShieldCheck, Camera } from 'lucide-react';

export const UserProfileCard = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    addToast('Logged out of session', 'info');
  };

  return (
    <div style={{ width: '100%' }}>
      <div
        className="glass-panel"
        style={{
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--glass-border)',
          background: 'var(--bg-dark-card)',
        }}
      >
        {/* Cover Image Banner */}
        <div
          style={{
            height: '140px',
            width: '100%',
            background: user.coverImage
              ? `url(${user.coverImage}) center/cover no-repeat`
              : 'var(--brand-gradient)',
            position: 'relative',
          }}
        />

        {/* Profile Details Container */}
        <div style={{ padding: '0 1.75rem 1.75rem 1.75rem', position: 'relative' }}>
          {/* Avatar floating */}
          <div
            style={{
              position: 'relative',
              marginTop: '-50px',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                border: '4px solid var(--bg-dark-card)',
                background: 'var(--bg-dark-surface)',
                overflow: 'hidden',
                boxShadow: 'var(--glow-primary)',
                flexShrink: 0,
              }}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--brand-gradient)',
                    color: '#fff',
                  }}
                >
                  <User size={40} />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setIsSettingsOpen(true)} style={{ padding: '8px 14px', fontSize: '13px' }}>
                <Settings size={16} /> Edit Profile
              </Button>
              <Button variant="danger" onClick={handleLogout} style={{ padding: '8px 14px', fontSize: '13px' }}>
                <LogOut size={16} /> Log Out
              </Button>
            </div>
          </div>

          {/* User Info Headings */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {user.fullName}
            </h2>
            <div
              style={{
                fontSize: '0.9rem',
                color: 'var(--brand-cyan)',
                fontWeight: 600,
                marginTop: '0.1rem',
              }}
            >
              @{user.username}
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.25rem',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--glass-border)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={16} color="var(--text-muted)" />
                <span>{user.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="var(--state-success)" />
                <span>Verified Creator Channel</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile & Account Settings Modal */}
      <AccountSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};
