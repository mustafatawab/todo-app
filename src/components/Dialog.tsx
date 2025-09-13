"use client";
import React from "react";
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
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Cross, DeleteIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { IoClose } from "react-icons/io5";
import { Button } from "./ui/button";
const Dialog = ({ userId, taskId }: { userId: String; taskId?: String }) => {
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
  });

  const [inputTag, setInputTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  const onTagChange = (e: any) => {
    setInputTag(e.target.value);
    console.log(inputTag);
  };

  const handleInputKeyDown = (event: any) => {
    if (event.key === "Enter" && inputTag.trim() !== "") {
      setTags([...tags, inputTag.trim()]);
      setInputTag("");
    }

    console.log(tags);
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
    console.log(userId);
    console.log(title);
    console.log(description);
    const body = {
        title,
        description,
        userId,
    };
    try {
      const res = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      console.log(result);
    } catch (error) {
        console.log(error)
    }
  };

  return (
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

            {taskId && (
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
        <Button onClick={submitTaskForm}>{taskId ? "Update" : "Add"}</Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default Dialog;
