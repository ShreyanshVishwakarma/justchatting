import React from 'react'
import Link from 'next/link'
import { useQuery, useConvexAuth } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const ConversationList = () => {
  const { isAuthenticated } = useConvexAuth();
  const friends = useQuery(api.friends.get, !isAuthenticated ? "skip" : undefined);

  if (friends === undefined) {
    return (
      <div className="p-4 space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }


  return (
    <div className="space-y-1">
      {friends.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground py-8">
          <p>No conversations yet.</p>
          <p>Add a friend to start chatting!</p>
        </div>
      ) : (
        friends.map(friend => (
          <Link href={`/conversations/${friend.conversationId}`} key={friend.conversationId}>
            <div className="flex items-center gap-3 p-3 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer rounded-md group">
              <Avatar className="h-10 w-10">
                <AvatarImage src={friend.imageURL || undefined} />
                <AvatarFallback className="text-sm">
                  {friend.username ? friend.username.charAt(0).toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {friend.username || "Unnamed Conversation"}
                </p>
                <p className="text-xs text-muted-foreground truncate group-hover:text-accent-foreground/70">
                  {friend.email ? "Last message" : "No messages yet"}
                </p>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}

export default ConversationList