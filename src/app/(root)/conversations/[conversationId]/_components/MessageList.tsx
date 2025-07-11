"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";
import MessageContextMenu from "./messageContextMenu";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Send } from "lucide-react";

// Define message type without conversationId since it's stripped in the API
type MessageWithoutConversationId = Omit<Doc<"messages">, "conversationId">;

type MessageListProps = {
  messages: MessageWithoutConversationId[] | undefined;
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
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages?.toReversed().map((message, index) => {
        const isMe = message.senderId === me?._id;
        const showAvatar = !isMe && (index === messages.length - 1 || messages[index + 1]?.senderId !== message.senderId);

        return (
          <div key={message._id} className={cn("flex gap-2 max-w-[85%] sm:max-w-[70%]", {
            "ml-auto flex-row-reverse": isMe,
            "mr-auto": !isMe
          })}>
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
            
            <div className={cn("flex flex-col space-y-1", {
              "items-end": isMe,
              "items-start": !isMe
            })}>
              <MessageContextMenu 
                onDelete={() => onDeleteMessage(message._id)}
                onCopy={() => onCopyMessage(message.content)}
              >
                <div className={cn("px-4 py-2 rounded-2xl max-w-full break-words", {
                  "bg-primary text-primary-foreground rounded-br-md": isMe,
                  "bg-muted rounded-bl-md": !isMe
                })}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </MessageContextMenu>
              <span className="text-xs text-muted-foreground px-2">
                {formatTime(message._creationTime)}
              </span>
            </div>
          </div>
        );
      })}
      
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
  );
};

export default MessageList;