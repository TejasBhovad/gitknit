"use client";
import { checkLoggedIn } from "@/lib/auth";
import React, { useState, useEffect } from "react";
import { AuthContext } from "@/context/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { user, error } = await checkLoggedIn();
      if (error) {
        console.error(error);
      }
      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
