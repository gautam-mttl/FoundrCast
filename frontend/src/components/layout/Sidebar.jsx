import React from 'react';
import {
  Home,
  Compass,
  Users,
  FolderHeart,
  History,
  ThumbsUp,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';

export const Sidebar = ({ activeTab = 'home', onSelectTab, isCollapsed = false }) => {
  const menuItems = [
    { id: 'home', label: 'Home Feed', icon: Home, phase: 'Active' },
    { id: 'explore', label: 'Explore', icon: Compass, phase: 'Phase 3' },
    { id: 'subscriptions', label: 'Subscriptions', icon: Users, phase: 'Phase 5' },
    { id: 'playlists', label: 'Playlists', icon: FolderHeart, phase: 'Phase 6' },
    { id: 'history', label: 'Watch History', icon: History, phase: 'Phase 8' },
    { id: 'liked', label: 'Liked Videos', icon: ThumbsUp, phase: 'Phase 8' },
    { id: 'dashboard', label: 'Creator Studio', icon: LayoutDashboard, phase: 'Phase 7' },
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? '72px' : '230px',
        flexShrink: 0,
        height: 'calc(100vh - 65px)',
        position: 'sticky',
        top: '65px',
        background: 'var(--bg-dark-base)',
        borderRight: '1px solid var(--glass-border)',
        padding: isCollapsed ? '1rem 0.5rem' : '1.25rem 0.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        transition: 'width 0.2s ease',
        zIndex: 90,
      }}
    >
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab && onSelectTab(item.id)}
            title={isCollapsed ? item.label : ''}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '12px',
              padding: isCollapsed ? '12px' : '10px 14px',
              borderRadius: '12px',
              background: isActive
                ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)'
                : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: isActive ? '1px solid var(--glass-border)' : 'none',
              fontWeight: isActive ? 600 : 500,
              fontSize: '13.5px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              textAlign: 'left',
              width: '100%',
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.background = 'var(--bg-dark-hover)';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = 'transparent';
            }}
          >
            <Icon
              size={20}
              color={isActive ? 'var(--brand-primary)' : 'var(--text-muted)'}
              style={{ flexShrink: 0 }}
            />
            {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
          </button>
        );
      })}

      {/* Sidebar Footer info */}
      {!isCollapsed && (
        <div
          style={{
            marginTop: 'auto',
            padding: '12px',
            borderRadius: '12px',
            background: 'var(--bg-dark-card)',
            border: '1px solid var(--glass-border)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Sparkles size={16} color="var(--brand-accent)" style={{ flexShrink: 0 }} />
          <span>FoundrCast Platform • Phase 3 Public Feed</span>
        </div>
      )}
    </aside>
  );
};
