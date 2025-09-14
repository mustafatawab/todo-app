'use client'
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { TaskType } from "@/types/Task";
import { Button } from "./ui/button";
import { DeleteDialog } from "./deleteDialog";

const Task = ({id , title, description, tags, createdAt }: TaskType) => {
  const formattedDate = new Date(
    typeof createdAt === "string" || typeof createdAt === "number"
      ? createdAt
      : (createdAt?.toString() ?? Date.now())
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });


  
  return (
    <div className="w-[80%] mx-auto shadow p-6 mt-4">
      <div className="flex justify-between items-center  m-5 w-full">
        <div className="w-full">
          <div className="flex  justify-between">
            <h1 className="font-bold text-[30px] mb-3  leading-tight">
              {title}
            </h1>
            <span>{formattedDate}</span>
          </div>
          {/* <div className="flex flex-wrap justify-between">
            <span className="flex   items-center gap-2 my-5">
              <Avatar>
                <AvatarFallback className="text-white bg-gray-800">
                  I
                </AvatarFallback>
              </Avatar>
              <p className="text-lg">Imran Khan</p>
            </span>
            <p>{createdAt}</p>
          </div> */}
          <div className="flex justify-between items-end w-full">
            <p className="text-gray-600 w-3/4">{description}</p>

            <div className="flex items-center">
              <DeleteDialog id={id}>
                <FaTrash  className="text-red-500"/>
              </DeleteDialog>
              <Button variant={'ghost'} className="text-blue-500   ">
                <FaEdit />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
