'use client';

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FriendList = () => {
  const friendList = useQuery(api.friends.get);

  if (friendList === undefined) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
            <div className="flex-1 space-y-1">
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
      {friendList.length === 0 ? (
        <div className="p-4 text-center text-sm text-muted-foreground">
          <p>No friends added yet.</p>
          <p>Start by sending a friend request.</p>
        </div>
      ) : (
        friendList.map(friend => (
          <div key={friend._id} className="flex items-center gap-3 p-2 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer rounded-md">
            <Avatar className="h-8 w-8">
              <AvatarImage src={friend.imageURL} />
              <AvatarFallback className="text-xs">
                {friend.username?.charAt(0)?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{friend.username}</p>
              <p className="text-xs text-muted-foreground truncate">{friend.email}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendList;
