"use client";
import React, { useState, useMemo } from "react";
import { SearchIcon } from "lucide-react";
import Task from "./Task";
import { TaskType, Priority } from "@/types/Task";
import { useGetTasks } from "@/hooks/useTasks";
import { Loader2Icon } from "lucide-react";

type FilterMode = "ALL" | "ACTIVE" | "COMPLETED" | Priority;

const FILTERS: { value: FilterMode; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "URGENT", label: "Urgent" },
  { value: "HIGH", label: "High" },
];

const TaskList = () => {
  const { data: tasksData, isPending } = useGetTasks();
  const [filter, setFilter] = useState<FilterMode>("ALL");
  const [search, setSearch] = useState("");

  const filteredTasks = useMemo(() => {
    if (!tasksData) return [];

    let tasks = [...tasksData] as TaskType[];

    if (search.trim()) {
      const q = search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)),
      );
    }

    switch (filter) {
      case "ACTIVE":
        tasks = tasks.filter((t) => !t.completed);
        break;
      case "COMPLETED":
        tasks = tasks.filter((t) => t.completed);
        break;
      case "URGENT":
        tasks = tasks.filter((t) => t.priority === "URGENT" && !t.completed);
        break;
      case "HIGH":
        tasks = tasks.filter((t) => t.priority === "HIGH" && !t.completed);
        break;
    }

    return tasks;
  }, [tasksData, filter, search]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2Icon className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH_PROTOCOLS..."
            className="w-full h-10 bg-secondary/20 border border-border/60 focus:border-primary focus:bg-white transition-all duration-200 rounded-none pl-10 pr-4 font-mono text-xs uppercase tracking-wider outline-none text-foreground placeholder:text-muted-foreground/40"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`h-8 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.15em] border transition-all duration-200 ${
              filter === f.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredTasks.length > 0 ? (
        <div className="space-y-4">
          {filteredTasks.map((task: TaskType) => (
            <Task key={task.id} data={task} />
          ))}
        </div>
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
            <h2 className="text-sm font-mono font-bold uppercase tracking-[0.4em] text-primary/80">
              {search || filter !== "ALL" ? "No Matches" : "Buffer Empty"}
            </h2>
            <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest max-w-[240px]">
              {search || filter !== "ALL"
                ? "No tasks match the current filter or search query."
                : "No active task protocols detected in the current sector."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
