"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CollapsibleProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

const Collapsible = ({ open, onOpenChange, children, className }: CollapsibleProps) => {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}

interface CollapsibleTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
  onClick?: () => void
}

const CollapsibleTrigger = React.forwardRef<HTMLDivElement, CollapsibleTriggerProps>(
  ({ children, className, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("cursor-pointer", className)}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CollapsibleTrigger.displayName = "CollapsibleTrigger"

interface CollapsibleContentProps {
  children: React.ReactNode
  className?: string
}

const CollapsibleContent = ({ children, className }: CollapsibleContentProps) => {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
