"use client"
import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function Calendar22({ placeholder, className, value, onChange }: { placeholder?: string, className?: string, value?: Date, onChange?: (date: Date) => void }) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(value ?? undefined)
  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className={cn("w-48 justify-between font-normal", className)}
          >
            {date ? new Date(date).toLocaleDateString() : placeholder ? placeholder : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
              onChange?.(date as Date)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
