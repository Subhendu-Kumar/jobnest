import {
  getUser,
  setUser,
  getToken,
  saveRole,
  saveToken,
  clearUserData,
  getRole,
} from "@/lib/utils";
import { AuthContextProps, User, UserRole } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUserState] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = await getToken();
      const userInfo = await getUser();
      const role = await getRole();
      setIsAuthenticated(!!token && !!userInfo);
      setUserState(userInfo);
      setRole(role);
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (token: string, userData: User, role: UserRole) => {
    await saveToken(token);
    await setUser(userData);
    await saveRole(role);
    setIsAuthenticated(true);
    setUserState(userData);
  };

  const logout = async () => {
    await clearUserData();
    setIsAuthenticated(false);
    setUserState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        login,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
