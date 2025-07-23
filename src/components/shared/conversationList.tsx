"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
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
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Add this function at the top level of the component file, before the interface
function formatTimestamp(timestamp?: number): string {
  if (!timestamp) return "";
  
  const now = new Date();
  const messageDate = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);
  
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
  return messageDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

interface Conversation {
  _id: string
  name: string
  lastMessage: string
  timestamp?: number
  avatar: string | null
  unread: boolean
  isGroup: boolean
  messageType: string // Updated to match API response
  readStatus: string // Updated to match API response
  isOnline: boolean
}

export function ConversationsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  const conversationsData = useQuery(api.conversations.getConversationlist)

  const tabs = [
    { id: "all", name: "All", icon: MessageCircle, count: 0 },
    { id: "unread", name: "Unread", icon: Bell, count: 0 },
    { id: "favorites", name: "Favorites", icon: Heart, count: 0 },
    { id: "groups", name: "Groups", icon: Users, count: 0 },
  ]

  if (conversationsData === undefined) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header Skeleton */}
        <div className="bg-card border-b border-border sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-semibold text-foreground">Conversations</h1>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 bg-muted rounded animate-pulse" />
              <div className="w-8 h-8 bg-muted rounded animate-pulse" />
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
              <div key={i} className="h-7 w-16 bg-muted rounded-full animate-pulse flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Loading Conversations */}
        <div className="bg-card">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-border">
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
  const sortedConversations = conversationsData ? [...conversationsData].sort((a, b) => {
    const timestampA = a.timestamp || 0;
    const timestampB = b.timestamp || 0;
    return timestampB - timestampA;
  }) : [];

  // Filter conversations based on search query and active tab
  const filteredConversations = sortedConversations.filter((conversation) => {
    const matchesSearch = conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
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
  const unreadCount = sortedConversations.filter(c => c.unread).length;
  const groupCount = sortedConversations.filter(c => c.isGroup).length;
  
  tabs[1].count = unreadCount;
  tabs[3].count = groupCount;

  const getMessageIcon = (conversation: Conversation) => {
    if (conversation.messageType === "voice") {
      return <Phone className="w-3 h-3 text-primary" />
    }
    if (conversation.readStatus === "read") {
      return <CheckCheck className="w-3 h-3 text-primary" />
    }
    if (conversation.readStatus === "delivered") {
      return <CheckCheck className="w-3 h-3 text-muted-foreground" />
    }
    if (conversation.readStatus === "sent" || conversation.readStatus === "send") {
      return <Check className="w-3 h-3 text-muted-foreground" />
    }
    return null
  }

  // Show empty state if no conversations exist
  if (sortedConversations.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="max-w-sm w-full space-y-4">
          {/* Main illustration */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Users className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="text-center space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                No conversations yet
              </h2>
              <p className="text-sm text-muted-foreground">
                Add friends to start chatting
              </p>
            </div>

            {/* Feature items */}
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-3 w-3 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-sm">Real-time messaging</h3>
                  <p className="text-xs text-muted-foreground">Instant conversations</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-3 w-3 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-sm">Connect with friends</h3>
                  <p className="text-xs text-muted-foreground">Stay in touch</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom hint */}
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground/60">
              💡 Add friends in the Friends tab
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Enhanced Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-chat-primary rounded-xl flex items-center justify-center shadow-sm">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Conversations</h1>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
              <Camera className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Search */}
      <div className="px-4 py-3 bg-background border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring rounded-xl h-10"
          />
        </div>
      </div>

      {/* Scrollable Tabs */}
      <div className="px-4 py-3 bg-background border-b border-border">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 flex-shrink-0",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
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
                        : "bg-destructive text-destructive-foreground"
                    )}
                  >
                    {tab.count}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Enhanced Chat List */}
      <div className="flex-1 overflow-y-auto bg-background">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">No conversations found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery ? `No results for "${searchQuery}"` : 
                   activeTab === "unread" ? "No unread conversations" :
                   activeTab === "groups" ? "No group conversations" :
                   activeTab === "favorites" ? "No favorite conversations" :
                   "Try adjusting your search"}
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
          <div className="divide-y divide-border">
            {filteredConversations.map((conversation) => (
              <Link key={conversation._id} href={`/conversations/${conversation._id}`}>
                <div className="flex items-center gap-3 px-4 py-4 hover:bg-muted/50 cursor-pointer transition-colors group">
                  {/* Enhanced Avatar */}
                  <div className="relative">
                    <Avatar className="w-12 h-12 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                      <AvatarImage src={conversation.avatar || undefined} alt={conversation.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                        {conversation.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-card shadow-sm"></div>
                    )}
                    {conversation.isGroup && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-card flex items-center justify-center">
                        <Users className="w-2.5 h-2.5 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={cn(
                        "font-medium truncate transition-colors",
                        conversation.unread ? "text-foreground" : "text-foreground/80"
                      )}>
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
                      <p className={cn(
                        "text-sm truncate flex-1",
                        conversation.unread ? "text-foreground/70 font-medium" : "text-muted-foreground"
                      )}>
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

      {/* Enhanced FAB */}
      <div className="absolute bottom-4 right-4">
        <Link href="/friends">
          <Button 
            size="lg" 
            className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default ConversationsPage;