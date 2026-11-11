"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { request } from "@/lib/api/client";
import {
  successResponseSchema,
  userSchema,
} from "@/lib/api/schemas";
import type { LoginFormValues, RegisterFormValues } from "@/features/auth/schemas";
import { loginSchema, registerSchema } from "@/features/auth/schemas";
import { roleHome } from "@/config/nav";
import type { Role } from "@/config/nav";
import { qk } from "@/lib/query/keys";
import { notifyMutationError } from "@/features/query-utils";
import { useOnboardingStore } from "@/stores/onboarding-store";

function homeFor(role: Role) {
  return roleHome[role];
}

function setMockSessionCookie(userId: string | null) {
  if (
    process.env.NEXT_PUBLIC_API_MOCKING !== "enabled" ||
    typeof document === "undefined"
  ) {
    return;
  }
  // In-browser MSW cannot set HttpOnly cookies; the real API must own production sessions.
  document.cookie = userId
    ? `kss_session=${userId}; path=/; SameSite=Lax`
    : "kss_session=; path=/; max-age=0; SameSite=Lax";
}

export function useMe(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: qk.me,
    queryFn: ({ signal }) =>
      request("/auth/me", { schema: userSchema, signal }),
    enabled: options?.enabled,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const resetOnboarding = useOnboardingStore((state) => state.reset);
  return useMutation({
    mutationFn: (input: LoginFormValues) => {
      const body = loginSchema.parse(input);
      return request("/auth/login", {
        method: "POST",
        body,
        schema: userSchema,
      });
    },
    onSuccess: (user) => {
      resetOnboarding();
      setMockSessionCookie(user.id);
      queryClient.setQueryData(qk.me, user);
      const next = new URLSearchParams(window.location.search).get("next");
      const safeNext =
        next?.startsWith("/") &&
        !next.startsWith("//") &&
        (next === roleHome[user.role] || next.startsWith(`${roleHome[user.role]}/`))
          ? next
          : homeFor(user.role);
      router.replace(safeNext);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const resetOnboarding = useOnboardingStore((state) => state.reset);
  return useMutation({
    mutationFn: (input: RegisterFormValues) => {
      const body = registerSchema.parse(input);
      return request("/auth/register", {
        method: "POST",
        body,
        schema: userSchema,
      });
    },
    onSuccess: (user) => {
      resetOnboarding();
      setMockSessionCookie(user.id);
      queryClient.setQueryData(qk.me, user);
      router.replace("/onboarding");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const resetOnboarding = useOnboardingStore((state) => state.reset);
  return useMutation({
    mutationFn: () =>
      request("/auth/logout", {
        method: "POST",
        schema: successResponseSchema,
      }),
      onSuccess: () => {
        resetOnboarding();
        setMockSessionCookie(null);
        queryClient.clear();
      if (typeof window !== "undefined") {
        router.replace("/login");
      }
    },
    onError: notifyMutationError,
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      role,
      data,
    }: {
      role: Role;
      data: Record<string, unknown>;
    }) =>
      request("/auth/profile", {
        method: "PATCH",
        body: { role, data },
        schema: successResponseSchema,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.me });
    },
    onError: notifyMutationError,
  });
}
