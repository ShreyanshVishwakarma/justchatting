"use client"
import React from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export const FriendRequests = () => {
  const friendRequests = useQuery(api.requests.getRequestWithSenderDetails);
  const acceptRequest = useMutation(api.request.acceptRequest);
  const rejectRequest = useMutation(api.request.rejectRequest);

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
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Friend Requests</h3>
      <div className="space-y-2">
        {friendRequests.map((request) => (
          <div key={request.requestId} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={request.sender.imageURL} />
                <AvatarFallback className="text-xs">
                  {request.sender.username?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{request.sender.username}</p>
                <p className="text-xs text-muted-foreground truncate">{request.sender.email}</p>
              </div>
            </div>
            <div className="flex gap-2 ml-2">
              <Button
                variant="default"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => handleAccept(request.requestId)}
              >
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => handleReject(request.requestId)}
              >
                Decline
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Separator />
    </div>
  );
}