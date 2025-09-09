"use client";

import { useState } from "react";
import { useAuth } from "../context/GoogleAuthContext"; 
import { Button } from "../components/ui/button"
import { useRouter } from "next/navigation";


export default function GoogleSignInButton() {
  const { isAuthenticated, loading, login, logout, user } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const router = useRouter();

  const handleLogin = () => {
    setIsLoggingIn(true);
    login();
    // Note: Code after login() won't execute due to redirect, do not put anything here
  };

  const handlePreviousLogin = () => {
    console.log("routing to dashboard")
    router.push("/dashboard")
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // loading state
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600">Checking authentication...</span>
      </div>
    );
  }

  // user info and logout if authenticated
  if (isAuthenticated && user) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg border-1 border-zinc-100 z-20">
        <button onClick={handlePreviousLogin} className="flex items-center gap-3 cursor-pointer">
          <img 
            src={user.picture} 
            alt={user.name}
            className="w-10 h-10 rounded-full border-2 border-gray-200"
          />
          <div className="text-sm">
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-gray-500">{user.email}</div>
          </div>
        </button>
        <button 
          onClick={handleLogout}
          className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // Show login button if not authenticated
  return (
    <div className="flex flex-col items-right gap-2">
      <Button 
        onClick={handleLogin} 
        disabled={isLoggingIn}
        className=""
      >
        {isLoggingIn ? (
          <>
            <div className="w-4 h-4 border-2 border-white transition-transform ease-in-out hover:scale-110 border-t-transparent rounded-full animate-spin"></div>
            Redirecting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </>
        )}
      </Button>
    </div>
  );
}