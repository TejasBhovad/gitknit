"use client";
import React, { useContext } from "react";
import { AuthContext } from "@/context/auth";

const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
  </div>
);

const Page = () => {
  const { user, loading, handleLogout } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Account</h1>
      <div className="p-6">
        {user ? (
          <div className="space-y-4">
            <p>Welcome, {user.name}</p>
            <p className="font-medium text-green-600">✓ You are logged in</p>
            <button
              onClick={handleLogout}
              className="rounded bg-red-500 px-4 py-2 text-white"
            >
              Logout
            </button>
          </div>
        ) : (
          <p>User not logged in</p>
        )}
      </div>
    </div>
  );
};

export default Page;
