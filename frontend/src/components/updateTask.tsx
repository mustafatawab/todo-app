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
import { FaEdit } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useUpdateTask } from "@/hooks/useTasks";
import { useGetMembers } from "@/hooks/useMembers";
import { DatePicker } from "./DatePicker";
import { useOrg } from "@/context/orgContext";
import type { Priority, TaskType, TaskStatus } from "@/types";

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

const UpdateTask = ({ data }: { data: TaskType }) => {
  const { mutate: updateTask, isPending } = useUpdateTask();
  const { currentOrg } = useOrg();
  const { data: members = [] } = useGetMembers();

  const [taskForm, setTaskForm] = useState({
    title: data.title,
    description: data.description,
    priority: data.priority,
    status: data.status,
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    assigneeId: data.assignee?.id || "",
  });

  const [open, setOpen] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitTaskForm = () => {
    const { title, description, priority, status, dueDate, assigneeId } = taskForm;
    updateTask(
      {
        id: data.id,
        title,
        description,
        priority,
        status,
        dueDate: dueDate ? dueDate.toISOString() : null,
        assigneeId: assigneeId || null,
      },
      {
        onSuccess: () => setOpen(false),
        onError: () => toast.error("Failed to update task."),
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground/40 hover:text-primary hover:bg-primary/5">
          <FaEdit className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md rounded-xl border bg-card p-0 shadow-xl">
        <div className="px-6 pt-6 pb-4 border-b">
          <AlertDialogTitle className="text-base font-semibold">Edit Task</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground mt-1">
            Update the task details.
          </AlertDialogDescription>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/80">Title</Label>
            <Input
              className="h-10 rounded-lg border-input bg-background px-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              type="text"
              value={taskForm.title}
              name="title"
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">Priority</Label>
              <div className="flex gap-1.5">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setTaskForm((prev) => ({ ...prev, priority: p.value }))}
                    className={`flex-1 h-9 rounded-lg text-xs font-medium transition-all duration-200 ${
                      taskForm.priority === p.value
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">Status</Label>
              <div className="flex gap-1.5">
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setTaskForm((prev) => ({ ...prev, status: s.value }))}
                    className={`flex-1 h-9 rounded-lg text-xs font-medium transition-all duration-200 ${
                      taskForm.status === s.value
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">Due date</Label>
              <DatePicker
                date={taskForm.dueDate}
                onSelect={(date) => setTaskForm((prev) => ({ ...prev, dueDate: date }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">Assignee</Label>
              <select
                value={taskForm.assigneeId}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, assigneeId: e.target.value }))}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.userId}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/80">Description</Label>
            <Textarea
              name="description"
              value={taskForm.description}
              onChange={handleChange}
              placeholder="Add details..."
              className="min-h-[100px] rounded-lg border-input bg-background px-3 py-2.5 text-sm resize-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <AlertDialogCancel className="h-9 rounded-lg border border-input bg-background px-4 text-xs font-medium hover:bg-secondary transition-all">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={submitTaskForm}
            disabled={isPending || !taskForm.title.trim()}
            className="h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground px-5 text-xs font-medium shadow-sm transition-all disabled:opacity-50"
          >
            {isPending ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateTask;
