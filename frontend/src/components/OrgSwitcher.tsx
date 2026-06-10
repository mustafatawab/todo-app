"use client";
import { useOrg } from "@/context/orgContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";

export function OrgSwitcher() {
  const { orgs, currentOrg, switchOrg } = useOrg();

  if (!currentOrg) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium focus:outline-none group">
        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">{currentOrg.name[0]}</span>
        </div>
        <span className="group-hover:text-primary transition-colors">{currentOrg.name}</span>
        <ChevronDownIcon className="h-3.5 w-3.5 text-muted-foreground/60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 rounded-xl border bg-card p-1.5 shadow-lg">
        {orgs.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => switchOrg(org.slug)}
            className={`rounded-lg text-sm cursor-pointer ${
              org.slug === currentOrg.slug ? "bg-primary/10 text-primary font-medium" : ""
            }`}
          >
            <div className="h-6 w-6 rounded-md bg-secondary flex items-center justify-center mr-2">
              <span className="text-[10px] font-bold">{org.name[0]}</span>
            </div>
            {org.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="rounded-lg text-sm cursor-pointer">
          <Link href="/onboarding">Create new org</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
