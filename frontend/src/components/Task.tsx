"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { TaskType } from "@/types/Task";
import { Button } from "./ui/button";
import { DeleteDialog } from "./deleteDialog";
import UpdateTask from "./updateTask";
import { useCompleteTask } from "@/hooks/useTasks";
import toast from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";

const Task = ({ data }: { data: TaskType }) => {
  
  const queryClient = useQueryClient();
  const { mutate: completeTask } = useCompleteTask();
  const [isCompleted, setIsCompleted] = useState(data.completed ?? false);

  const formattedDate = new Date(
    typeof data.createdAt === "string" || typeof data.createdAt === "number"
      ? data.createdAt
      : (data.createdAt?.toString() ?? Date.now()),
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCompleteToggle = () => {
    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);

    completeTask(
      {id : data.id as string, completed: isCompleted},
      {
        onSuccess: () => {
          toast.success(newCompleted ? "Task completed! 🎉" : "Task marked incomplete");
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: () => {
          setIsCompleted(!newCompleted);
          toast.error("Failed to update task");
        },
      },
    );
  };

  return (
    <div className={`group relative bg-card backdrop-blur-md border transition-all duration-300 overflow-hidden ${
      isCompleted
        ? "border-green-500/40 hover:border-green-500/60"
        : "border-primary/10 hover:border-primary/30"
    }`}>
      {/* Tech-Line Top Accent */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] transition-colors duration-300 ${
        isCompleted ? "bg-green-500/40 group-hover:bg-green-500" : "bg-primary/20 group-hover:bg-primary"
      }`} />

      {/* Hover Tech-Corner */}
      <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute top-2 right-2 w-2 h-px bg-primary" />
        <div className="absolute top-2 right-2 w-px h-2 bg-primary" />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-[0.2em] opacity-80">
                Task ID
              </span>
              <span className="text-[9px] font-mono text-muted-foreground uppercase">
                # T-{data.id.toString().slice(-3)}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={handleCompleteToggle}
                className="flex-shrink-0 flex items-center justify-center w-6 h-6 border-2 border-primary/40 hover:border-primary transition-all duration-200 group/checkbox"
                aria-label="Toggle task completion"
              >
                {isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-primary animate-in zoom-in-50 duration-200" />
                )}
              </button>
              <h3
                className={`text-xl font-bold tracking-tight transition-all duration-300 ${
                  isCompleted
                    ? "text-foreground/50 line-through opacity-60"
                    : "text-foreground/90 group-hover:text-primary"
                }`}
              >
                {data.title}
              </h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1 opacity-60">
              Timestamp
            </span>
            <time className="text-[10px] font-mono font-medium text-foreground/70 bg-secondary/50 px-2 py-0.5 border border-border/40">
              {formattedDate}
            </time>
          </div>
        </div>

        <p className={`text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-3 font-medium transition-all duration-300 ${isCompleted ? "opacity-50 line-through" : "opacity-80"}`}>
          {data.description}
        </p>

        <div className="flex justify-end items-center gap-1 pt-4 border-t border-border/20">
          <UpdateTask  data={data} />
          <div className="w-px h-4 bg-border/40 mx-1" />
          <DeleteDialog id={data.id}>
            <div className="p-2 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-all duration-200 cursor-pointer">
              <FaTrash className="w-3.5 h-3.5" />
            </div>
          </DeleteDialog>
        </div>
      </div>
    </div>
  );
};

export default Task;
