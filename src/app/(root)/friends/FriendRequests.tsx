"use client";
import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Users, Clock } from "lucide-react";

export const FriendRequests = () => {
  const friendRequests = useQuery(api.requests.getRequestWithSenderDetails);
  const acceptRequest = useMutation(api.request.acceptRequest);
  const rejectRequest = useMutation(api.request.rejectRequest);
  const [isOpen, setIsOpen] = useState(true);

  if (friendRequests === undefined) {
    return null; // Loading state
  }

  if (friendRequests.length === 0) {
    return null; // Don't render anything if no requests
  }

  const handleAccept = async (requestId: any) => {
    try {
      await acceptRequest({ requestId });
      toast.success("Friend request accepted!");
    } catch (error) {
      toast.error("Failed to accept friend request.");
    }
  };

  const handleReject = async (requestId: any) => {
    try {
      await rejectRequest({ requestId });
      toast.success("Friend request rejected.");
    } catch (error) {
      toast.error("Failed to reject friend request.");
    }
  };

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        className="w-full justify-between p-0 h-auto hover:bg-transparent"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full shadow-lg shadow-orange-500/30 animate-pulse"></div>
          <h2 className="text-2xl font-[family-name:var(--font-kalam)] font-bold text-foreground transition-colors duration-200">
            Pending Requests ({friendRequests.length})
          </h2>
        </div>
        <div className="p-1.5 rounded-full bg-card/60 hover:bg-accent transition-colors duration-200">
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-foreground" />
          )}
        </div>
      </Button>

      {isOpen && (
        <div className="space-y-2">
          <div className="max-h-80 overflow-y-auto space-y-2">
            {friendRequests.map((request) => (
              <div
                key={request.requestId}
                className="group flex items-center justify-between p-4 bg-white hover:bg-[#fff9c4]/50 border-[3px] border-border shadow-[4px_4px_0_0_#2d2d2d] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#2d2d2d] rotate-[1deg] hover:rotate-[0deg] transition-all duration-200"
                style={{ borderRadius: "var(--radius-wobbly)" }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative">
                    <Avatar
                      className="h-12 w-12 border-[3px] border-border shadow-[2px_2px_0_0_#2d2d2d] rotate-[-5deg] group-hover:rotate-[5deg] transition-all duration-300"
                      style={{ borderRadius: "var(--radius-wobbly-sm)" }}
                    >
                      <AvatarImage src={request.sender.imageURL} />
                      <AvatarFallback className="text-sm font-bold bg-orange-500 text-white">
                        {request.sender.username?.charAt(0)?.toUpperCase() ||
                          "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-background shadow-sm animate-pulse"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xl font-[family-name:var(--font-kalam)] text-foreground truncate transition-colors duration-300">
                      {request.sender.username}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="h-3 w-3 text-orange-500" />
                      <p className="text-sm font-[family-name:var(--font-patrick-hand)] text-muted-foreground">
                        Wants to be your pal!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-3">
                  <Button
                    size="sm"
                    className="h-10 px-4 text-lg font-[family-name:var(--font-patrick-hand)] bg-[#4caf50] hover:bg-[#4caf50]/90 text-foreground border-[3px] border-border shadow-[2px_2px_0_0_#2d2d2d] hover:shadow-[4px_4px_0_0_#2d2d2d] transition-all duration-200 rotate-[-2deg]"
                    style={{ borderRadius: "var(--radius-wobbly-sm)" }}
                    onClick={() => handleAccept(request.requestId)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 px-4 text-lg font-[family-name:var(--font-patrick-hand)] border-[3px] border-border bg-white text-destructive hover:bg-destructive/10 shadow-[2px_2px_0_0_#2d2d2d] hover:shadow-[4px_4px_0_0_#2d2d2d] transition-all duration-200 rotate-[2deg]"
                    style={{ borderRadius: "var(--radius-wobbly-sm)" }}
                    onClick={() => handleReject(request.requestId)}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
