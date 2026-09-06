import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, style, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full border-[3px] border-border bg-white px-4 py-2.5 font-[family-name:var(--font-patrick-hand)] text-lg text-foreground shadow-[3px_3px_0px_0px_#e5e0d8] transition-colors outline-none placeholder:text-foreground/35 disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-border focus-visible:shadow-[4px_4px_0px_0px_#2d2d2d]",
        "aria-invalid:border-destructive aria-invalid:shadow-[3px_3px_0px_0px_#ff4d4d]",
        className
      )}
      style={{
        borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px",
        ...style,
      }}
      {...props}
    />
  )
}

export { Textarea }
