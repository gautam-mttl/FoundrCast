import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { FileUploadInput } from '../common/FileUploadInput';
import { User, Mail, Image, Lock, Save, Upload, Shield } from 'lucide-react';

export const AccountSettingsModal = ({ isOpen, onClose }) => {
  const { user, updateAccountDetails, updateAvatar, updateCoverImage, changePassword } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'media' | 'security'

  // Tab 1 Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Tab 2 Form State
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarProgress, setAvatarProgress] = useState(0);
  const [coverProgress, setCoverProgress] = useState(0);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);

  // Tab 3 Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      addToast('Full name and email are required', 'error');
      return;
    }

    setDetailsLoading(true);
    try {
      await updateAccountDetails({ fullName: fullName.trim(), email: email.trim().toLowerCase() });
      addToast('Account details updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update account details', 'error');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    if (!avatarFile) {
      addToast('Please select a new avatar image first', 'error');
      return;
    }

    setAvatarLoading(true);
    setAvatarProgress(0);
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      await updateAvatar(formData, (percent) => setAvatarProgress(percent));
      addToast('Avatar updated successfully!', 'success');
      setAvatarFile(null);
    } catch (err) {
      addToast(err.message || 'Failed to update avatar', 'error');
    } finally {
      setAvatarLoading(false);
      setAvatarProgress(0);
    }
  };

  const handleUpdateCover = async (e) => {
    e.preventDefault();
    if (!coverFile) {
      addToast('Please select a new cover banner image first', 'error');
      return;
    }

    setCoverLoading(true);
    setCoverProgress(0);
    try {
      const formData = new FormData();
      formData.append('coverImage', coverFile);

      await updateCoverImage(formData, (percent) => setCoverProgress(percent));
      addToast('Cover image updated successfully!', 'success');
      setCoverFile(null);
    } catch (err) {
      addToast(err.message || 'Failed to update cover image', 'error');
    } finally {
      setCoverLoading(false);
      setCoverProgress(0);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      addToast('Both current and new passwords are required', 'error');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword({ oldPassword, newPassword });
      addToast('Password changed successfully!', 'success');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      addToast(err.message || 'Failed to change password', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account Settings" maxWidth="600px">
      {/* Subtab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--glass-border)',
          marginBottom: '1.5rem',
          paddingBottom: '0.5rem',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: activeTab === 'details' ? 'var(--brand-primary)' : 'transparent',
            color: activeTab === 'details' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <User size={16} /> Details
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('media')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: activeTab === 'media' ? 'var(--brand-primary)' : 'transparent',
            color: activeTab === 'media' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Image size={16} /> Avatar & Banner
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: activeTab === 'security' ? 'var(--brand-primary)' : 'transparent',
            color: activeTab === 'security' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Shield size={16} /> Security
        </button>
      </div>

      {/* Tab 1: Profile Details */}
      {activeTab === 'details' && (
        <form onSubmit={handleUpdateDetails} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon={User}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button type="submit" isLoading={detailsLoading}>
              <Save size={16} /> Save Details
            </Button>
          </div>
        </form>
      )}

      {/* Tab 2: Avatar & Banner */}
      {activeTab === 'media' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Avatar Form */}
          <form onSubmit={handleUpdateAvatar} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <FileUploadInput
              label="Update Avatar Image"
              currentUrl={user?.avatar}
              onChange={(file) => setAvatarFile(file)}
              progress={avatarProgress}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" isLoading={avatarLoading} disabled={!avatarFile}>
                <Upload size={16} /> Upload New Avatar
              </Button>
            </div>
          </form>

          <hr style={{ borderColor: 'var(--glass-border)', opacity: 0.5 }} />

          {/* Cover Banner Form */}
          <form onSubmit={handleUpdateCover} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <FileUploadInput
              label="Update Cover Banner Image"
              currentUrl={user?.coverImage}
              onChange={(file) => setCoverFile(file)}
              progress={coverProgress}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" isLoading={coverLoading} disabled={!coverFile}>
                <Upload size={16} /> Upload New Cover
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Security */}
      {activeTab === 'security' && (
        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            icon={Lock}
            required
          />

          <Input
            label="New Password"
            type="password"
            placeholder="Enter new strong password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon={Lock}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button type="submit" isLoading={passwordLoading}>
              <Lock size={16} /> Update Password
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
