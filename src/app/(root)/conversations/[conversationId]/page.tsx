"use client"
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'


export default function ConversationPage({ params, searchParams }: any) {
  const { conversationId } = params;
  
  const [message , setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      return;
    }

    const newMessage = useQuery(api.messa,{
      conversationId,
      content: message,
    })

  }

    
  return (
    <Card className="flex flex-col h-full border-0 rounded-none md:border md:rounded-lg">
      <CardHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">John Doe</h2>
            <p className="text-sm text-muted-foreground">Conversation ID: {conversationId}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
       
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <form className="flex w-full gap-2">
          <Input 
            placeholder="Type your message..." 
            className="flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit" size="icon" onClick={handleSubmit}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}