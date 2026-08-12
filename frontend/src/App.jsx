import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { HomePage } from './pages/HomePage';
import { UserProfileCard } from './components/profile/UserProfileCard';
import { AccountSettingsModal } from './components/profile/AccountSettingsModal';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { Modal } from './components/common/Modal';
import { Spinner } from './components/common/Spinner';

export function App() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'profile' | 'explore' | etc.
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState(null); // 'login' | 'register' | null
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'home') {
      setSearchQuery('');
    } else if (tabId === 'explore') {
      // Focus search
    } else if (['subscriptions', 'playlists', 'history', 'liked', 'dashboard'].includes(tabId)) {
      addToast(`${tabId.charAt(0).toUpperCase() + tabId.slice(1)} view planned in upcoming phase!`, 'info');
    }
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    addToast(`Video "${video.title}" selected! Full Watch Page playback planned in Phase 4.`, 'info');
  };

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
        onSearchChange={(q) => setSearchQuery(q)}
        onSearchSubmit={(q) => setSearchQuery(q)}
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
          {activeTab === 'profile' ? (
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>
              <UserProfileCard />
            </div>
          ) : (
            <HomePage
              searchQuery={searchQuery}
              onOpenAuth={(mode) => setAuthModalMode(mode)}
              onVideoSelect={handleVideoSelect}
            />
          )}
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
