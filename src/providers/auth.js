"use client";
import { checkLoggedIn } from "@/lib/auth";
import React, { useState, useEffect } from "react";
import { AuthContext } from "@/context/auth";
import { logout } from "@/lib/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  useEffect(() => {
    setMounted(true);
    const fetchUser = async () => {
      const user = await checkLoggedIn();
      if (user?.error) {
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, handleLogout, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
