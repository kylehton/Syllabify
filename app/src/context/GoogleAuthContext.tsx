"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type GoogleAuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
};

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(undefined);

export function GoogleAuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <GoogleAuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </GoogleAuthContext.Provider>
  );
}

export function useGoogleAuth() {
  const context = useContext(GoogleAuthContext);
  if (!context) throw new Error("useGoogleAuth must be used within GoogleAuthProvider");
  return context;
}
