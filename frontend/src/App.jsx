import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { HomePage } from './pages/HomePage';
import { WatchPage } from './pages/WatchPage';
import { PlaylistsPage } from './pages/PlaylistsPage';
import { PlaylistDetailPage } from './pages/PlaylistDetailPage';
import { UserProfileCard } from './components/profile/UserProfileCard';
import { AccountSettingsModal } from './components/profile/AccountSettingsModal';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { Modal } from './components/common/Modal';
import { Spinner } from './components/common/Spinner';

export function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const { addToast } = useToast();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState(null); // 'login' | 'register' | null

  const searchQuery = searchParams.get('q') || '';

  const handleSearchChange = (q) => {
    if (q) {
      setSearchParams({ q }, { replace: false });
      if (location.pathname !== '/') {
        navigate(`/?q=${encodeURIComponent(q)}`);
      }
    } else {
      setSearchParams({}, { replace: true });
      if (location.pathname !== '/') {
        navigate('/');
      }
    }
  };

  const handleSelectTab = (tabId) => {
    if (tabId === 'home') {
      navigate('/');
    } else if (tabId === 'playlists') {
      navigate('/playlists');
    } else if (tabId === 'profile') {
      navigate('/profile');
    } else if (['subscriptions', 'history', 'liked', 'dashboard'].includes(tabId)) {
      addToast(`${tabId.charAt(0).toUpperCase() + tabId.slice(1)} view planned in upcoming phase!`, 'info');
    }
  };

  // Compute active sidebar tab from URL pathname
  const activeTab = location.pathname.startsWith('/profile')
    ? 'profile'
    : location.pathname.startsWith('/playlist')
    ? 'playlists'
    : location.pathname.startsWith('/watch')
    ? 'home'
    : 'home';

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
        background: 'var(--bg-dark-base)',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchChange}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Layout Container */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Responsive Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          isCollapsed={isSidebarCollapsed}
        />

        {/* Content Body Area */}
        <main
          style={{
            flex: 1,
            padding: '1.75rem 2rem',
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
            minWidth: 0,
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  searchQuery={searchQuery}
                  onOpenAuth={(mode) => setAuthModalMode(mode)}
                />
              }
            />
            <Route
              path="/watch/:videoId"
              element={
                <WatchPage onOpenAuth={(mode) => setAuthModalMode(mode)} />
              }
            />
            <Route
              path="/playlists"
              element={
                <PlaylistsPage onOpenAuth={(mode) => setAuthModalMode(mode)} />
              }
            />
            <Route
              path="/playlist/:playlistId"
              element={
                <PlaylistDetailPage onOpenAuth={(mode) => setAuthModalMode(mode)} />
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated ? (
                  <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                    <UserProfileCard />
                  </div>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Account Settings Modal */}
      <AccountSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Auth Modal (Login / Register overlay for guests) */}
      <Modal
        isOpen={!!authModalMode}
        onClose={() => setAuthModalMode(null)}
        title={authModalMode === 'login' ? 'Sign In to FoundrCast' : 'Create Creator Channel'}
        maxWidth="480px"
      >
        {authModalMode === 'login' ? (
          <LoginPage
            onSwitchToRegister={() => setAuthModalMode('register')}
            onSuccess={() => setAuthModalMode(null)}
          />
        ) : (
          <RegisterPage
            onSwitchToLogin={() => setAuthModalMode('login')}
            onSuccess={() => setAuthModalMode(null)}
          />
        )}
      </Modal>
    </div>
  );
}
