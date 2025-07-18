'use client';

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FriendList = () => {
  const friendList = useQuery(api.friends.get);

  if (friendList === undefined) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-card/60 backdrop-blur-sm rounded-xl border border-border/50">
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-muted rounded-full animate-pulse" />
              <div className="h-2.5 bg-muted rounded-full animate-pulse w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {friendList.length === 0 ? (
        <div className="p-6 text-center bg-card/60 backdrop-blur-sm rounded-xl border border-border/50">
          <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
            <div className="w-6 h-6 bg-primary rounded-full"></div>
          </div>
          <p className="text-base font-medium text-foreground mb-1">No friends added yet</p>
          <p className="text-sm text-muted-foreground">Start by sending a friend request to connect with others.</p>
        </div>
      ) : (
        friendList.map(friend => (
          <div key={friend._id} className="group flex items-center gap-3 p-3 bg-card/60 hover:bg-card/80 backdrop-blur-sm transition-all duration-300 cursor-pointer rounded-xl border border-border/50 hover:border-primary/20 hover:shadow-lg hover:scale-[1.01]">
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-border group-hover:ring-primary/50 transition-all duration-300">
                <AvatarImage src={friend.imageURL} />
                <AvatarFallback className="text-sm font-bold bg-primary text-primary-foreground">
                  {friend.username?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background shadow-sm"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors duration-300">{friend.username}</p>
              <p className="text-xs text-muted-foreground truncate">{friend.email}</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendList;
