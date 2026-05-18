"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getAllTasks } from "@/lib/getAllTasks";
import { useState } from "react";
import toast from "react-hot-toast";

export function DeleteDialog({
  children,
  id,
  userId,
}: {
  children: React.ReactNode;
  id: String;
  userId: String;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/task", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      toast.success("Deleted Successfully !!!");
      setOpen(false);
      await getAllTasks(userId);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md p-0 rounded-none border border-destructive/30 bg-background/95 backdrop-blur-2xl shadow-2xl">
        <div className="bg-destructive/5 px-6 py-5 border-b border-destructive/20 flex justify-between items-center">
          <div>
            <AlertDialogTitle className="text-sm font-mono font-black uppercase tracking-[0.3em] text-destructive">
              System <span className="text-destructive/80">Purge</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
              Protocol: Irreversible Deletion
            </AlertDialogDescription>
          </div>
          <div className="w-4 h-4 border border-destructive/40 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-destructive animate-pulse" />
          </div>
        </div>

        <div className="p-8">
          <p className="text-xs font-mono text-foreground/70 leading-relaxed uppercase tracking-tight">
            Warning: You are about to terminate this task protocol. All
            associated data fragments will be purged from the orbital servers.
            This action cannot be rescinded.
          </p>
        </div>

        <AlertDialogFooter className="bg-secondary/10 px-8 py-6 border-t border-border/40 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="bg-transparent hover:bg-secondary/50 border border-border/60 rounded-none h-11 px-8 text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all duration-200"
          >
            Abort_Purge
          </Button>
          <Button
            disabled={loading}
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-none h-11 px-10 text-[10px] font-mono font-bold uppercase tracking-[0.2em] shadow-lg shadow-destructive/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Purging..." : "Confirm_Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
