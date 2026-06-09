"use client";
import React from "react";
import { Button } from "./ui/button";
import { useLogoutUser } from "@/hooks/useAuth";
import { Loader2Icon, LogOutIcon } from "lucide-react";

const LogoutButton = () => {
  const { mutate: logout, isPending } = useLogoutUser();

  return (
    <Button
      className="w-full justify-start h-9 rounded-lg px-3 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
      onClick={() => logout()}
      disabled={isPending}
      variant="ghost"
    >
      {isPending ? (
        <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <LogOutIcon className="h-4 w-4 mr-2" />
      )}
      Sign out
    </Button>
  );
};

export default LogoutButton;
