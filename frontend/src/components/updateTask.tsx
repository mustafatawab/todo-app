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
} from "@/components/ui/alert-dialog";
import { FaEdit } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useUpdateTask } from "@/hooks/useTasks";
import { DatePicker } from "./DatePicker";
import type { Priority, TaskType } from "@/types/Task";

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "LOW", label: "Priority_Low" },
  { value: "MEDIUM", label: "Priority_Medium" },
  { value: "HIGH", label: "Priority_High" },
  { value: "URGENT", label: "Priority_Urgent" },
];

const UpdateTask = ({ data }: { data: TaskType }) => {
  const { mutate: updateTask, isPending } = useUpdateTask();

  const [taskForm, setTaskForm] = useState({
    title: data.title,
    description: data.description,
    priority: data.priority,
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
  });

  const [open, setOpen] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitTaskForm = () => {
    const { title, description, priority, dueDate } = taskForm;

    updateTask(
      {
        id: data.id,
        title,
        description,
        priority,
        dueDate: dueDate ? dueDate.toISOString() : null,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
        onError: () => {
          toast.error("Failed to update task. Please try again.");
        },
      },
    );
  };

  return (
    <div className="flex justify-end">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          className="p-2 text-muted-foreground/40 hover:text-primary hover:bg-primary/5 rounded-none transition-all duration-200 cursor-pointer border border-transparent hover:border-primary/20"
        >
          <FaEdit className="w-3.5 h-3.5" />
        </Button>
        <AlertDialogContent className="max-w-md p-0 rounded-none border border-primary/30 bg-background/95 backdrop-blur-2xl shadow-2xl">
          <div className="bg-secondary/30 px-6 py-5 border-b border-primary/20 flex justify-between items-center">
            <div>
              <AlertDialogTitle className="text-sm font-mono font-black uppercase tracking-[0.3em] text-foreground">
                Task <span className="text-primary">Modification</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mt-1">
                Protocol: Update Existing Entry
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
                  01_Subject_Override
                </Label>
                <span className="text-[10px] font-mono text-muted-foreground italic">
                  ID_Verified
                </span>
              </div>
              <Input
                className="w-full bg-secondary/20 border-border/60 focus:border-primary focus:bg-white transition-all duration-200 rounded-none px-4 h-12 font-mono text-sm"
                type="text"
                value={taskForm.title as string}
                placeholder="INPUT_SUBJECT_HERE"
                name="title"
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-mono font-black uppercase tracking-[0.2em] text-primary">
                02_Priority_Level
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setTaskForm((prev) => ({ ...prev, priority: p.value }))}
                    className={`h-10 font-mono text-[10px] font-bold uppercase tracking-wider border transition-all duration-200 ${
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
                03_Deadline_Override
              </Label>
              <DatePicker
                date={taskForm.dueDate}
                onSelect={(date) => setTaskForm((prev) => ({ ...prev, dueDate: date }))}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[11px] font-mono font-black uppercase tracking-[0.2em] text-primary">
                04_Protocol_Details
              </Label>
              <Textarea
                name="description"
                value={taskForm.description as string}
                onChange={handleChange}
                placeholder="DESCRIBE_TASK_PARAMETERS..."
                className="bg-secondary/20 border-border/60 focus:border-primary focus:bg-white transition-all duration-200 rounded-none px-4 py-4 min-h-[140px] resize-none font-mono text-xs leading-relaxed"
              />
            </div>
          </div>

          <AlertDialogFooter className="bg-secondary/10 px-8 py-6 border-t border-border/40 flex items-center gap-4">
            <AlertDialogCancel className="bg-transparent hover:bg-destructive/5 hover:text-destructive border border-border/60 hover:border-destructive/40 rounded-none h-11 px-8 text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all duration-200">
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={submitTaskForm}
              disabled={isPending || !taskForm.title.toString().trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none h-11 px-10 text-[10px] font-mono font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? (
                <Loader2Icon className="animate-spin mr-2" />
              ) : null}
              Update_Task
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UpdateTask;
