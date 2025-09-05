"use client";
import { useGoogleAuth } from "@/context/GoogleAuthContext";
import { gapi } from "gapi-script";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleSignInButton() {
  const router = useRouter();
  const { setAccessToken } = useGoogleAuth();

  useEffect(() => {
      gapi.load("auth2", () => {
          gapi.auth2.init({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          scope: "https://www.googleapis.com/auth/calendar.events",
          });
      });
  }, []);

  const handleLogin = () => {
    gapi.auth2.getAuthInstance().signIn().then((user: any) => {
      const token = user.getAuthResponse().access_token;
      setAccessToken(token);
      router.push("/dashboard");
    });
  };

  return <button onClick={handleLogin}>Sign in with Google</button>;
}
