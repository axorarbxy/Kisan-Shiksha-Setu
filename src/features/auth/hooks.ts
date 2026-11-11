"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { request } from "@/lib/api/client";
import {
  loginInputSchema,
  registerInputSchema,
  successResponseSchema,
  userSchema,
} from "@/lib/api/schemas";
import type { LoginInput, RegisterInput } from "@/lib/api/schemas";
import { qk } from "@/lib/query/keys";
import { notifyMutationError } from "@/features/query-utils";

export function useMe() {
  return useQuery({
    queryKey: qk.me,
    queryFn: ({ signal }) =>
      request("/auth/me", { schema: userSchema, signal }),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => {
      const body = loginInputSchema.parse(input);
      return request("/auth/login", {
        method: "POST",
        body,
        schema: userSchema,
      });
    },
    onSuccess: (user) => {
      queryClient.setQueryData(qk.me, user);
    },
    onError: notifyMutationError,
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterInput) => {
      const body = registerInputSchema.parse(input);
      return request("/auth/register", {
        method: "POST",
        body,
        schema: userSchema,
      });
    },
    onSuccess: (user) => {
      queryClient.setQueryData(qk.me, user);
    },
    onError: notifyMutationError,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () =>
      request("/auth/logout", {
        method: "POST",
        schema: successResponseSchema,
      }),
    onSuccess: () => {
      queryClient.clear();
      if (typeof window !== "undefined") {
        router.replace("/login");
      }
    },
    onError: notifyMutationError,
  });
}
