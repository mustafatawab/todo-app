"use client";
import React, { useEffect, useState } from "react";
import Task from "./Task";
import { TaskType } from "@/types/Task";
import { getTasks } from "@/action/task-action";
import { getAllTasks } from "@/lib/getAllTasks";
const TaskList = ({ userId }: { userId: String }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await getAllTasks(userId);
        if (mounted && data?.tasks) {
          setTasks(data.tasks);
        }
      } catch (err) {
        const storedTasks = localStorage.getItem("tasks");
        if (mounted && storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      }
    })();

    const handleTaskAdded = (e: any) => {
      setTasks((prev) => [e.detail, ...prev]);
    };

    window.addEventListener("taskAdded", handleTaskAdded);

    return () => {
      mounted = false;
      window.removeEventListener("taskAdded", handleTaskAdded);
    };
  }, [userId]);

  return (
    <div className="space-y-8 pb-12">
      {tasks.length ? (
        tasks.map((task: TaskType, index: number) => (
          <Task key={index} userId={userId} data={task} />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-primary/20 bg-primary/5">
          <div className="relative mb-8">
            <div className="w-16 h-16 border border-primary/40 flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 border border-primary/60 rotate-45" />
            </div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-background border border-primary/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-mono font-bold uppercase tracking-[0.4em] text-primary/80">Buffer Empty</h2>
            <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest max-w-[240px] opacity-60">
              No active task protocols detected in the current sector.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
