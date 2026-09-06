"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Search,
  Plus,
  Check,
  CheckCheck,
  Phone,
  MessageCircle,
  Bell,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JustchatMark } from "@/components/brand";
import { cn } from "@/lib/utils";

function formatTimestamp(timestamp?: number): string {
  if (!timestamp) return "";
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);
  if (diffInSeconds < 60) return "now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  return messageDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface Conversation {
  _id: string;
  name: string;
  lastMessage: string;
  timestamp?: number;
  avatar: string | null;
  unread: boolean;
  isGroup: boolean;
  messageType: string;
  readStatus: string;
  isOnline: boolean;
}

const TABS = [
  { id: "all", name: "all", icon: MessageCircle },
  { id: "unread", name: "unread", icon: Bell },
  { id: "groups", name: "groups", icon: Users },
] as const;

export function ConversationsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const conversationsData = useQuery(api.conversations.getConversationlist);

  if (conversationsData === undefined) {
    return (
      <div className="flex h-full flex-col" aria-busy="true">
        <div className="flex items-center justify-between border-b-[3px] border-dashed border-border px-4 py-3">
          <span className="flex items-center gap-2">
            <JustchatMark size={30} />
            <span className="font-[family-name:var(--font-kalam)] text-2xl font-bold">chats</span>
          </span>
          <span className="size-9 animate-pulse border-[3px] border-dashed border-border/40 bg-[#e5e0d8]/60" style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }} />
        </div>
        <div className="space-y-2.5 p-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 border-2 border-dashed border-border/30 bg-[#fdfbf7] p-3" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
              <span className="size-11 animate-pulse rounded-full bg-[#e5e0d8]" />
              <span className="flex-1 space-y-1.5">
                <span className="block h-3.5 w-2/3 animate-pulse bg-[#e5e0d8]" />
                <span className="block h-3 w-1/2 animate-pulse bg-[#e5e0d8]/70" />
              </span>
            </div>
          ))}
          <p className="pt-1 text-center font-[family-name:var(--font-patrick-hand)] text-base text-foreground/50">sharpening pencils…</p>
        </div>
      </div>
    );
  }

  const sorted = [...conversationsData].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  const filtered = sorted.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matches = c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q);
    if (!matches) return false;
    if (activeTab === "unread") return c.unread;
    if (activeTab === "groups") return c.isGroup;
    return true;
  });
  const unreadCount = sorted.filter((c) => c.unread).length;

  const getMessageIcon = (conversation: Conversation) => {
    if (conversation.messageType === "voice") return <Phone className="size-3.5 text-[#2d5da1]" />;
    if (conversation.readStatus === "read") return <CheckCheck className="size-3.5 text-[#2d5da1]" />;
    if (conversation.readStatus === "delivered") return <CheckCheck className="size-3.5 text-foreground/40" />;
    if (conversation.readStatus === "sent" || conversation.readStatus === "send") return <Check className="size-3.5 text-foreground/40" />;
    return null;
  };

  if (sorted.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <ListHeader total={0} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <span className="relative">
            <span className="flex size-20 -rotate-3 items-center justify-center border-[3px] border-border bg-[#fdf8c1] shadow-[4px_4px_0_0_#2d2d2d]" style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}>
              <MessageCircle className="size-9" strokeWidth={1.75} />
            </span>
            <span className="absolute -right-3 -top-3 flex size-9 rotate-12 items-center justify-center border-[3px] border-border bg-[#ff4d4d] text-lg text-white shadow-[2px_2px_0_0_#2d2d2d]" style={{ borderRadius: "60% 40% 55% 45%" }}>✎</span>
          </span>
          <div>
            <h2 className="font-[family-name:var(--font-kalam)] text-3xl font-bold">nothing here yet</h2>
            <p className="font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/60">add a pal and say hi!</p>
          </div>
          <div className="w-full max-w-[260px] space-y-2">
            {["instant, encrypted messaging", "find pals in the pals tab"].map((t, i) => (
              <p key={t} className={cn("border-2 border-dashed border-border/60 bg-[#fdfbf7] px-3 py-2 font-[family-name:var(--font-patrick-hand)] text-base text-foreground/70", i % 2 ? "rotate-1" : "-rotate-1")} style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                ✎ {t}
              </p>
            ))}
          </div>
          <Button asChild className="mt-1">
            <Link href="/friends"><Plus className="size-5" strokeWidth={3} /> add pals</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      <ListHeader total={sorted.length} unread={unreadCount} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* tabs */}
      <div className="flex gap-2 overflow-x-auto border-b-2 border-dashed border-border/40 px-3 py-2.5 scrollbar-hide">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = tab.id === "unread" ? unreadCount : 0;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-[3px] border-border px-3.5 py-1.5 font-[family-name:var(--font-patrick-hand)] text-lg",
                isActive
                  ? "bg-[#ffeb3b] font-bold shadow-[2px_2px_0_0_#2d2d2d] rotate-1"
                  : "bg-white text-foreground/60 hover:bg-[#e5e0d8]/60"
              )}
              style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
            >
              <tab.icon className="size-4" strokeWidth={2.5} />
              {tab.name}
              {count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center border-2 border-border bg-[#ff4d4d] px-1 font-[family-name:var(--font-kalam)] text-xs font-bold text-white" style={{ borderRadius: "60% 40% 55% 45%" }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* list */}
      <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
            <span className="flex size-14 -rotate-3 items-center justify-center border-[3px] border-dashed border-border/60 bg-white" style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}>
              <Search className="size-6 text-foreground/50" />
            </span>
            <h3 className="font-[family-name:var(--font-kalam)] text-2xl font-bold">nothing found</h3>
            <p className="font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/60">
              {searchQuery ? `no results for “${searchQuery}”` : "try another pile"}
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.map((conversation, i) => (
              <li key={conversation._id}>
                <Link href={`/conversations/${conversation._id}`} className="flex items-center gap-3 border-[2.5px] border-border bg-white p-3 hover:bg-[#fdf8c1]/60" style={{ borderRadius: i % 2 ? "20px 255px 15px 225px / 255px 15px 225px 15px" : "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                  <span className="relative shrink-0">
                    <Avatar className="size-12 border-[2.5px] border-border bg-[#e5e0d8]" style={{ borderRadius: "55% 45% 60% 40% / 45% 55% 40% 60%" }}>
                      <AvatarImage src={conversation.avatar || undefined} alt={conversation.name} />
                      <AvatarFallback className="bg-[#e5e0d8] font-[family-name:var(--font-kalam)] text-xl font-bold text-foreground">
                        {conversation.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 size-4 border-2 border-white bg-green-500" style={{ borderRadius: "60% 40% 55% 45%" }} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className={cn("truncate font-[family-name:var(--font-kalam)] text-xl leading-tight", conversation.unread ? "font-bold" : "font-bold text-foreground/85")}>
                        {conversation.name}
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        <span className="font-[family-name:var(--font-patrick-hand)] text-base text-foreground/50">{formatTimestamp(conversation.timestamp)}</span>
                        {conversation.unread && (
                          <span className="flex h-5 min-w-5 items-center justify-center border-2 border-border bg-[#ff4d4d] px-1 font-[family-name:var(--font-kalam)] text-xs font-bold text-white" style={{ borderRadius: "60% 40% 55% 45%" }}>1</span>
                        )}
                      </span>
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5">
                      {getMessageIcon(conversation)}
                      <span className={cn("truncate font-[family-name:var(--font-patrick-hand)] text-lg leading-snug", conversation.unread ? "text-foreground/80" : "text-foreground/55")}>
                        {conversation.lastMessage}
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* doodle fab */}
      <Link href="/friends" aria-label="add pals" className="absolute bottom-4 right-4">
        <span className="flex size-13 items-center justify-center border-[3px] border-border bg-[#ffeb3b] p-3 shadow-[4px_4px_0px_0px_#2d2d2d] hover:bg-[#ff4d4d] hover:text-white -rotate-3" style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}>
          <Plus className="size-6" strokeWidth={3} />
        </span>
      </Link>
    </div>
  );
}

function ListHeader({
  total,
  unread,
  searchQuery,
  setSearchQuery,
}: {
  total: number;
  unread?: number;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}) {
  return (
    <div className="border-b-[3px] border-dashed border-border bg-white px-3.5 pb-3 pt-3">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <JustchatMark size={30} />
          <h1 className="font-[family-name:var(--font-kalam)] text-2xl font-bold leading-none">
            chats
            <span className="ml-2 inline-flex -translate-y-0.5 items-center border-2 border-border bg-[#e5e0d8]/70 px-2 py-0.5 align-middle font-[family-name:var(--font-patrick-hand)] text-sm font-bold" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
              {total}
            </span>
          </h1>
        </span>
        <Link href="/friends" className="inline-flex items-center gap-1 border-[2.5px] border-border bg-white px-2.5 py-1 font-[family-name:var(--font-patrick-hand)] text-base shadow-[2px_2px_0_0_#2d2d2d] transition-all hover:bg-[#fdf8c1]" style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}>
          <Plus className="size-4" strokeWidth={3} /> pal
          {unread ? <span className="ml-0.5 size-2 rounded-full bg-[#ff4d4d]" /> : null}
        </Link>
      </div>
      <div className="relative mt-2.5">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="search pals or scribbles…"
          className="h-11 -rotate-[0.5deg] bg-[#fdfbf7] pl-9 font-[family-name:var(--font-patrick-hand)] text-lg"
          aria-label="search chats"
        />
      </div>
    </div>
  );
}

export default ConversationsPage;
