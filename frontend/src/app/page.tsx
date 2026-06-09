'use client'
import LogoutButton from "@/components/LogoutButton";
import TaskList from "@/components/TaskList";
import AddTask from "@/components/addTask";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { Loader2Icon } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-sm text-muted-foreground">You are not signed in.</p>
        <Link
          href="/login"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Tasks</h1>
              <p className="text-xs text-muted-foreground">
                {user.name} &middot; {user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AddTask userId={user!.id} />
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-9 w-9 rounded-lg border border-transparent transition-all hover:border-primary/30">
                  <AvatarFallback className="bg-secondary text-foreground text-xs font-medium rounded-lg">
                    {user!.name[0]}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-xl border bg-card p-2 shadow-lg"
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-medium truncate">{user!.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user!.email}</p>
                </div>
                <div className="mt-1 border-t" />
                <div className="pt-1">
                  <LogoutButton />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main>
          <TaskList />
        </main>
      </div>
    </div>
  );
}
