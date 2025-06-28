import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface ConversationsLayoutProps {
  children: React.ReactNode;
}

const ConversationsLayout = ({ children }: ConversationsLayoutProps) => {
  return (
    <div className="h-full flex gap-2 p-2">
      {/* Conversation list sidebar */}
      <Card className="w-full md:w-1/4 flex flex-col md:h-full">
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <Separator/>
        <CardContent className="flex-grow overflow-y-auto">
          <p className="text-muted-foreground">
            This is where you can view your conversations with friends.
          </p>
        </CardContent>
      </Card>
      
      {/* Main content area */}
      <div className="hidden md:block md:flex-1 h-full">
        {children}
      </div>
    </div>
  )
}

export default ConversationsLayout