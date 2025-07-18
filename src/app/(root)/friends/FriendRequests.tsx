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
    <div className="space-y-4">
      <Button 
        variant="ghost" 
        className="w-full justify-between p-0 h-auto hover:bg-transparent group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full shadow-lg shadow-orange-500/30 animate-pulse"></div>
          <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            Pending Requests ({friendRequests.length})
          </h2>
        </div>
        <div className="p-1.5 rounded-full bg-card/60 group-hover:bg-accent transition-colors duration-300">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </Button>
      
      {isOpen && (
        <div className="space-y-2">
          <div className="max-h-80 overflow-y-auto space-y-2">
            {friendRequests.map((request) => (
              <div key={request.requestId} className="group flex items-center justify-between p-4 bg-card/60 hover:bg-card/80 backdrop-blur-sm border border-border/50 hover:border-orange-500/20 rounded-xl hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative">
                    <Avatar className="h-10 w-10 ring-2 ring-border group-hover:ring-orange-500/50 transition-all duration-300">
                      <AvatarImage src={request.sender.imageURL} />
                      <AvatarFallback className="text-sm font-bold bg-orange-500 text-white">
                        {request.sender.username?.charAt(0)?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-background shadow-sm animate-pulse"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate group-hover:text-orange-600 transition-colors duration-300">{request.sender.username}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="h-3 w-3 text-orange-500" />
                      <p className="text-xs text-muted-foreground">Wants to be friends</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-3">
                  <Button
                    size="sm"
                    className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                    onClick={() => handleAccept(request.requestId)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs border-destructive/20 bg-card/60 text-destructive hover:bg-destructive/10 shadow-lg hover:shadow-xl transition-all duration-300"
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