"use client"
import React, { use, useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, ArrowLeft, MoreVertical } from "lucide-react"
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import MessageContextMenu from './_components/messageContextMenu'


export default function ConversationPage({ params} : {
  params : Promise<{ conversationId: Id<"conversations">}>
}) {
  const { conversationId } = use(params);
  const me = useQuery(api.user.getMe);
  const otherUser = useQuery(api.conversations.getOtherUser, { conversationId });
  const router = useRouter();
  
  const [message , setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const newMessage = useMutation(api.message.newMessage);
  const {
    results: messages,
    status,
    loadMore
  } = usePaginatedQuery(
    api.messages.get,
    { conversationID: conversationId},
    { initialNumItems: 20 }
  )

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get unique sender IDs to fetch user info
  const senderIds = messages ? [...new Set(messages.map(msg => msg.senderId))] : [];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      return;
    }

    newMessage({ conversationId, content: message })
      .then(() => {
        setMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

    
  return (
    <div className="flex flex-col h-full">
      {/* Header with back button */}
      <div className="flex items-center gap-3 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/conversations')}
          className="md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={otherUser?.imageURL} />
          <AvatarFallback>{otherUser?.username?.charAt(0)?.toUpperCase() || "?"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{otherUser?.username || "Loading..."}</h2>
          <p className="text-sm text-muted-foreground">Active now</p>
        </div>
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages && messages.length === 0 && (
          <div className='flex flex-col items-center justify-center h-full'>
            <div className='text-center space-y-4 max-w-md'>
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Send className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">No messages yet</h3>
                <p className="text-sm text-muted-foreground">Send a message to start the conversation.</p>
              </div>
            </div>
          </div>
        )}
        
        {messages?.toReversed().map((message, index) => {
          const isMe = message.senderId === me?._id;
          const showAvatar = !isMe && (index === messages.length - 1 || messages[index + 1]?.senderId !== message.senderId);
          
          return (
            <div key={message._id} className={cn("flex gap-2 max-w-[85%] sm:max-w-[70%]", {
              "ml-auto flex-row-reverse": isMe,
              "mr-auto": !isMe
            })}>
              {/* Avatar for other user's messages */}
              {!isMe && (
                <Avatar className={cn("h-8 w-8 mt-1", {
                  "invisible": !showAvatar
                })}>
                  <AvatarImage src={otherUser?.imageURL} />
                  <AvatarFallback className="text-xs">
                    {otherUser?.username?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
              )}
              
              {/* Message bubble */}
              <MessageContextMenu>
              <div className={cn("flex flex-col space-y-1", {
                "items-end": isMe,
                "items-start": !isMe
              })}>
                <div className={cn("px-4 py-2 rounded-2xl max-w-full break-words", {
                  "bg-primary text-primary-foreground rounded-br-md": isMe,
                  "bg-muted rounded-bl-md": !isMe
                })}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                <span className="text-xs text-muted-foreground px-2">
                  {formatTime(message._creationTime)}
                </span>
              </div>
              </MessageContextMenu>
            </div>
          );
        })}
        
        {/* Load more button */}
        {status === "CanLoadMore" && (
          <div className="flex justify-center py-4">
            <Button 
              variant="outline" 
              onClick={() => loadMore(10)}
              size="sm"
            >
              Load more messages
            </Button>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input 
            placeholder="Type a message..." 
            className="flex-1 rounded-full px-4 py-2 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            maxLength={1000}
          />
          <Button 
            type="submit" 
            size="icon"
            className="rounded-full h-10 w-10"
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}