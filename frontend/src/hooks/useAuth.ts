"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { clearToken, getToken, setToken } from "@/lib/auth";
import { getMe } from "@/lib/api";
import type { UserDto } from "@/lib/types";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<UserDto | null>({
    queryKey: ["me"],
    queryFn: async () => {
      if (!getToken()) return null;
      const res = await getMe();
      return res.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  function login(token: string) {
    setToken(token);
    queryClient.invalidateQueries({ queryKey: ["me"] });
  }

  function logout() {
    clearToken();
    queryClient.setQueryData(["me"], null);
  }

  return { user: user ?? null, isLoading, login, logout, isLoggedIn: !!user };
}
