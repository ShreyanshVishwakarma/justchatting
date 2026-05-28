"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type FriendListProps = {
  selectedId?: string | null;
  onSelect?: (id: string) => void;
};

const FriendList = ({
  friends,
  selectedId,
  onSelect,
}: FriendListProps & { friends?: any[] }) => {
  const friendList = friends ?? useQuery(api.friends.get);

  if (friendList === undefined) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-white border-[3px] border-border shadow-[4px_4px_0_0_#2d2d2d] rotate-[1deg]"
            style={{ borderRadius: "var(--radius-wobbly-sm)" }}
          >
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
        <div
          className="p-6 text-center bg-[#fff9c4] border-[3px] border-dashed border-border shadow-[4px_4px_0_0_#2d2d2d] rotate-[-1deg]"
          style={{ borderRadius: "var(--radius-wobbly)" }}
        >
          <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
            <div className="w-6 h-6 bg-primary rounded-full"></div>
          </div>
          <p className="text-2xl font-[family-name:var(--font-kalam)] font-bold text-foreground mb-1">
            No pals yet!
          </p>
          <p className="text-lg font-[family-name:var(--font-patrick-hand)] text-muted-foreground">
            Send a friend request to start chatting!
          </p>
        </div>
      ) : (
        friendList.map((friend) => (
          <div
            key={friend._id}
            tabIndex={0}
            onClick={() => onSelect?.(friend._id)}
            className={`group flex items-center gap-4 p-5 cursor-pointer border-[4px] border-border shadow-[8px_8px_0_0_#2d2d2d] bg-[#fff9c4] hover:bg-[#fff59a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 ${selectedId === friend._id ? "scale-[1.01] border-primary" : ""}`}
            style={{ borderRadius: "12px" }}
          >
            <div className="relative">
              <Avatar
                className="h-14 w-14 border-[3px] border-border shadow-[2px_2px_0_0_#2d2d2d] transition-all duration-200"
                style={{ borderRadius: "8px" }}
              >
                <AvatarImage src={friend.imageURL} />
                <AvatarFallback className="text-base font-bold bg-primary text-primary-foreground">
                  {friend.username?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg font-[family-name:var(--font-kalam)] text-foreground truncate">
                {friend.username}
              </p>
              <p className="text-sm text-foreground truncate opacity-90">
                {friend.email}
              </p>
            </div>

            {/* Visible action handle on the right so users know the row is actionable */}
            <div className="flex-shrink-0 ml-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    className="h-8 w-8 p-0 bg-[#ffeb3b] text-foreground border-[3px] border-border shadow-[3px_3px_0_0_#2d2d2d] hover:shadow-[4px_4px_0_0_#2d2d2d]"
                    style={{ borderRadius: "var(--radius-wobbly-sm)" }}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="left"
                  className="w-44 bg-white border-[3px] border-border shadow-[4px_4px_0_0_#2d2d2d] font-[family-name:var(--font-patrick-hand)]"
                  style={{ borderRadius: "var(--radius-wobbly-sm)" }}
                >
                  <DropdownMenuItem
                    onSelect={() => {
                      console.log(
                        "Open chat with",
                        friend._id,
                      ); /* TODO: navigate to chat */
                    }}
                  >
                    Open chat
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      onSelect?.(friend._id);
                    }}
                  >
                    View profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      console.log("Remove friend", friend._id);
                    }}
                  >
                    Remove friend
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendList;
