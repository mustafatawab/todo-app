"use client";
import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useGetCurrentUser } from "@/hooks/useAuth";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { data: currentUser, isPending } = useGetCurrentUser();

  useEffect(() => {
    const handleExpireSession = () => {
      toast.error("Session expired. Please login again.");
      router.push("/login");
    };

    window.addEventListener("auth:session-expired", handleExpireSession);

    return () => {
      window.removeEventListener("auth:session-expired", handleExpireSession);
    };
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser ?? null,
        loading: isPending,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
