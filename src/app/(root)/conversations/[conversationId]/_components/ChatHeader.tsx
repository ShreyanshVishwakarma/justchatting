"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Doc } from "../../../../../../convex/_generated/dataModel";
import { ArrowLeft, MoreVertical, Phone, Video, PhoneCall, VideoIcon, Info, UserX, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ChatHeaderProps = {
  otherUser: Doc<"users"> | null | undefined;
};

const ChatHeader = ({ otherUser }: ChatHeaderProps) => {
  const router = useRouter();
  const [isOnline] = useState(true); // You can connect this to real online status later
  
  const handleVoiceCall = () => {
    // Implement voice call functionality
    console.log("Starting voice call with", otherUser?.username);
  };

  const handleVideoCall = () => {
    // Implement video call functionality
    console.log("Starting video call with", otherUser?.username);
  };

  const handleUserInfo = () => {
    console.log("Show user info for", otherUser?.username);
  };

  const handleBlockUser = () => {
    console.log("Block user", otherUser?.username);
  };
  
  return (
    <div className="relative">
      {/* Beautiful gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      
      <div className="relative flex items-center gap-3 p-2 border-b border-border/50 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60">
        {/* Back button for mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/conversations')}
          className="md:hidden hover:bg-primary/10 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* User Avatar and Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative">
            <Avatar className="h-11 w-11 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
              <AvatarImage src={otherUser?.imageURL} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {otherUser?.username?.charAt(0)?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg text-foreground truncate hover:text-primary transition-colors duration-200">
              {otherUser?.username || "Loading..."}
            </h2>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-muted-foreground">
                {isOnline ? "Active now" : "Last seen recently"}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <TooltipProvider>
            {/* Voice Call Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleVoiceCall}
                  className="h-10 w-10 hover:bg-green-500/10 hover:text-green-600 transition-all duration-200 group hidden xs:flex"
                >
                  <Phone className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Voice call</p>
              </TooltipContent>
            </Tooltip>

            {/* Video Call Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleVideoCall}
                  className="h-10 w-10 hover:bg-blue-500/10 hover:text-blue-600 transition-all duration-200 group hidden sm:flex"
                >
                  <Video className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Video call</p>
              </TooltipContent>
            </Tooltip>

            {/* More Options Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-10 w-10 hover:bg-primary/10 transition-all duration-200 group"
                >
                  <MoreVertical className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border border-border/50">
                {/* Mobile voice/video calls */}
                <DropdownMenuItem onClick={handleVoiceCall} className="sm:hidden">
                  <Phone className="mr-2 h-4 w-4 text-green-600" />
                  Voice Call
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleVideoCall} className="xs:hidden">
                  <Video className="mr-2 h-4 w-4 text-blue-600" />
                  Video Call
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={handleUserInfo}>
                  <Info className="mr-2 h-4 w-4" />
                  User Info
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Volume2 className="mr-2 h-4 w-4" />
                  Mute Notifications
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleBlockUser}
                  className="text-destructive focus:text-destructive"
                >
                  <UserX className="mr-2 h-4 w-4" />
                  Block User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

