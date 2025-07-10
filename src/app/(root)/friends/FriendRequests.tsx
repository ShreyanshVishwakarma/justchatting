"use client"
import React, { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, Users, Clock } from 'lucide-react';

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
    <div className="space-y-2">
      <Button 
        variant="ghost" 
        className="w-full justify-between p-0 h-auto hover:bg-transparent"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Pending Requests ({friendRequests.length})
          </h3>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      
      {isOpen && (
        <div className="space-y-3">
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {friendRequests.map((request) => (
              <div key={request.requestId} className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800 rounded-xl hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-9 w-9 ring-2 ring-orange-200 dark:ring-orange-800">
                    <AvatarImage src={request.sender.imageURL} />
                    <AvatarFallback className="text-sm bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300">
                      {request.sender.username?.charAt(0)?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-foreground">{request.sender.username}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground truncate">Wants to be friends</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAccept(request.requestId)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
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
}