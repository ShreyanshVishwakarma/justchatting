"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Search,
  Camera,
  MoreVertical,
  Plus,
  Check,
  CheckCheck,
  Phone,
  MessageCircle,
  Bell,
  Heart,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Add this function at the top level of the component file, before the interface
function formatTimestamp(timestamp?: number): string {
  if (!timestamp) return "";

  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffInSeconds = Math.floor(
    (now.getTime() - messageDate.getTime()) / 1000,
  );

  // Less than a minute
  if (diffInSeconds < 60) {
    return "now";
  }

  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m`;
  }

  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h`;
  }

  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d`;
  }

  // Format as date
  return messageDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface Conversation {
  _id: string;
  name: string;
  lastMessage: string;
  timestamp?: number;
  avatar: string | null;
  unread: boolean;
  isGroup: boolean;
  messageType: string; // Updated to match API response
  readStatus: string; // Updated to match API response
  isOnline: boolean;
}

export function ConversationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const conversationsData = useQuery(api.conversations.getConversationlist);

  const tabs = [
    { id: "all", name: "All", icon: MessageCircle, count: 0 },
    { id: "unread", name: "Unread", icon: Bell, count: 0 },
    { id: "favorites", name: "Favorites", icon: Heart, count: 0 },
    { id: "groups", name: "Groups", icon: Users, count: 0 },
  ];

  if (conversationsData === undefined) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header Skeleton */}
        <div className="bg-white border-b-[3px] border-dashed border-border sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 bg-[#fdf8c1] border-[3px] border-border shadow-[2px_2px_0_0_#2d2d2d] flex items-center justify-center rotate-[-2deg]"
                style={{ borderRadius: "var(--radius-wobbly-sm)" }}
              >
                <MessageCircle className="w-4 h-4 text-foreground" />
              </div>
              <h1 className="font-[family-name:var(--font-kalam)] text-xl font-bold text-foreground">
                Chats
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 bg-muted border-[2px] border-dashed border-border/50 animate-pulse"
                style={{ borderRadius: "var(--radius-wobbly-sm)" }}
              />
              <div
                className="w-8 h-8 bg-muted border-[2px] border-dashed border-border/50 animate-pulse"
                style={{ borderRadius: "var(--radius-wobbly-sm)" }}
              />
            </div>
          </div>
        </div>

        {/* Search Skeleton */}
        <div className="px-4 py-3 bg-card border-b border-border">
          <div className="h-10 bg-muted rounded-lg animate-pulse"></div>
        </div>

        {/* Tabs Skeleton */}
        <div className="px-4 py-2 bg-card border-b border-border">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-7 w-16 bg-muted rounded-full animate-pulse flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Loading Conversations */}
        <div className="bg-card">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 border-b border-border"
            >
              <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              </div>
              <div className="h-3 bg-muted rounded animate-pulse w-8" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sort conversations by timestamp (most recent first)
  const sortedConversations = conversationsData
    ? [...conversationsData].sort((a, b) => {
        const timestampA = a.timestamp || 0;
        const timestampB = b.timestamp || 0;
        return timestampB - timestampA;
      })
    : [];

  // Filter conversations based on search query and active tab
  const filteredConversations = sortedConversations.filter((conversation) => {
    const matchesSearch =
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (activeTab) {
      case "unread":
        return conversation.unread;
      case "groups":
        return conversation.isGroup;
      case "favorites":
        // TODO: Add favorites functionality
        return false;
      default:
        return true;
    }
  });

  // Update tab counts
  const unreadCount = sortedConversations.filter((c) => c.unread).length;
  const groupCount = sortedConversations.filter((c) => c.isGroup).length;

  tabs[1].count = unreadCount;
  tabs[3].count = groupCount;

  const getMessageIcon = (conversation: Conversation) => {
    if (conversation.messageType === "voice") {
      return <Phone className="w-3 h-3 text-primary" />;
    }
    if (conversation.readStatus === "read") {
      return <CheckCheck className="w-3 h-3 text-primary" />;
    }
    if (conversation.readStatus === "delivered") {
      return <CheckCheck className="w-3 h-3 text-muted-foreground" />;
    }
    if (
      conversation.readStatus === "sent" ||
      conversation.readStatus === "send"
    ) {
      return <Check className="w-3 h-3 text-muted-foreground" />;
    }
    return null;
  };

  // Show empty state if no conversations exist
  if (sortedConversations.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="max-w-xs w-full space-y-6">
          {/* Sketchy illustration */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className="w-20 h-20 bg-[#fdf8c1] border-[3px] border-border shadow-[4px_4px_0_0_#2d2d2d] flex items-center justify-center rotate-[-4deg]"
                style={{ borderRadius: "var(--radius-wobbly-sm)" }}
              >
                <MessageCircle
                  className="h-9 w-9 text-foreground"
                  strokeWidth={1.5}
                />
              </div>
              <div
                className="absolute -top-2 -right-4 w-10 h-10 bg-white border-[3px] border-dashed border-border shadow-[2px_2px_0_0_#2d2d2d] flex items-center justify-center rotate-[8deg]"
                style={{ borderRadius: "var(--radius-wobbly-sm)" }}
              >
                <Users
                  className="h-5 w-5 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-1">
            <h2 className="font-[family-name:var(--font-kalam)] text-2xl font-bold text-foreground">
              nothing here yet
            </h2>
            <p className="font-[family-name:var(--font-patrick-hand)] text-base text-muted-foreground">
              add a friend and say hi!
            </p>
          </div>

          {/* Hint items */}
          <div className="space-y-2">
            {[
              { emoji: "⚡", text: "instant real-time messaging" },
              { emoji: "👥", text: "add friends in the Pals tab" },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 bg-white border-[3px] border-dashed border-border shadow-[2px_2px_0_0_#2d2d2d] ${i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"}`}
                style={{ borderRadius: "var(--radius-wobbly)" }}
              >
                <div
                  className="w-8 h-8 bg-[#fdf8c1] border-[2px] border-border flex items-center justify-center text-base flex-shrink-0 rotate-[-2deg]"
                  style={{ borderRadius: "var(--radius-wobbly-sm)" }}
                >
                  {item.emoji}
                </div>
                <p className="font-[family-name:var(--font-patrick-hand)] text-base text-foreground/80">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex justify-center pt-2">
            <Link href="/friends">
              <div
                className="flex items-center gap-2 px-5 py-2.5 bg-[#ffeb3b] border-[3px] border-border shadow-[3px_3px_0_0_#2d2d2d] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#2d2d2d] transition-all duration-200 rotate-[-1deg] font-[family-name:var(--font-kalam)] font-bold text-lg text-foreground"
                style={{ borderRadius: "var(--radius-wobbly-sm)" }}
              >
                <Plus className="w-5 h-5" />
                Add Friends
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-white border-b-[3px] border-dashed border-border sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 bg-[#fdf8c1] border-[3px] border-border shadow-[2px_2px_0_0_#2d2d2d] flex items-center justify-center rotate-[-2deg] flex-shrink-0"
              style={{ borderRadius: "var(--radius-wobbly-sm)" }}
            >
              <MessageCircle className="w-4 h-4 text-foreground" />
            </div>
            <h1 className="font-[family-name:var(--font-kalam)] text-xl font-bold text-foreground">
              Chats
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 border-[2px] border-dashed border-transparent hover:border-border hover:bg-muted/50 transition-all"
              style={{ borderRadius: "var(--radius-wobbly-sm)" }}
            >
              <Camera className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 border-[2px] border-dashed border-transparent hover:border-border hover:bg-muted/50 transition-all"
              style={{ borderRadius: "var(--radius-wobbly-sm)" }}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Search */}
      <div className="px-4 py-3 bg-background border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-[3px] border-border shadow-[4px_4px_0_0_#2d2d2d] focus-visible:ring-0 focus-visible:ring-offset-0 h-10 focus:translate-x-1 focus:translate-y-1 focus:shadow-[2px_2px_0_0_#2d2d2d] rotate-[-1deg] font-[family-name:var(--font-patrick-hand)] text-lg"
            style={{ borderRadius: "var(--radius-wobbly)" }}
          />
        </div>
      </div>

      {/* Scrollable Tabs */}
      <div className="px-4 py-3 bg-background border-b border-border">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-[1.1rem] font-[family-name:var(--font-patrick-hand)] transition-all duration-200 flex-shrink-0 border-[3px] border-border min-h-[44px]",
                  activeTab === tab.id
                    ? "bg-[#ffeb3b] text-foreground shadow-[2px_2px_0_0_#2d2d2d] -translate-y-1 rotate-1 hover:bg-[#ffeb3b]/90"
                    : "bg-white text-muted-foreground hover:bg-muted hover:rotate-[-2deg]",
                )}
                style={{ borderRadius: "var(--radius-wobbly-sm)" }}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
                {tab.count > 0 && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs px-1.5 py-0 h-5 min-w-[20px] rounded-full font-medium",
                      activeTab === tab.id
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-destructive text-destructive-foreground",
                    )}
                  >
                    {tab.count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Enhanced Chat List */}
      <div className="flex-1 overflow-y-auto bg-background">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div
                  className="w-16 h-16 bg-white border-[3px] border-dashed border-border shadow-[3px_3px_0_0_#2d2d2d] flex items-center justify-center rotate-[-3deg]"
                  style={{ borderRadius: "var(--radius-wobbly-sm)" }}
                >
                  <Search className="w-8 h-8 text-foreground/60" />
                </div>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-kalam)] text-xl font-bold text-foreground">
                  nothing found
                </h3>
                <p className="font-[family-name:var(--font-patrick-hand)] text-base text-muted-foreground mt-1">
                  {searchQuery
                    ? `no results for "${searchQuery}"`
                    : activeTab === "unread"
                      ? "no unread conversations"
                      : activeTab === "groups"
                        ? "no group conversations"
                        : activeTab === "favorites"
                          ? "no favourites yet"
                          : "try adjusting your search"}
                </p>
              </div>
              {!searchQuery && activeTab === "all" && (
                <Link href="/friends">
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Friends
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y-0 flex flex-col space-y-2 p-2">
            {filteredConversations.map((conversation) => (
              <Link
                key={conversation._id}
                href={`/conversations/${conversation._id}`}
              >
                <div
                  className="group flex items-center gap-4 p-4 bg-white border-[2px] border-border cursor-pointer transition-all duration-150 hover:bg-[#e6dfb0] hover:border-gray-300"
                  style={{ borderRadius: "var(--radius-wobbly)" }}
                >
                  {/* Enhanced Avatar */}
                  <div className="relative">
                    <Avatar className="w-12 h-12 ring-2 ring-transparent transition-all group-hover:scale-105">
                      <AvatarImage
                        src={conversation.avatar || undefined}
                        alt={conversation.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                        {conversation.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                    )}
                    {conversation.isGroup && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-white flex items-center justify-center">
                        <Users className="w-2.5 h-2.5 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={cn(
                          "font-medium truncate text-base group-hover:font-bold group-hover:text-foreground",
                          conversation.unread
                            ? "text-foreground"
                            : "text-foreground/80",
                        )}
                      >
                        {conversation.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(conversation.timestamp)}
                        </span>
                        {conversation.unread && (
                          <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0 h-5 min-w-[20px] rounded-full font-medium">
                            1
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0">
                        {getMessageIcon(conversation)}
                      </div>
                      <p
                        className={cn(
                          "text-sm truncate flex-1 transition-colors",
                          conversation.unread
                            ? "text-foreground/70 font-medium"
                            : "text-muted-foreground",
                        )}
                      >
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <div className="absolute bottom-5 right-5">
        <Link href="/friends">
          <Button
            size="icon"
            className="w-12 h-12 bg-[#ffeb3b] text-foreground border-[3px] border-border shadow-[4px_4px_0_0_#2d2d2d] hover:-translate-y-1 hover:shadow-[5px_5px_0_0_#2d2d2d] active:shadow-none active:translate-y-0 transition-all duration-200 rotate-[-2deg] hover:rotate-0"
            style={{ borderRadius: "var(--radius-wobbly-sm)" }}
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ConversationsPage;
