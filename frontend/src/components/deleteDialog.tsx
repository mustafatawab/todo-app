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
import {useDeleteTask} from "@/hooks/useTasks";
import { useState } from "react";
import toast from "react-hot-toast";
import { Trash2Icon } from "lucide-react";

export function DeleteDialog({
  children,
  id,
}: {
  children: React.ReactNode;
  id: String;
}) {
  const [open, setOpen] = useState(false);
  const { mutate: deleteTask, isPending } = useDeleteTask();

  const handleDelete = async () => {
    deleteTask({ id: id as string }, {
      onSuccess: () => {
        toast.success("Task deleted.");
        setOpen(false);
      },
      onError: () => {
        toast.error("Failed to delete task.");
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-sm rounded-xl border bg-card p-0 shadow-xl">
        <div className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <Trash2Icon className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle className="text-base font-semibold">Delete task</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground mt-0.5">
                This action cannot be undone.
              </AlertDialogDescription>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex justify-end gap-3">
          <AlertDialogCancel className="h-9 rounded-lg border border-input bg-background px-4 text-xs font-medium hover:bg-secondary transition-all">
            Cancel
          </AlertDialogCancel>
          <Button
            disabled={isPending}
            onClick={handleDelete}
            className="h-9 rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground px-4 text-xs font-medium shadow-sm transition-all disabled:opacity-50"
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
