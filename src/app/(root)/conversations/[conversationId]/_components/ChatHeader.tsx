"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Doc } from "../../../../../../convex/_generated/dataModel";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

type ChatHeaderProps = {
  otherUser: Doc<"users"> | null | undefined;
};

const ChatHeader = ({ otherUser }: ChatHeaderProps) => {
  const router = useRouter();
  
  return (
    <div className="flex items-center gap-3 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push('/conversations')}
        className="md:hidden"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <Avatar className="h-10 w-10">
        <AvatarImage src={otherUser?.imageURL} />
        <AvatarFallback>{otherUser?.username?.charAt(0)?.toUpperCase() || "?"}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h2 className="font-semibold text-lg">{otherUser?.username || "Loading..."}</h2>
        <p className="text-sm text-muted-foreground">Active now</p>
      </div>
      <Button variant="ghost" size="icon" className="hidden sm:flex">
        <MoreVertical className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatHeader;
