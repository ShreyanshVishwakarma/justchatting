"use client";

import React from 'react'
import { cn } from "@/lib/utils"
import { useConversation } from '@/hooks/useConversation'
import ConversationList from "@/components/shared/conversationList"
import { RedirectToHome } from "@/components/shared/RedirectTohome";
import { Authenticated , Unauthenticated } from "convex/react";

interface ConversationsLayoutProps {
  children: React.ReactNode;
}

const ConversationsLayout = ({ children }: ConversationsLayoutProps) => {
  const { isActive } = useConversation()
  return (
    <>
    <Unauthenticated>
      <RedirectToHome />
    </Unauthenticated>
    <Authenticated>
    <div className="h-full flex gap-4 p-0 md:p-4 select-none">
      {/* Conversation list sidebar */}
      <div className={cn("w-full md:w-80 lg:w-96 flex flex-col md:flex-none border-[3px] border-border bg-white shadow-[6px_6px_0px_0px_#2d2d2d] overflow-hidden -rotate-1 relative z-10", {
        'hidden md:flex': isActive,
      })} style={{ borderRadius: "var(--radius-wobbly)" }}>
      
        <div className="flex-grow overflow-y-auto overflow-hidden p-2">
          <ConversationList/>
        </div>
        </div>
      
      {/* Main content area */}
      <div className={cn("hidden md:flex flex-1 h-full overflow-hidden rotate-1 mt-2", {
        'flex w-full': isActive,
      })}>
        <div className="w-full h-full overflow-hidden border-[3px] border-border bg-white shadow-[6px_6px_0px_0px_#2d2d2d] select-none" style={{ borderRadius: "var(--radius-wobbly)" }}>
          {children}
        </div>
      </div>
    </div>
    </Authenticated>
    </>
  )
}

export default ConversationsLayout