"use client";
import React from "react";
import { Button } from "./ui/button";
import { signOut } from "@/action/auth-action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";
const LogoutButton = () => {
  const router = useRouter();
  const logout = async () => {
    const res = await signOut();
    toast.success("Logged out Successfully");
    router.push("/login");
  };
  return (
    <Button
      className="w-full justify-start h-10 px-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-200 group"
      onClick={logout}
      variant="ghost"
    >
      <LogOutIcon className="w-4 h-4 mr-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
      <span className="font-medium text-sm">Sign Out</span>
    </Button>
  );
};

export default LogoutButton;
