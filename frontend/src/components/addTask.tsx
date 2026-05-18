"use client";
import React, { use } from "react";
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
import { FaPlus } from "react-icons/fa";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Cross, DeleteIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { IoClose } from "react-icons/io5";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { getAllTasks } from "@/lib/getAllTasks";

const AddTask = ({ userId }: { userId: String }) => {
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
  });

  const [inputTag, setInputTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  const [loading, setLoading] = useState(false); // 🔹 track API request
  const [open, setOpen] = useState(false); // 🔹 control dialog state

  const onTagChange = (e: any) => {
    setInputTag(e.target.value);
  };

  const handleInputKeyDown = (event: any) => {
    if (event.key === "Enter" && inputTag.trim() !== "") {
      setTags([...tags, inputTag.trim()]);
      setInputTag("");
    }
  };

  const removeTag = (index: Number) => {
    setTags(tags.filter((_, i) => i != index));
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setTaskForm({
      ...taskForm,
      [name]: value,
    });
  };

  const submitTaskForm = async () => {
    const { title, description } = taskForm;
    const body = {
      title,
      description,
      userId,
    };
    try {
      setLoading(true);
      const res = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await res.json();

      const existingTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      localStorage.setItem(
        "tasks",
        JSON.stringify([result.task, ...existingTasks]),
      );

      // notify other client components so they can update immediately
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("taskAdded", { detail: result.task }),
        );
      }

      setOpen(false); // 🔹 close dialog only if success
      setTaskForm({ title: "", description: "" }); // reset form
      setTags([]);
      await getAllTasks(userId);
    } catch (error) {
      toast.error(error as string);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-end">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <Button
          onClick={() => setOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none h-10 px-6 flex items-center gap-3 transition-all duration-200 active:scale-[0.98] border border-primary/20 hover:border-primary shadow-[0_0_20px_rgba(var(--primary),0.1)]"
        >
          <div className="relative">
            <FaPlus className="w-3 h-3" />
            <div className="absolute -top-1 -left-1 w-1 h-1 bg-white/40" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">
            Initialize Task
          </span>
        </Button>
        <AlertDialogContent className="max-w-md p-0 rounded-none border border-primary/30 bg-background/95 backdrop-blur-2xl shadow-2xl">
          <div className="bg-secondary/30 px-6 py-5 border-b border-primary/20 flex justify-between items-center">
            <div>
              <AlertDialogTitle className="text-sm font-mono font-black uppercase tracking-[0.3em] text-foreground">
                Task <span className="text-primary">Initialization</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                Protocol: Capture New Entry
              </AlertDialogDescription>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-1.5 h-1.5 border border-primary/30" />
              ))}
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <Label className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-primary">
                  01_Subject
                </Label>
                <span className="text-[9px] font-mono text-muted-foreground opacity-40 italic">
                  Required_Field
                </span>
              </div>
              <Input
                className="w-full bg-secondary/20 border-border/60 focus:border-primary focus:bg-white transition-all duration-200 rounded-none px-4 h-12 font-mono text-sm"
                type="text"
                placeholder="INPUT_SUBJECT_HERE"
                name="title"
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-primary">
                02_Protocol_Details
              </Label>
              <Textarea
                name="description"
                onChange={handleChange}
                placeholder="DESCRIBE_TASK_PARAMETERS..."
                className="bg-secondary/20 border-border/60 focus:border-primary focus:bg-white transition-all duration-200 rounded-none px-4 py-4 min-h-[140px] resize-none font-mono text-xs leading-relaxed"
              />
            </div>
          </div>

          <AlertDialogFooter className="bg-secondary/10 px-8 py-6 border-t border-border/40 flex items-center gap-4">
            <AlertDialogCancel className="bg-transparent hover:bg-destructive/5 hover:text-destructive border border-border/60 hover:border-destructive/40 rounded-none h-11 px-8 text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all duration-200">
              Abort
            </AlertDialogCancel>
            <Button
              onClick={async () => {
                await submitTaskForm();
              }}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none h-11 px-10 text-[10px] font-mono font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Transmitting..." : "Execute_Task"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddTask;
