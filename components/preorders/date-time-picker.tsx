"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DateTimePickerProps = {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder: string;
};

const buttonMotion = {
  whileHover: { scale: 1.01 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.12, ease: "easeOut" },
} as const;

const toDate = (value: string) => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const toTime = (value: string) => {
  const date = toDate(value);

  if (!date) {
    return "00:00";
  }

  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
};

const toInputValue = (date: Date, time: string) => {
  const [hours = "0", minutes = "0"] = time.split(":");
  const nextDate = new Date(date);

  nextDate.setHours(Number(hours), Number(minutes), 0, 0);

  return `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(nextDate.getDate()).padStart(2, "0")}T${String(
    nextDate.getHours(),
  ).padStart(2, "0")}:${String(nextDate.getMinutes()).padStart(2, "0")}`;
};

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M8 2v4M16 2v4M4 9h16" />
      <path d="M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function DateTimePicker({
  value,
  onChange,
  required,
  placeholder,
}: DateTimePickerProps) {
  const selectedDate = toDate(value);
  const selectedTime = toTime(value);

  const handleDateSelect = (date?: Date) => {
    if (!date) {
      if (!required) {
        onChange("");
      }

      return;
    }

    onChange(toInputValue(date, selectedTime));
  };

  const handleTimeChange = (time: string) => {
    const date = selectedDate ?? new Date();
    onChange(toInputValue(date, time));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          type="button"
          {...buttonMotion}
          className={`flex h-10 w-full min-w-0 max-w-[420px] items-center justify-between gap-3 rounded-lg border border-neutral-300 bg-white px-3 text-left text-sm outline-none transition hover:bg-neutral-50 focus:border-neutral-500 ${
            selectedDate ? "text-neutral-950" : "text-slate-500"
          }`}
        >
          <span className="truncate">
            {selectedDate
              ? `${format(selectedDate, "MMM dd, yyyy")} ${selectedTime}`
              : placeholder}
          </span>
          <CalendarIcon />
        </motion.button>
      </PopoverTrigger>

      <PopoverContent className="w-auto">
        <div className="space-y-3 p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            defaultMonth={selectedDate}
          />

          <div className="flex items-center justify-between gap-3 border-t border-neutral-200 pt-3">
            <label className="text-sm font-semibold text-neutral-700">
              Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(event) => handleTimeChange(event.target.value)}
              className="h-9 rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-500"
            />
          </div>

          {!required ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="h-9 w-full rounded-lg border border-neutral-200 bg-white text-sm font-bold text-neutral-900 transition hover:bg-neutral-50"
            >
              Clear date
            </button>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}
