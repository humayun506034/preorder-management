"use client";

import { DayPicker, type DayPickerProps } from "react-day-picker";

export function Calendar(props: DayPickerProps) {
  return (
    <DayPicker
      showOutsideDays
      className="p-3 text-sm"
      classNames={{
        root: "w-fit",
        months: "flex flex-col",
        month: "space-y-3",
        nav: "absolute inset-x-3 top-3 flex items-center justify-between",
        button_previous:
          "grid h-8 w-8 place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40",
        button_next:
          "grid h-8 w-8 place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40",
        month_caption:
          "flex h-8 items-center justify-center px-10 text-sm font-bold text-neutral-950",
        weekdays: "grid grid-cols-7 gap-1",
        weekday:
          "grid h-8 place-items-center text-xs font-semibold text-neutral-500",
        week: "grid grid-cols-7 gap-1",
        day: "grid h-9 w-9 place-items-center rounded-lg text-sm text-neutral-800 data-[outside=true]:text-neutral-300 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-40",
        day_button:
          "grid h-9 w-9 place-items-center rounded-lg transition hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-900",
        selected:
          "rounded-lg bg-neutral-900 text-white hover:bg-neutral-900 [&_button]:hover:bg-neutral-900",
        today:
          "font-bold text-neutral-950 data-[selected=true]:text-white",
      }}
      {...props}
    />
  );
}
