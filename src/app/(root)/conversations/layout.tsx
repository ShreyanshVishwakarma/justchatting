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
    <div className="h-full flex gap-2 p-2 select-none">
      {/* Conversation list sidebar */}
      <div className={cn("w-full flex-1 md:w-72 flex flex-col md:flex-none bg-background/50 md:bg-background border-r border-border/50", {
        'hidden md:flex': isActive,
      })}>
        <div className="p-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Conversations
            </h2>
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-1">
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