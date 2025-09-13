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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Dialog from "./Dialog";
import { FaPlus } from "react-icons/fa";



const AddTask = ({userId} : {userId : String}) => {
  console.log(userId)
  return (
    <div className=" flex justify-end">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-green-700 text-white px-2 flex items-center">
            <FaPlus /> Add Task
          </Button>
        </AlertDialogTrigger>
        <Dialog userId={userId} />
      </AlertDialog>
    </div>
  );
};

export default AddTask;
