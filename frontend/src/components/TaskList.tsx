"use client";
import React, { useState, useMemo } from "react";
import { SearchIcon, Loader2Icon, InboxIcon } from "lucide-react";
import Task from "./Task";
import { TaskType, Priority } from "@/types/Task";
import { useGetTasks } from "@/hooks/useTasks";

type FilterMode = "ALL" | "ACTIVE" | "COMPLETED" | Priority;

const FILTERS: { value: FilterMode; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Done" },
  { value: "URGENT", label: "Urgent" },
  { value: "HIGH", label: "High" },
];

const priorityOrder: Record<string, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

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

    tasks.sort((a, b) => {
      const aOrder = a.completed ? 999 : (priorityOrder[a.priority] ?? 99);
      const bOrder = b.completed ? 999 : (priorityOrder[b.priority] ?? 99);
      return aOrder - bOrder;
    });

    return tasks;
  }, [tasksData, filter, search]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-4 text-sm transition-all duration-200 placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`inline-flex h-8 items-center rounded-md px-3 text-xs font-medium transition-all duration-200 ${
              filter === f.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredTasks.map((task: TaskType) => (
            <Task key={task.id} data={task} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
            <InboxIcon className="h-5 w-5 text-muted-foreground/60" />
          </div>
          <h3 className="text-sm font-medium text-foreground">
            {search || filter !== "ALL" ? "No matches" : "No tasks yet"}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {search || filter !== "ALL"
              ? "Try a different search or filter."
              : "Create your first task to get started."}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
