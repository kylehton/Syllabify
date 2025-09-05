"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleAuth } from "@/context/GoogleAuthContext";

// Type definitions for Google OAuth responses
interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  error?: string;
  error_description?: string;
}

// Simplified Google API interfaces (only what we need)
interface GoogleTokenClient {
  requestAccessToken: (options: { prompt: string }) => void;
}

interface GoogleOAuth2 {
  initTokenClient: (config: {
    client_id: string;
    scope: string;
    callback: (response: GoogleTokenResponse) => void;
  }) => GoogleTokenClient;
}

declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: GoogleOAuth2;
      };
    };
  }
}

export default function GoogleSignInButton() {
  const router = useRouter();
  const { setAccessToken } = useGoogleAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    throw new Error("Google client ID not defined");
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsLoaded(true);
    };
    script.onerror = () => {
      setError("Failed to load Google Sign-In");
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleLogin = async () => {
    if (!isLoaded) return;

    try {
      setError(null);
      
      // This gets you an access token directly - no backend needed initially
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        scope: "https://www.googleapis.com/auth/calendar.events",
        callback: (response: GoogleTokenResponse) => {
          if (response.error) {
            setError(`Authentication failed: ${response.error_description || response.error}`);
            return;
          }

          if (response.access_token) {
            console.log("Got access token:", response.access_token.substring(0, 20) + "...");
            setAccessToken(response.access_token);
            router.push("/dashboard");
          } else {
            setError("No access token received");
          }
        },
      });

      client.requestAccessToken({
        prompt: "consent",
      });
    } catch (error) {
      console.error("Authentication error:", error);
      setError("Authentication failed");
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button 
        onClick={handleLogin} 
        disabled={!isLoaded}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600 transition-colors"
      >
        {isLoaded ? "Sign in with Google" : "Loading..."}
      </button>
      {error && (
        <p className="text-red-500 text-sm text-center max-w-md">{error}</p>
      )}
    </div>
  );
}