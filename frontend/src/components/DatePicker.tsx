"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DatePickerProps = {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
};

export function DatePicker({ date, onSelect }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-11 bg-secondary/20 border-border/60 hover:border-primary/40 rounded-none px-3 font-mono text-xs justify-start text-left font-normal transition-all duration-200",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0 opacity-60" />
          <span className="uppercase tracking-wider">
            {date ? format(date, "dd/MMM/yyyy") : "Set Deadline"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-none border-primary/20" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
          className="rounded-none"
        />
      </PopoverContent>
    </Popover>
  );
}
