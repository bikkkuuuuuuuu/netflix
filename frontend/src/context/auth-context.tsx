import { get } from "@/config/axios.config";
import { UserType } from "@/services/auth.service";
import React, { createContext, useEffect, useState } from "react";
interface AuthContextType {
  loggedInUser: UserType | null;
  setLoggedInUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  isLoading: boolean;
  getLoggedInUser: () => Promise<void>;
}
export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export const AuthProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [loggedInUser, setLoggedInUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getLoggedInUser = async () => {
    try {
      const token = localStorage.getItem("token") || null;
      if (token) {
        const response = (await get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })) as any;
        setLoggedInUser(response.data.detail);
      }
    } catch (exception) {
      console.error("Error fetching user:", exception);
      localStorage.removeItem("token");
      setLoggedInUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLoggedInUser();
  }, []);

  return (
    <>
      <AuthContext.Provider
        value={{
          loggedInUser,
          setLoggedInUser,
          isLoading,
          getLoggedInUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
