"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LockKeyhole, Send } from "lucide-react";
import { Doc } from "../../../../../../convex/_generated/dataModel";
import MessageContextMenu from "./messageContextMenu";
import { JustchatMark } from "@/components/brand";
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

function dayLabel(timestamp: any): string {
  const ts = Number(timestamp);
  if (!ts) return "";
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (sameDay(d, today)) return "today";
  if (sameDay(d, yesterday)) return "yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

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
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 220;
    if (nearBottom || (messages?.length ?? 0) <= 5) {
      const t = window.setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 80);
      return () => window.clearTimeout(t);
    }
  }, [messages, messagesEndRef]);

  if (!me || !otherUser) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 p-6 font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/55">
        <span className="size-2.5 rounded-full bg-[#ff4d4d]" />
        <span className="size-2.5 rounded-full bg-[#2d5da1]" />
        <span className="size-2.5 rounded-full bg-foreground" />
        unrolling the chat…
      </div>
    );
  }

  if (!messages?.length) {
    return (
      <div className="flex flex-1 items-center justify-center p-6" style={{ backgroundImage: "radial-gradient(#e5e0d8 1px, transparent 1px)", backgroundSize: "18px 18px" }}>
        <div className="w-full max-w-xs text-center">
          <span className="relative mx-auto block w-fit">
            <span className="flex size-20 -rotate-3 items-center justify-center border-[3px] border-border bg-[#fdf8c1] shadow-[4px_4px_0_0_#2d2d2d]" style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}>
              <Send className="size-8" strokeWidth={1.75} />
            </span>
            <JustchatMark size={30} className="absolute -bottom-2 -right-2 rotate-6 border-2 border-border bg-white" />
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-kalam)] text-3xl font-bold leading-none">
            say hi to {otherUser.username}!
          </h2>
          <p className="mt-1.5 font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/60">
            first doodle wins. it&apos;s scrambled before it even leaves you.
          </p>
          <p className="mx-auto mt-3 w-fit -rotate-1 border-2 border-dashed border-border/50 bg-white px-3 py-1 font-[family-name:var(--font-patrick-hand)] text-base text-foreground/60" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
            🔒 encrypted · local-first
          </p>
        </div>
      </div>
    );
  }

  let lastDay = "";

  return (
    <div ref={scrollRef} className="message-scroll-fade min-h-0 flex-1 overflow-y-auto px-3 py-5 sm:px-5" style={{ backgroundImage: "radial-gradient(#e5e0d8 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
      {status === "CanLoadMore" && (
        <div className="mb-5 flex justify-center">
          <Button variant="outline" size="sm" onClick={() => loadMore(50)} className="-rotate-1 bg-white">
            ↑ load earlier scribbles
          </Button>
        </div>
      )}

      <div className="mx-auto flex max-w-3xl flex-col gap-1.5">
        {messages.map((message) => {
          const isMine = message.senderId === me._id;
          const locked = message.content?.startsWith("🔒 [");
          const ts = message.creationTime ?? message._creationTime ?? message.timestamp;
          const day = dayLabel(ts);
          const showDay = day && day !== lastDay;
          lastDay = day || lastDay;

          return (
            <React.Fragment key={message.id}>
              {showDay && (
                <div className="my-3 flex items-center gap-3" aria-label={day}>
                  <span className="h-0 flex-1 border-t-2 border-dashed border-border/30" />
                  <span className="border-2 border-border bg-white px-3 py-0.5 font-[family-name:var(--font-patrick-hand)] text-base font-bold text-foreground/70 shadow-[2px_2px_0_0_#2d2d2d]" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                    ✎ {day}
                  </span>
                  <span className="h-0 flex-1 border-t-2 border-dashed border-border/30" />
                </div>
              )}

              <div className={cn("flex w-full", isMine ? "justify-end" : "justify-start")}>
                {!isMine && (
                  <Avatar className="mr-2 mt-1 size-8 shrink-0 self-start border-2 border-border" style={{ borderRadius: "55% 45% 60% 40% / 45% 55% 40% 60%" }}>
                    <AvatarImage src={otherUser.imageURL} alt={otherUser.username ?? "pal"} />
                    <AvatarFallback className="bg-[#e5e0d8] font-[family-name:var(--font-kalam)] font-bold">
                      {otherUser.username?.charAt(0)?.toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={cn("flex max-w-[80%] flex-col sm:max-w-[70%]", isMine ? "items-end" : "items-start")}>
                  <MessageContextMenu
                    onSoftDelete={() => onSoftDeleteMessage(message.id as MessageId)}
                    onHardDelete={() => onHardDeleteMessage(message.id as MessageId)}
                    onCopy={() => onCopyMessage(message.content)}
                  >
                    <div
                      className={cn(
                        "relative border-[2.5px] border-border px-4 py-2.5 font-[family-name:var(--font-patrick-hand)] text-[1.15rem] leading-snug shadow-[3px_3px_0px_0px_#2d2d2d]",
                        isMine
                          ? "rotate-[0.5deg] bg-[#ffeb3b] text-foreground"
                          : "-rotate-[0.5deg] bg-white text-foreground",
                        locked && "!bg-[#ff4d4d]/10 !text-[#ff4d4d]"
                      )}
                      style={{
                        borderRadius: isMine
                          ? "20px 4px 20px 20px / 20px 4px 20px 20px"
                          : "4px 20px 20px 20px / 4px 20px 20px 20px",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {message.isDeleted ? (
                        <span className="italic text-foreground/50">~~this scribble was erased~~</span>
                      ) : locked ? (
                        <span className="flex items-center gap-1.5">
                          <LockKeyhole className="size-4 shrink-0" /> {message.content}
                        </span>
                      ) : (
                        <span className="whitespace-pre-wrap">{message.content}</span>
                      )}
                    </div>
                  </MessageContextMenu>
                  <span className="mt-1 px-1 font-[family-name:var(--font-patrick-hand)] text-sm text-foreground/45">
                    {formatTime(message)}
                    {isMine && message.status === "pending" ? " · sending…" : ""}
                    {isMine && message.status === "error" ? " · tap to retry" : ""}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div ref={messagesEndRef} className="h-2" />
    </div>
  );
});

export default MessageList;
