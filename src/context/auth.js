"use client";
import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  loading: true,
});
