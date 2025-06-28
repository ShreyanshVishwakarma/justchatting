import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

type PageProps = {
  params: {
    conversationId: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
};

// Example message data structure
interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

export default function ConversationPage({ params, searchParams }: PageProps) {
  const { conversationId } = params;
  
  const messages: Message[] = [
    {
      id: '1',
      sender: 'John Doe',
      content: 'Hey, how are you doing?',
      timestamp: '10:30 AM',
      isCurrentUser: false
    },
    {
      id: '2',
      sender: 'You',
      content: 'I\'m good! Just working on this chat app.',
      timestamp: '10:31 AM',
      isCurrentUser: true
    },
    {
      id: '3',
      sender: 'John Doe',
      content: 'That sounds interesting! What technologies are you using?',
      timestamp: '10:32 AM',
      isCurrentUser: false
    },
    {
      id: '4',
      sender: 'You',
      content: 'Next.js, Clerk for auth, Convex for backend, and shadcn/ui for the UI components.',
      timestamp: '10:33 AM',
      isCurrentUser: true
    },
  ];
  
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
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] ${message.isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'} rounded-lg p-3`}>
              {!message.isCurrentUser && (
                <p className="text-xs font-medium">{message.sender}</p>
              )}
              <p>{message.content}</p>
              <p className="text-xs opacity-70 text-right">{message.timestamp}</p>
            </div>
          </div>
        ))}
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <form className="flex w-full gap-2">
          <Input 
            placeholder="Type your message..." 
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}