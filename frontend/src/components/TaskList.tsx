"use client";
import React, { useState, useMemo } from "react";
import { SearchIcon, Loader2Icon, InboxIcon, ListTodoIcon, ClockIcon, CheckCircle2Icon } from "lucide-react";
import Task from "./Task";
import { TaskType, Priority, TaskStatus } from "@/types";
import { useGetTasks } from "@/hooks/useTasks";

type FilterMode = "ALL" | "ACTIVE" | "DONE" | Priority;

const FILTERS: { value: FilterMode; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "DONE", label: "Done" },
  { value: "URGENT", label: "Urgent" },
  { value: "HIGH", label: "High" },
];

const priorityOrder: Record<string, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

const statusIcon: Record<TaskStatus, React.ReactNode> = {
  TODO: <ListTodoIcon className="h-3.5 w-3.5" />,
  IN_PROGRESS: <ClockIcon className="h-3.5 w-3.5" />,
  DONE: <CheckCircle2Icon className="h-3.5 w-3.5" />,
};

const TaskList = () => {
  const { data: tasksData, isPending } = useGetTasks();
  const [filter, setFilter] = useState<FilterMode>("ALL");
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    if (!tasksData) return { total: 0, todo: 0, inProgress: 0, done: 0 };
    const tasks = tasksData as TaskType[];
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "TODO").length,
      inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      done: tasks.filter((t) => t.status === "DONE").length,
    };
  }, [tasksData]);

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
        tasks = tasks.filter((t) => t.status !== "DONE");
        break;
      case "DONE":
        tasks = tasks.filter((t) => t.status === "DONE");
        break;
      case "URGENT":
        tasks = tasks.filter((t) => t.priority === "URGENT" && t.status !== "DONE");
        break;
      case "HIGH":
        tasks = tasks.filter((t) => t.priority === "HIGH" && t.status !== "DONE");
        break;
    }

    tasks.sort((a, b) => {
      const aOrder = a.status === "DONE" ? 999 : (priorityOrder[a.priority] ?? 99);
      const bOrder = b.status === "DONE" ? 999 : (priorityOrder[b.priority] ?? 99);
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
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Total" value={stats.total} icon={ListTodoIcon} />
        <StatCard label="To Do" value={stats.todo} icon={ListTodoIcon} />
        <StatCard label="In Progress" value={stats.inProgress} icon={ClockIcon} />
        <StatCard label="Done" value={stats.done} icon={CheckCircle2Icon} />
      </div>

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

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
  return (
    <div className="rounded-xl border bg-card p-3 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-3.5 w-3.5 text-muted-foreground/60" />
        <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
      </div>
      <p className="text-xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

export default TaskList;
