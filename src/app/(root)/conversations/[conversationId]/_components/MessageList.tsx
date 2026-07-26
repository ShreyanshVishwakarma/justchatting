"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
} from "@/components/ui/message";
import { Button } from "@/components/ui/button";
import { LockKeyhole, Send } from "lucide-react";
import { Doc } from "../../../../../../convex/_generated/dataModel";
import MessageContextMenu from "./messageContextMenu";
import { cn } from "@/lib/utils";

export type DexieId<TableName extends string> = string & { __brand: TableName };
type MessageId = DexieId<"messages">;

type MessageListProps = {
  messages: any[] | undefined;
  status: string;
  loadMore: (numItems: number) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  otherUser: Doc<"users"> | null | undefined;
  me: Doc<"users"> | null | undefined;
  onSoftDeleteMessage: (messageId: MessageId) => void;
  onHardDeleteMessage: (messageId: MessageId) => void;
  onCopyMessage: (messageContent: string) => void;
};

const formatTime = (message: any) => {
  const timestamp = message.creationTime ?? message._creationTime ?? message.timestamp;
  if (!timestamp) return "";
  return new Date(Number(timestamp)).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MessageList = React.memo(function MessageList({
  messages,
  status,
  loadMore,
  messagesEndRef,
  me,
  otherUser,
  onSoftDeleteMessage,
  onHardDeleteMessage,
  onCopyMessage,
}: MessageListProps) {
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [messages, messagesEndRef]);

  if (!me || !otherUser) {
    return <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">Loading conversation…</div>;
  }

  if (!messages?.length) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-muted">
            <Send className="size-5" />
          </div>
          <h2 className="font-[family-name:var(--font-kalam)] text-2xl font-bold">Start the conversation</h2>
          <p className="mt-1 text-sm text-muted-foreground">Messages are encrypted before they leave your device.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
      {status === "CanLoadMore" && (
        <div className="mb-6 flex justify-center">
          <Button variant="outline" size="sm" onClick={() => loadMore(50)}>Load earlier messages</Button>
        </div>
      )}
      <MessageGroup className="gap-4">
        {messages.map((message) => {
          const isMine = message.senderId === me._id;
          const locked = message.content?.startsWith("🔒 [");
          return (
            <Message key={message.id} align={isMine ? "end" : "start"}>
              {!isMine && (
                <MessageAvatar>
                  <Avatar className="size-8 border border-border">
                    <AvatarImage src={otherUser.imageURL} />
                    <AvatarFallback>{otherUser.username?.charAt(0)?.toUpperCase() ?? "?"}</AvatarFallback>
                  </Avatar>
                </MessageAvatar>
              )}
              <MessageContent>
                <MessageContextMenu
                  onSoftDelete={() => onSoftDeleteMessage(message.id as MessageId)}
                  onHardDelete={() => onHardDeleteMessage(message.id as MessageId)}
                  onCopy={() => onCopyMessage(message.content)}
                >
                  <Bubble align={isMine ? "end" : "start"} variant="outline">
                    <BubbleContent
                      className={cn(
                        "border-2 border-border px-4 py-2.5 font-[family-name:var(--font-patrick-hand)] text-base shadow-[2px_2px_0_0_#2d2d2d]",
                        isMine
                          ? "!bg-[#ffeb3b] !text-foreground rounded-2xl rounded-br-md"
                          : "!bg-white !text-foreground rounded-2xl rounded-bl-md",
                        locked && "!bg-destructive/10 !text-destructive",
                      )}
                    >
                      {message.isDeleted ? (
                        <span className="italic text-muted-foreground">This message was deleted</span>
                      ) : locked ? (
                        <span className="flex items-center gap-2"><LockKeyhole className="size-4 shrink-0" />{message.content}</span>
                      ) : (
                        message.content
                      )}
                    </BubbleContent>
                  </Bubble>
                </MessageContextMenu>
                <MessageFooter>{formatTime(message)}{isMine && message.status === "pending" ? " · Sending" : ""}</MessageFooter>
              </MessageContent>
            </Message>
          );
        })}
      </MessageGroup>
      <div ref={messagesEndRef} />
    </div>
  );
});

export default MessageList;
