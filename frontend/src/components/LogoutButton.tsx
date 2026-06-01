"use client";
import React from "react";
import { Button } from "./ui/button";
import { useLogoutUser } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2Icon, LogOutIcon } from "lucide-react";
const LogoutButton = () => {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogoutUser();

  return (
    <Button
      className="w-full justify-start h-10 px-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-200 group"
      onClick={() => logout()}
      disabled={isPending}
      variant="ghost"
    >
      {isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <>
          <LogOutIcon className="w-4 h-4 mr-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
          <span className="font-medium text-sm">Sign Out</span>
        </>
      )}
    </Button>
  );
};

export default LogoutButton;
