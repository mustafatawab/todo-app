"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { useOrg } from "@/context/orgContext";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { orgs, loading: orgLoading } = useOrg();
  const router = useRouter();

  useEffect(() => {
    if (authLoading || orgLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (orgs.length === 0) {
      router.push("/onboarding");
      return;
    }
    router.push(`/org/${orgs[0].slug}`);
  }, [user, authLoading, orgs, orgLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  );
}
