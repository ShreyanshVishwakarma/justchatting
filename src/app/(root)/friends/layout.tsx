"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import FriendList from "./FriendList";
import { FriendRequests } from "./FriendRequests";
import { AddFriend } from "./addfriends";
import FriendDetail from "./FriendDetail";
import { api } from "../../../../convex/_generated/api";

export default function FriendsLayout() {
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  const friends = useQuery(api.friends.get) || [];

  return (
    <div className="h-full relative overflow-hidden bg-transparent">
      <div className="relative h-full flex flex-col p-4 md:p-8">
        <div className="w-full max-w-6xl mx-auto flex flex-col h-full">
          {/* Header */}
          <div className="mb-6 relative shrink-0">
            <div className="absolute -top-3 -left-3 w-12 h-4 bg-accent/20 rotate-[-5deg] z-0" />
            <div
              className="flex items-center justify-between mb-2 relative z-10 bg-white border-[3px] border-border shadow-[4px_4px_0_0_#2d2d2d] p-5 -rotate-1"
              style={{ borderRadius: "var(--radius-wobbly-sm)" }}
            >
              <div className="space-y-1">
                <h1 className="text-3xl font-bold font-[family-name:var(--font-kalam)] text-foreground">
                  Friends
                </h1>
                <p className="text-foreground/70 text-sm font-[family-name:var(--font-patrick-hand)]">
                  Manage your pals and requests — lightweight and human.
                </p>
              </div>
              <div className="rotate-2 hover:rotate-[-2deg] transition-transform">
                <AddFriend />
              </div>
            </div>
          </div>

          {/* Two-column content */}
          <div className="flex-1 overflow-hidden pb-4">
            <div
              className="h-full bg-[#f6f4ef] border-[3px] border-border shadow-[8px_8px_0_0_#2d2d2d] overflow-hidden rotate-1"
              style={{ borderRadius: "var(--radius-wobbly)" }}
            >
              <div className="h-full overflow-hidden p-4 md:p-6">
                <div className="h-full flex flex-col md:flex-row gap-4 md:gap-6">
                  {/* Left column: requests + list */}
                  <aside className="md:w-[28rem] lg:w-1/2 flex flex-col gap-4">
                    <div className="sticky top-6">
                      <FriendRequests />
                    </div>

                    <div className="flex-1 overflow-auto scrollbar-hide">
                      <FriendList
                        friends={friends}
                        selectedId={selectedFriendId}
                        onSelect={(id: string) => setSelectedFriendId(id)}
                      />
                    </div>
                  </aside>

                  {/* Right column: detail panel */}
                  <main className="flex-1 overflow-auto scrollbar-hide">
                    {/* Show an empty detail panel only when a friend is selected; otherwise keep it blank when the list exists */}
                    <FriendDetail
                      friendId={selectedFriendId}
                      showPlaceholder={friends.length === 0}
                    />
                  </main>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
