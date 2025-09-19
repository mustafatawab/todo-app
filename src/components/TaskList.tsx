"use client";
import React, { useEffect, useState } from "react";
import Task from "./Task";
import { TaskType } from "@/types/Task";
import { getTasks } from "@/action/task-action";
import { getAllTasks } from "@/lib/getAllTasks";
const TaskList = ({ userId }: { userId: String }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  useEffect(() => {
    getAllTasks(userId);
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, [userId]);

  return (
    <div className="spce-y-4">
      {tasks.length ? (
        tasks.map((task: TaskType, index: number) => (
          <Task key={index} userId={userId} data={task} />
        ))
      ) : (
        <>
          <div className="text-center text-4xl font-semibold">
            Add Your Tasks First
          </div>
        </>
      )}
    </div>
  );
};

export default TaskList;
