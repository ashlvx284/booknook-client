"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  refreshSession: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/get-session", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        setUser(null);
        setSession(null);
        return;
      }

      const data = await res.json();
      setUser(data?.user ?? null);
      setSession(data?.session ?? null);
    } catch (error) {
      console.error("Failed to fetch session:", error);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        refreshSession: fetchSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 
