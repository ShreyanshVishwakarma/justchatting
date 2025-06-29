"use client";

import React from 'react'
import { cn } from "@/lib/utils"
import { useConversation } from '@/hooks/useConversation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ConversationList from "@/components/shared/conversationList"

interface ConversationsLayoutProps {
  children: React.ReactNode;
}

const ConversationsLayout = ({ children }: ConversationsLayoutProps) => {
  const { isActive } = useConversation()
  return (
    <div className="h-full flex gap-2 py-2">
      {/* Conversation list sidebar */}
      <Card className={cn("w-full flex-1 md:w-1/4 flex flex-col md:flex-none", {
        'hidden md:block': isActive,
      })}>
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <Separator/>
        <CardContent className="flex-grow overflow-y-auto p-0">
          {/* This is where you can view your conversations with friends. */}
          <ConversationList/>
        </CardContent>
      </Card>
      
      {/* Main content area */}
      <div className={cn("hidden md:block flex-1 h-full overflow-y-auto", {
        'block': isActive,
      })}>
        {children}
      </div>
    </div>
  )
}

export default ConversationsLayout