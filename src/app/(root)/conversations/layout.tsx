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
    <div className="h-full flex gap-2 p-0 md:p-2 select-none">
      {/* Conversation list sidebar */}
      <div className={cn("w-full flex-1 md:w-fit flex flex-col md:flex-none bg-background/50 md:bg-background border-r border-border/50", {
        'hidden md:flex': isActive,
      })}>
      
        <div className="flex-grow overflow-y-auto overflow-hidden">
          <ConversationList/>
        </div>
        </div>
      
      {/* Main content area */}
      <div className={cn("hidden md:flex flex-1 h-full overflow-hidden", {
        'flex': isActive,
      })}>
        <div className="w-full h-full overflow-hidden bg-background border border-border/50 rounded-lg select-none">
          {children}
        </div>
      </div>
    </div>
    </Authenticated>
    </>
  )
}

export default ConversationsLayout