"use client"

import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"

function Popover({ ...props }) {
  return <PopoverPrimitive.Root {...props} />
}

function PopoverTrigger({ ...props }) {
  return <PopoverPrimitive.Trigger {...props} />
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 6,
  children,
  ...props
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner sideOffset={sideOffset} align={align}>
        <PopoverPrimitive.Popup
          className={cn(
            "z-50 w-64 rounded-2xl border border-[#F0DCCB] bg-white/95 p-3 text-popover-foreground shadow-xl shadow-orange-950/10 backdrop-blur-md outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            className
          )}
          {...props}
        >
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

function PopoverClose({ ...props }) {
  return <PopoverPrimitive.Close {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverClose }

