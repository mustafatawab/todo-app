"use client";
import { useOrg } from "@/context/orgContext";
import type { Role } from "@/types";

export function RoleGate({ role, children }: { role: Role; children: React.ReactNode }) {
  const { role: currentRole } = useOrg();
  if (currentRole !== role) return null;
  return <>{children}</>;
}
