"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useOrg } from "@/context/orgContext";
import { api } from "@/lib/api";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2Icon, ArrowLeftIcon, UserPlusIcon, ShieldIcon, Trash2Icon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import type { Member, Role } from "@/types";

export default function MembersPage() {
  const { currentOrg, role } = useOrg();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", username: "", email: "", password: "" });
  const [inviteLoading, setInviteLoading] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!currentOrg) return;
    try {
      const res = await api.get(`/api/org/${currentOrg.slug}/members`);
      setMembers(res.data);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [currentOrg]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  if (!currentOrg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">No organization selected.</p>
      </div>
    );
  }

  if (role !== "ADMIN") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-sm text-muted-foreground">You don&apos;t have access to this page.</p>
        <Link href={`/org/${currentOrg.slug}`} className="text-sm text-primary hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  const handleAddMember = async () => {
    if (!inviteForm.name.trim() || !inviteForm.email.trim() || !inviteForm.password.trim()) return;
    setInviteLoading(true);
    try {
      await api.post(`/api/org/${currentOrg.slug}/members`, inviteForm);
      toast.success("Member added successfully!");
      setInviteOpen(false);
      setInviteForm({ name: "", username: "", email: "", password: "" });
      fetchMembers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add member");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await api.delete(`/api/org/${currentOrg.slug}/members/${userId}`);
      toast.success("Member removed");
      fetchMembers();
    } catch {
      toast.error("Failed to remove member");
    }
  };

  const handleChangeRole = async (userId: string, newRole: Role) => {
    try {
      await api.patch(`/api/org/${currentOrg.slug}/members/${userId}/role`, { role: newRole });
      toast.success(`Member ${newRole === "ADMIN" ? "promoted to admin" : "demoted to member"}`);
      fetchMembers();
    } catch {
      toast.error("Failed to update role");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8">
          <Link
            href={`/org/${currentOrg.slug}`}
            className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
            Back to tasks
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Members</h1>
              <p className="text-sm text-muted-foreground">{currentOrg.name}</p>
            </div>
            <AlertDialog open={inviteOpen} onOpenChange={setInviteOpen}>
              <AlertDialogTrigger asChild>
                <Button className="h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground px-4 text-xs font-medium shadow-sm">
                  <UserPlusIcon className="h-3.5 w-3.5 mr-1.5" />
                  Add Member
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-md rounded-xl border bg-card p-0 shadow-xl">
                <div className="px-6 pt-6 pb-4 border-b">
                  <AlertDialogTitle className="text-base font-semibold">Add Team Member</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-muted-foreground mt-1">
                    They will receive login credentials via email.
                  </AlertDialogDescription>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Name</Label>
                    <Input
                      value={inviteForm.name}
                      onChange={(e) => setInviteForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="John Doe"
                      className="h-10 rounded-lg border-input bg-background text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Username</Label>
                    <Input
                      value={inviteForm.username}
                      onChange={(e) => setInviteForm((p) => ({ ...p, username: e.target.value }))}
                      placeholder="john_doe"
                      className="h-10 rounded-lg border-input bg-background text-sm font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Email</Label>
                    <Input
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="john@example.com"
                      type="email"
                      className="h-10 rounded-lg border-input bg-background text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Password</Label>
                    <Input
                      value={inviteForm.password}
                      onChange={(e) => setInviteForm((p) => ({ ...p, password: e.target.value }))}
                      placeholder="Temporary password"
                      type="password"
                      className="h-10 rounded-lg border-input bg-background text-sm"
                    />
                  </div>
                </div>
                <div className="px-6 py-4 border-t flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setInviteOpen(false)}
                    className="h-9 rounded-lg border-input bg-background px-4 text-xs font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddMember}
                    disabled={inviteLoading || !inviteForm.name.trim() || !inviteForm.email.trim() || !inviteForm.password.trim()}
                    className="h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground px-4 text-xs font-medium shadow-sm"
                  >
                    {inviteLoading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "Add Member"}
                  </Button>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <UserPlusIcon className="h-5 w-5 text-muted-foreground/60" />
            </div>
            <h3 className="text-sm font-medium">No members yet</h3>
            <p className="mt-1 text-xs text-muted-foreground">Add your first team member to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-xl border bg-card p-4 transition-all hover:border-primary/20"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 rounded-lg">
                    <AvatarFallback className="bg-secondary text-foreground text-xs font-medium rounded-lg">
                      {member.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{member.name}</p>
                      <span
                        className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                          member.role === "ADMIN"
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {member.role === "ADMIN" ? "Admin" : "Member"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {member.role === "MEMBER" ? (
                    <button
                      onClick={() => handleChangeRole(member.userId, "ADMIN")}
                      className="h-8 w-8 rounded-lg text-muted-foreground/40 hover:text-primary hover:bg-primary/5 transition-all"
                      title="Promote to admin"
                    >
                      <ShieldCheckIcon className="h-3.5 w-3.5 mx-auto" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleChangeRole(member.userId, "MEMBER")}
                      className="h-8 w-8 rounded-lg text-muted-foreground/40 hover:text-amber-500 hover:bg-amber-50 transition-all"
                      title="Demote to member"
                    >
                      <ShieldIcon className="h-3.5 w-3.5 mx-auto" />
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveMember(member.userId)}
                    className="h-8 w-8 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-all"
                    title="Remove member"
                  >
                    <Trash2Icon className="h-3.5 w-3.5 mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
