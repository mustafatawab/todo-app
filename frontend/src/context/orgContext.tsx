"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useGetOrganizations } from "@/hooks/useOrganizations";
import type { Organization, Role } from "@/types";

type OrgContextType = {
  orgs: Organization[];
  currentOrg: Organization | null;
  role: Role | null;
  loading: boolean;
  switchOrg: (slug: string) => void;
  refreshOrgs: () => void;
};

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrgProvider({ children }: { children: ReactNode }) {
  const { data: orgs = [], isLoading, refetch } = useGetOrganizations();
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!orgs.length) {
      setCurrentOrg(null);
      return;
    }
    const stored = localStorage.getItem("currentOrgSlug");
    const match = orgs.find((o) => o.slug === stored) || orgs[0];
    setCurrentOrg(match);
  }, [orgs]);

  const switchOrg = useCallback(
    (slug: string) => {
      const org = orgs.find((o) => o.slug === slug);
      if (org) {
        setCurrentOrg(org);
        localStorage.setItem("currentOrgSlug", slug);
        router.push(`/org/${slug}`);
      }
    },
    [orgs, router],
  );

  const role = currentOrg?.role ?? null;

  return (
    <OrgContext.Provider
      value={{
        orgs,
        currentOrg,
        role,
        loading: isLoading,
        switchOrg,
        refreshOrgs: refetch,
      }}
    >
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  const context = useContext(OrgContext);
  if (!context) throw new Error("useOrg must be used within an OrgProvider");
  return context;
}
