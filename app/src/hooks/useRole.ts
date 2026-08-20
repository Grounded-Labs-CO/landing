// @ts-nocheck
"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useRole() {
  const role = useQuery(api.queries.getUserRole);
  if (role === undefined) {
    return { role: null, isAdmin: false, isPending: false, isLoading: true };
  }
  if (role === null) {
    return { role: null, isAdmin: false, isPending: false, isLoading: false };
  }
  return {
    role,
    isAdmin: role.role === "admin" && role.status === "active",
    isPending: role.status === "pending",
    isLoading: false,
  };
}
