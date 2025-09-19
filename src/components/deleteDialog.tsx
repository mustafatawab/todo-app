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
  userId
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
      toast.success("Deleted Successfully !!!")
      setOpen(false);
      await getAllTasks(userId)
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong")
    } finally {
      setLoading(false);
      window.location.reload()

    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your task
            and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant={"outline"} color="red" onClick={handleCancel}>
            Cancel
          </Button>
          <Button disabled={loading} onClick={handleDelete}>
            {loading ? "Deleting" : "Delete"}{" "}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
