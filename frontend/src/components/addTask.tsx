"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useCreateTask } from "@/hooks/useTasks";
import { DatePicker } from "./DatePicker";
import type { Priority } from "@/types/Task";

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

const AddTask = ({ userId }: { userId: String }) => {
  const { mutate: createTask, isPending } = useCreateTask();
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as Priority,
    dueDate: undefined as Date | undefined,
  });

  const [open, setOpen] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitTaskForm = () => {
    createTask(
      {
        title: taskForm.title,
        description: taskForm.description,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate ? taskForm.dueDate.toISOString() : null,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setTaskForm({ title: "", description: "", priority: "MEDIUM", dueDate: undefined });
          toast.success("Task created successfully.");
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || error?.message || "Failed to create task");
        },
      },
    );
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
            Create Task
          </span>
        </Button>
        <AlertDialogContent className="max-w-md p-0 rounded-none border border-primary/30 bg-background/95 backdrop-blur-2xl shadow-2xl">
          <div className="bg-secondary/30 px-6 py-5 border-b border-primary/20 flex justify-between items-center">
            <div>
              <AlertDialogTitle className="text-sm font-mono font-black uppercase tracking-[0.3em] text-foreground">
                Task <span className="text-primary">Initialization</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mt-1">
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
                <Label className="text-[11px] font-mono font-black uppercase tracking-[0.2em] text-primary">
                  Name of Task
                </Label>
                <span className="text-[10px] font-mono text-muted-foreground italic">
                  *
                </span>
              </div>
              <Input
                className="w-full bg-secondary/20 border-border/60 focus:border-primary focus:bg-white transition-all duration-200 rounded-none px-4 h-12 font-mono text-sm"
                type="text"
                placeholder="Enter task title..."
                name="title"
                value={taskForm.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-mono font-black uppercase tracking-[0.2em] text-primary">
                Priority Level
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setTaskForm((prev) => ({ ...prev, priority: p.value }))}
                    className={`h-10 font-mono text-[10px] font-bold capitalize tracking-wider border transition-all duration-200 ${
                      taskForm.priority === p.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 bg-secondary/20 text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-mono font-black uppercase tracking-[0.2em] text-primary">
                Deadline
              </Label>
              <DatePicker
                date={taskForm.dueDate}
                onSelect={(date) => setTaskForm((prev) => ({ ...prev, dueDate: date }))}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-mono font-black uppercase tracking-[0.2em] text-primary">
                Task Details
              </Label>
              <Textarea
                name="description"
                value={taskForm.description}
                onChange={handleChange}
                placeholder="Describe the task in detail..."
                className="bg-secondary/20 border-border/60 focus:border-primary focus:bg-white transition-all duration-200 rounded-none px-4 py-4 min-h-[140px] resize-none font-mono text-xs leading-relaxed"
              />
            </div>
          </div>

          <AlertDialogFooter className="bg-secondary/10 px-8 py-6 border-t border-border/40 flex items-center gap-4">
            <AlertDialogCancel className="bg-transparent hover:bg-destructive/5 hover:text-destructive border border-border/60 hover:border-destructive/40 rounded-none h-11 px-8 text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all duration-200">
              Abort
            </AlertDialogCancel>
            <Button
              onClick={submitTaskForm}
              disabled={isPending || !taskForm.title.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none h-11 px-10 text-[10px] font-mono font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? "Transmitting..." : "Execute Task"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddTask;
