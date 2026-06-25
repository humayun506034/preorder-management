"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";

export const Popover = PopoverPrimitive.Root;

export const PopoverTrigger = PopoverPrimitive.Trigger;

export function PopoverContent({
  className = "",
  align = "start",
  sideOffset = 8,
  ...props
}: PopoverPrimitive.PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={`z-50 rounded-xl border border-neutral-200 bg-white p-0 text-neutral-950 shadow-xl outline-none ${className}`}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
