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
import { FaPlus } from "react-icons/fa";
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

const AddTask = ({ userId }: { userId: String }) => {
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
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

  const removeTag = (index: Number) => {
    setTags(tags.filter((_, i) => i != index));
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
      title,
      description,
      userId,
    };
    try {
      setLoading(true);
      const res = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await res.json();

      const existingTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      localStorage.setItem(
        "tasks",
        JSON.stringify([...existingTasks, result.task])
      );
      setOpen(false); // 🔹 close dialog only if success
      setTaskForm({ title: "", description: "" }); // reset form
      setTags([]);
    } catch (error) {
        toast.error(error as string)
    } finally{
      setLoading(false)
    }
  };
  return (
    <div className=" flex justify-end">
      <AlertDialog open={open} onOpenChange={setOpen}>
          <Button
            onClick={() => setOpen(true)}
            className="bg-green-700 text-white px-2 flex items-center"
          >
            <FaPlus /> Add Task
          </Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add ToDo List</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="font-semibold">Title</Label>
                  <Input
                    className="w-full p-2 border"
                    type="text"
                    placeholder="Title"
                    name="title"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold mt-3">Description</Label>
                  <Textarea
                    name="description"
                    onChange={handleChange}
                    placeholder="Type Description about your task"
                  />
                </div>

                {false && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Add Tags</Label>
                      <span className="text-red-400">
                        Limit : {5 - tags.length}
                      </span>
                    </div>
                    <Input
                      value={inputTag}
                      onKeyDown={handleInputKeyDown}
                      onChange={onTagChange}
                      className="border-l-2 border-t-2 border-b-2 border-slate-200 rounded-l-md outline-0 w-full p-2 "
                      placeholder="Add some tags"
                      disabled={tags.length == 5}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag, i) => (
                  <Badge key={i} className="text-black bg-slate-300 p-1">
                    <span>{tag}</span>
                    <button onClick={() => removeTag(i)}>
                      <IoClose className="cursor-point" />
                    </button>
                  </Badge>
                ))}
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
                {loading ? "Saving..." : "Add"}
              </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddTask;
