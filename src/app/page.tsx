"use client";
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
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Cross, DeleteIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { IoClose } from "react-icons/io5";


export default function Home() {
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
    setTags(tags.filter((_ , i) => i != index))
  }

  return (
    <div className="overflow-x-auto m-10">
      <div className=" flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-green-700 text-white px-2 flex items-center">
              <FaPlus /> Add Task
            </Button>
          </AlertDialogTrigger>
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
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold mt-3">Description</Label>
                    <Textarea placeholder="Type Description about your task" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">

                    <Label>Add Tags</Label>
                    <span className="text-red-400">Limit : {5 - tags.length}</span>
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
                </div>

              <div className="flex flex-wrap gap-1 mt-2">

                {tags.map((tag, i) => (
                  <Badge key={i} className="text-black bg-slate-300 p-1">
                    <span>

                    {tag}
                    </span>
                    <button  onClick={() => removeTag(i)}>

                    <IoClose className="cursor-point"/>
                    </button>

                  </Badge>
                ))}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Add</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="w-[80%] mx-auto shadow">
        <div className="flex justify-between items-center p-6 m-5">
          <div className="">
            <div className="flex  ">
              <h1 className="font-bold text-[40px] mb-3  leading-tight">
                Scalable Next.js Folder Structure for Real-World Projects
              </h1>
              <div>
                <button className="text-red-500 px-2 ">
                  <FaTrash size={"19"} />
                </button>
                <button className="text-blue-500  px-2 ">
                  <FaEdit size={"19"} />
                </button>
              </div>
            </div>
            <div className="flex   items-center gap-6 my-5">
              <div className=" text-center flex items-center  w-12 h-12 bg-gray-300 rounded-full">
                IM
              </div>
              <p>Imran Khan</p>
              <p>2/9/2025</p>
            </div>
            <p className="text-gray-600 ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis ratione facilis architecto veniam. Explicabo voluptatum
              doloremque exercitationem nulla quisquam libero harum perspiciatis
              repellat distinctio, quidem quia expedita, temporibus, omnis
              voluptate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
