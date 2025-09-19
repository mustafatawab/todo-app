"use client";
import React, { use } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FaEdit, FaPlus } from "react-icons/fa";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Cross, DeleteIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { IoClose } from "react-icons/io5";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { TaskType } from "@/types/Task";

const UpdateTask = ({
  data,
}: {
  data: { id: String; title: String; description: String };
}) => {
  const [taskForm, setTaskForm] = useState({
    title: data.title,
    description: data.description,
  });
  const [inputTag, setInputTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  const [loading, setLoading] = useState(false); // 🔹 track API request
  const [open, setOpen] = useState(false); // 🔹 control dialog state

  const onTagChange = (e: any) => {
    setInputTag(e.target.value);
  };

  const handleInputKeyDown = (event: any) => {
    if (event.key === "Enter" && inputTag.trim() !== "") {
      setTags([...tags, inputTag.trim()]);
      setInputTag("");
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setTaskForm({
      ...taskForm,
      [name]: value,
    });
  };

  const submitTaskForm = async () => {
    const { title, description } = taskForm;
    const body = {
      id: data.id,
      title,
      description,
    };
    try {
      setLoading(true);
      const res = await fetch("/api/task", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await res.json();

      let existingTasks = JSON.parse(localStorage.getItem("tasks") || "[]");

      const updatedTasks = existingTasks.map((task: TaskType) => {
        if (task.id === data.id) {
          return { ...task, ...body };
        }
        return task;
      });
      existingTasks = updatedTasks;
      localStorage.setItem("tasks", JSON.stringify(existingTasks));

      setTaskForm({ title: "", description: "" }); 
      window.location.reload()
      setOpen(false); 
    } catch (error) {
      toast.error(error as string);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" flex justify-end">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <Button
          onClick={() => setOpen(!open)}
          variant={"ghost"}
          className="text-blue-500   "
        >
          <FaEdit />
        </Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Your Task</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="font-semibold">Title</Label>
                  <Input
                    className="w-full p-2 border"
                    type="text"
                    value={taskForm.title as string}
                    placeholder="Title"
                    name="title"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold mt-3">Description</Label>
                  <Textarea
                    value={taskForm.description as string}
                    name="description"
                    onChange={handleChange}
                    placeholder="Type Description about your task"
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={async () => {
                await submitTaskForm();
              }}
              disabled={loading}
            >
              {loading ? "Saving..." : "Update"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UpdateTask;
