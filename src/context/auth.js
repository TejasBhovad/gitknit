// context/auth.ts
import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
  handleLogout: async () => {},
  error: null,
});
