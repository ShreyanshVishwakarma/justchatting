import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, style, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-accent selection:text-white border-input flex h-11 w-full min-w-0 border-[3px] bg-white px-4 py-2 text-lg shadow-[4px_4px_0px_0px_#e5e0d8] transition-[color,box-shadow,transform] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-border focus-visible:shadow-[4px_4px_0px_0px_#2d2d2d] focus-visible:-translate-y-[2px]",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className
      )}
      style={{
        borderRadius: "var(--radius-wobbly-sm)",
        ...style,
      }}
      {...props}
    />
  )
}

export { Input }
