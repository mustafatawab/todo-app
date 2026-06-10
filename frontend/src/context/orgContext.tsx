"use client";
import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Organization, Role } from "@/types";

type OrgContextType = {
  orgs: Organization[];
  currentOrg: Organization | null;
  role: Role | null;
  loading: boolean;
  switchOrg: (slug: string) => void;
  refreshOrgs: () => Promise<void>;
};

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrgProvider({ children }: { children: ReactNode }) {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrgs = useCallback(async () => {
    try {
      const res = await api.get("/api/org");
      const data: Organization[] = res.data;
      setOrgs(data);

      const stored = localStorage.getItem("currentOrgSlug");
      const match = data.find((o) => o.slug === stored) || data[0] || null;
      setCurrentOrg(match);
    } catch {
      setOrgs([]);
      setCurrentOrg(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrgs();
  }, [fetchOrgs]);

  const switchOrg = useCallback((slug: string) => {
    const org = orgs.find((o) => o.slug === slug);
    if (org) {
      setCurrentOrg(org);
      localStorage.setItem("currentOrgSlug", slug);
      router.push(`/org/${slug}`);
    }
  }, [orgs, router]);

  const role = currentOrg?.role ?? null;

  return (
    <OrgContext.Provider value={{ orgs, currentOrg, role, loading, switchOrg, refreshOrgs: fetchOrgs }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  const context = useContext(OrgContext);
  if (!context) throw new Error("useOrg must be used within an OrgProvider");
  return context;
}
