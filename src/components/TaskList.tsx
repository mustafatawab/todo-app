"use client";
import React, { useEffect, useState } from "react";
import Task from "./Task";
import { TaskType } from "@/types/Task";
import { getTasks } from "@/action/task-action";

const TaskList = ({ userId }: { userId: String }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const getAllTasks = async () => {
    const res = await fetch(`/api/task?userId=${userId}`);
    // const res = await getTasks()
    const data = await res.json();
    localStorage.setItem("tasks", JSON.stringify(data.tasks));
  };

  useEffect(() => {
    getAllTasks();
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
    }
  }, [userId]);

  return (
    <div className="spce-y-4">
      {tasks &&
        tasks.map((task: TaskType, index: number) => (
          <Task
            key={index}
            id={task.id}
            title={task.title}
            description={task.description}
            tags={task.tags}
            createdAt={task.createdAt}
          />
        ))}
    </div>
  );
};

export default TaskList;
