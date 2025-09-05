"use client";

import dynamic from "next/dynamic";

const GoogleSignInButton = dynamic(
  () => import("./GoogleSignInButton"),
  { ssr: false }
);

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <GoogleSignInButton />
    </div>
  );
}
