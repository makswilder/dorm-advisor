"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, logoutApi } from "@/lib/api";
import type { UserDto } from "@/lib/types";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<UserDto | null>({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const res = await getMe();
        return res.data;
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  async function logout() {
    await logoutApi().catch(() => {}); // expire the HttpOnly cookie server-side
    queryClient.setQueryData(["me"], null);
  }

  return { user: user ?? null, isLoading, logout, isLoggedIn: !!user };
}
