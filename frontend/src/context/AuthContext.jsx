import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  getCurrentUserApi,
  loginUserApi,
  registerUserApi,
  logoutUserApi,
  updateAccountDetailsApi,
  updateUserAvatarApi,
  updateUserCoverImageApi,
  changeCurrentPasswordApi,
} from '../api/auth.api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCurrentUserApi();
      if (response?.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      setError(err.message || 'Unauthenticated');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setError(null);
    try {
      const response = await loginUserApi(credentials);
      // Response shape: { statusCode: 200, data: { user, accessToken, refreshToken }, message, success }
      if (response?.data?.user) {
        setUser(response.data.user);
        return response;
      }
      throw new Error('Invalid login response from server');
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  }, []);

  const register = useCallback(async (formData) => {
    setError(null);
    try {
      const response = await registerUserApi(formData);
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUserApi();
    } catch (err) {
      console.warn('Logout error:', err.message);
    } finally {
      setUser(null);
    }
  }, []);

  const updateAccountDetails = useCallback(async (details) => {
    try {
      const response = await updateAccountDetailsApi(details);
      if (response?.data) {
        setUser(response.data);
      }
      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  const updateAvatar = useCallback(async (formData, onProgress) => {
    try {
      const response = await updateUserAvatarApi(formData, onProgress);
      if (response?.data) {
        setUser(response.data);
      }
      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  const updateCoverImage = useCallback(async (formData, onProgress) => {
    try {
      const response = await updateUserCoverImageApi(formData, onProgress);
      if (response?.data) {
        setUser(response.data);
      }
      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  const changePassword = useCallback(async (passwords) => {
    try {
      const response = await changeCurrentPasswordApi(passwords);
      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  const updateUser = useCallback((updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  }, []);

  useEffect(() => {
    checkAuth();

    const handleUnauthorized = () => {
      setUser(null);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:unauthorized', handleUnauthorized);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth:unauthorized', handleUnauthorized);
      }
    };
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        checkAuth,
        login,
        register,
        logout,
        updateAccountDetails,
        updateAvatar,
        updateCoverImage,
        changePassword,
        updateUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
