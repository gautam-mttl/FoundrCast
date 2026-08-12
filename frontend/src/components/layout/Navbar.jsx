import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { Radio, Search, X, User, LogOut, Settings, Menu } from 'lucide-react';

export const Navbar = ({
  searchQuery = '',
  onSearchChange,
  onSearchSubmit,
  onOpenSettings,
  onOpenAuth,
  onToggleSidebar,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Sync local query with prop changes (e.g. when cleared externally)
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit(localQuery);
  };

  const handleClear = () => {
    setLocalQuery('');
    if (onSearchChange) onSearchChange('');
    if (onSearchSubmit) onSearchSubmit('');
  };

  return (
    <header
      className="glass-panel"
      style={{
        borderRadius: 0,
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        gap: '1rem',
      }}
    >
      {/* Left: Menu toggle & Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Menu size={22} />
        </button>

        <div
          onClick={handleClear}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--glow-primary)',
            }}
          >
            <Radio size={20} color="#ffffff" />
          </div>
          <span
            className="gradient-text"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              fontWeight: 800,
              letterSpacing: '-0.5px',
            }}
          >
            FoundrCast
          </span>
        </div>
      </div>

      {/* Middle: Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        style={{
          flex: 1,
          maxWidth: '540px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '14px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search FoundrCast videos, tech startups, AI..."
          value={localQuery}
          onChange={(e) => {
            const val = e.target.value;
            setLocalQuery(val);
            if (onSearchChange) onSearchChange(val);
          }}
          style={{
            width: '100%',
            padding: '10px 40px 10px 40px',
            borderRadius: '20px',
            background: 'var(--bg-dark-surface)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--brand-primary)';
            e.target.style.boxShadow = '0 0 12px rgba(99, 102, 241, 0.25)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--glass-border)';
            e.target.style.boxShadow = 'none';
          }}
        />
        {localQuery && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '12px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* Right: Auth State & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* User Avatar & Name */}
            <div
              onClick={onOpenSettings}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: 'var(--bg-dark-card)',
                border: '1px solid var(--glass-border)',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'var(--brand-gradient)',
                  border: '1px solid var(--brand-primary)',
                }}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <User size={16} color="#fff" />
                )}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                @{user?.username}
              </span>
            </div>

            <Button
              variant="secondary"
              onClick={onOpenSettings}
              style={{ padding: '8px 12px', fontSize: '12px' }}
            >
              <Settings size={15} />
            </Button>
            <Button
              variant="danger"
              onClick={logout}
              style={{ padding: '8px 12px', fontSize: '12px' }}
            >
              <LogOut size={15} />
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="secondary"
              onClick={() => onOpenAuth && onOpenAuth('login')}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              onClick={() => onOpenAuth && onOpenAuth('register')}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              Register
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
