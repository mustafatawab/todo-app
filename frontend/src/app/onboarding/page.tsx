"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrg } from "@/context/orgContext";
import { useCreateOrganization, useJoinOrganization } from "@/hooks/useOrganizations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2Icon, Building2Icon, UserPlusIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function OnboardingPage() {
  const router = useRouter();
  const { refreshOrgs } = useOrg();

  const [createName, setCreateName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const { mutateAsync: createOrg, isPending: createLoading } = useCreateOrganization();
  const { mutateAsync: joinOrg, isPending: joinLoading } = useJoinOrganization();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;
    await createOrg(createName.trim());
    refreshOrgs();
    router.push(`/org/${createName.trim().toLowerCase().replace(/\s+/g, "-")}`);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    const res = await joinOrg(inviteCode.trim());
    refreshOrgs();
    router.push(`/org/${res.slug}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-2xl space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-2">
            <span className="text-primary-foreground font-bold text-lg">T</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Get started</h1>
          <p className="text-sm text-muted-foreground">Create an organization or join an existing one.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Create Organization</h2>
                <p className="text-xs text-muted-foreground">You will be the admin</p>
              </div>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="orgName" className="text-sm font-medium">Organization name</Label>
                <Input
                  id="orgName"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="Acme Corp"
                  className="mt-1.5 h-10 rounded-lg border-input bg-background"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={createLoading || !createName.trim()}
                className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm"
              >
                {createLoading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "Create"}
              </Button>
            </form>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <UserPlusIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Join Organization</h2>
                <p className="text-xs text-muted-foreground">Enter an invite code</p>
              </div>
            </div>
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <Label htmlFor="inviteCode" className="text-sm font-medium">Invite code</Label>
                <Input
                  id="inviteCode"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="XXX-XXX"
                  className="mt-1.5 h-10 rounded-lg border-input bg-background font-mono"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={joinLoading || !inviteCode.trim()}
                className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm"
              >
                {joinLoading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "Join"}
              </Button>
            </form>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            You can switch organizations anytime from the dashboard.
          </p>
        </div>
      </div>
    </main>
  );
}
