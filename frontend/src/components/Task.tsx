'use client'
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { TaskType } from "@/types/Task";
import { Button } from "./ui/button";
import { DeleteDialog } from "./deleteDialog";
import UpdateTask from "./updateTask";

const Task = ({data , userId }: {data : TaskType , userId : String}) => {

const { id , title, description, tags, createdAt } = data

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
    <div className="group relative bg-card backdrop-blur-md border border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden">
      {/* Tech-Line Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
      
      {/* Hover Tech-Corner */}
      <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute top-2 right-2 w-2 h-px bg-primary" />
        <div className="absolute top-2 right-2 w-px h-2 bg-primary" />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-[0.2em] opacity-80">Task ID</span>
              <span className="text-[9px] font-mono text-muted-foreground uppercase">#{id.toString().slice(-6)}</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground/90 group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1 opacity-60">Timestamp</span>
            <time className="text-[10px] font-mono font-medium text-foreground/70 bg-secondary/50 px-2 py-0.5 border border-border/40">
              {formattedDate}
            </time>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-3 font-medium opacity-80">
          {description}
        </p>

        <div className="flex justify-end items-center gap-1 pt-4 border-t border-border/20">
          <UpdateTask userId={userId} data={{id ,title, description}} />
          <div className="w-px h-4 bg-border/40 mx-1" />
          <DeleteDialog id={id} userId={userId}>
            <div className="p-2 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-all duration-200 cursor-pointer">
              <FaTrash className="w-3.5 h-3.5" />
            </div>
          </DeleteDialog>
        </div>
      </div>
    </div>
  );
};

export default Task;
