"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrg } from "@/context/orgContext";
import {
  useCreateOrganization,
  useJoinOrganization,
} from "@/hooks/useOrganizations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2Icon, Building2Icon, UserPlusIcon, CopyIcon, CheckIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function OnboardingPage() {
  const router = useRouter();
  const { refreshOrgs } = useOrg();

  const [createName, setCreateName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [createdOrgSlug, setCreatedOrgSlug] = useState("");
  const [createdOrgCode, setCreatedOrgCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);

  const { mutateAsync: createOrg, isPending: createLoading } =
    useCreateOrganization();
  const { mutateAsync: joinOrg, isPending: joinLoading } =
    useJoinOrganization();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;
    const org = await createOrg(createName);
    const slug = createName.trim().toLowerCase().replace(/\s+/g, "-");

    setCreatedOrgSlug(slug);
    setCreatedOrgCode(org.inviteCode);
    setShowCodeDialog(true);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    const res = await joinOrg(inviteCode.trim());
    refreshOrgs();
    router.push(`/org/${res.slug}`);
  };

  const handleCopyNewCode = async () => {
    await navigator.clipboard.writeText(createdOrgCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleGoToDashboard = () => {
    setShowCodeDialog(false);
    refreshOrgs();
    router.push(`/org/${createdOrgSlug}`);
  };

  return (
    <>
      <AlertDialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <AlertDialogContent className="sm:max-w-md rounded-xl border bg-card p-0 shadow-xl">
          <div className="px-6 pt-6 pb-4 border-b">
            <AlertDialogTitle className="text-base font-semibold">Organization Created</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-1">
              Share this invite code with people you want to add to your organization.
            </AlertDialogDescription>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
              <code className="text-sm font-mono text-foreground select-all">{createdOrgCode}</code>
              <button
                onClick={handleCopyNewCode}
                className="h-8 w-8 rounded-lg text-muted-foreground/40 hover:text-foreground hover:bg-background transition-all"
                title="Copy invite code"
              >
                {codeCopied ? <CheckIcon className="h-4 w-4 mx-auto text-green-500" /> : <CopyIcon className="h-4 w-4 mx-auto" />}
              </button>
            </div>
          </div>
          <div className="px-6 py-4 border-t flex justify-end">
            <Button
              onClick={handleGoToDashboard}
              className="h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground px-4 text-xs font-medium shadow-sm"
            >
              Go to dashboard
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-2xl space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-2">
            <span className="text-primary-foreground font-bold text-lg">T</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Get started</h1>
          <p className="text-sm text-muted-foreground">
            Create an organization or join an existing one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Create Organization</h2>
                <p className="text-xs text-muted-foreground">
                  You will be the admin
                </p>
              </div>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="orgName" className="text-sm font-medium">
                  Organization name
                </Label>
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
                {createLoading ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  "Create"
                )}
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
                <p className="text-xs text-muted-foreground">
                  Enter an invite code
                </p>
              </div>
            </div>
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <Label htmlFor="inviteCode" className="text-sm font-medium">
                  Invite code
                </Label>
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
                {joinLoading ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  "Join"
                )}
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
    </>
  );
}
