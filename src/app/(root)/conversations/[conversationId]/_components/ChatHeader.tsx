"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, LockKeyhole, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Doc } from "../../../../../../convex/_generated/dataModel";

type ChatHeaderProps = { otherUser: Doc<"users"> | null | undefined };

export default function ChatHeader({ otherUser }: ChatHeaderProps) {
  const router = useRouter();
  const name = otherUser?.username ?? "Loading…";

  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-border bg-card px-4 py-3 sm:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => router.push("/conversations")} aria-label="Back to conversations">
        <ArrowLeft className="size-5" />
      </Button>
      <Avatar className="size-10 border-2 border-border">
        <AvatarImage src={otherUser?.imageURL} />
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-[family-name:var(--font-kalam)] text-xl font-bold">{name}</h1>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <LockKeyhole className="size-3.5" />
          <span>End-to-end encrypted</span>
        </div>
      </div>
      <Badge variant="outline" className="hidden sm:inline-flex">Private chat</Badge>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Conversation options"><MoreHorizontal className="size-5" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => navigator.clipboard.writeText(window.location.href)}>Copy conversation link</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
