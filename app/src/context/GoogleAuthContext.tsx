"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type GoogleAuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
  loading: boolean;
};

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(undefined);

export function GoogleAuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('google_access_token');
    if (savedToken) {
      setAccessTokenState(savedToken);
    }
    setLoading(false);
  }, []);

  const setAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    if (token) {
      sessionStorage.setItem('google_access_token', token);
    } else {
      sessionStorage.removeItem('google_access_token');
    }
  };

  const logout = () => {
    setAccessToken(null);
    if (accessToken) {
      fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
      }).catch(console.error);
    }
  };

  const isAuthenticated = !!accessToken;

  const value = {
    accessToken,
    setAccessToken,
    isAuthenticated,
    logout,
    loading,
  };

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  );
}

export function useGoogleAuth() {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error("useGoogleAuth must be used within GoogleAuthProvider");
  }
  return context;
}