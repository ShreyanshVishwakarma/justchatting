"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";
import MessageContextMenu from "./messageContextMenu";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Send } from "lucide-react";
import { useState, useEffect } from "react";


type MessageListProps = {
  messages: any[] | undefined; // Use 'any' to accommodate the live query type
  status: string;
  loadMore: (numItems: number) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  otherUser: Doc<"users"> | null | undefined;
  onDeleteMessage: (messageId: Id<"messages">) => void;
  onCopyMessage: (messageContent: string) => void;
};

const MessageList = ({ 
  messages, 
  status, 
  loadMore, 
  messagesEndRef, 
  otherUser, 
  onDeleteMessage, 
  onCopyMessage 
}: MessageListProps) => {
    const me = useQuery(api.user.getMe);
    const [animatedMessages, setAnimatedMessages] = useState<Set<string>>(new Set());
    
    // Track new messages for animation
    useEffect(() => {
      if (messages && messages.length > 0) {
        const currentMessageIds = new Set(messages.map(msg => msg.id));
        
        // Clear animations for messages that no longer exist
        setAnimatedMessages(prev => {
          const filtered = new Set(Array.from(prev).filter(id => currentMessageIds.has(id)));
          return filtered;
        });
        
        const newMessageIds = messages
          .filter(msg => !animatedMessages.has(msg.id))
          .map(msg => msg.id);
        
        if (newMessageIds.length > 0) {
          // Add new messages to animated set with a slight delay for staggered effect
          newMessageIds.forEach((id, index) => {
            setTimeout(() => {
              setAnimatedMessages(prev => new Set([...prev, id]));
            }, index * 100); // 100ms stagger between messages
          });
        }
      }
    }, [messages]);
    
    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
      
      {messages?.map((message, index) => {
        const isMe = message.senderId === me?._id;
        const showAvatar = !isMe && (index === 0 || messages[index - 1]?.senderId !== message.senderId);
        const isLatestMessage = index === messages.length - 1; // Last in array means latest chronologically
        
        // Check if we should show timestamp
        // Show timestamp only for the last message in a sequence from the same sender
        const nextMessage = messages[index + 1]; // Next message in chronological order
        const TIME_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds
        
        const showTimestamp = !nextMessage || 
          nextMessage.senderId !== message.senderId || 
          (nextMessage._creationTime - message._creationTime) > TIME_THRESHOLD;

        return (
          <div 
            key={message.id}
            className={cn(
              "flex gap-2 max-w-[85%] sm:max-w-[70%] transition-all duration-500 ease-out",
              {
                "ml-auto flex-row-reverse": isMe,
                "mr-auto": !isMe,
                "opacity-100 translate-y-0": animatedMessages.has(message.id),
                "opacity-0 translate-y-4": !animatedMessages.has(message.id)
              }
            )}
          >
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
            
            <div className={cn("flex flex-col", {
              "items-end": isMe,
              "items-start": !isMe,
              "space-y-0.5": showTimestamp
            })}>
              <MessageContextMenu 
                onDelete={() => onDeleteMessage(message._id as Id<"messages">)}
                onCopy={() => onCopyMessage(message.content)}
              >
                <div className={cn("px-4 py-2 rounded-2xl max-w-full break-words", {
                  "bg-primary text-primary-foreground rounded-br-md": isMe,
                  "bg-muted rounded-bl-md": !isMe
                })}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </MessageContextMenu>
              {showTimestamp && (
                <span className="text-xs text-muted-foreground px-2">
                  {formatTime(message._creationTime)}
                </span>
              )}
            </div>
          </div>
        );
      })}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;