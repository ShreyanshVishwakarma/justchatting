"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, Link2, LockKeyhole, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const name = otherUser?.username ?? "loading…";

  return (
    <header className="relative z-10 flex shrink-0 items-center gap-3 border-b-[3px] border-dashed border-border bg-white px-3 py-2.5 sm:px-5">
      <Button
        variant="ghost"
        size="icon"
        className="border-[2.5px] border-border bg-white shadow-[2px_2px_0_0_#2d2d2d] md:hidden"
        onClick={() => router.push("/conversations")}
        aria-label="back to chats"
      >
        <ArrowLeft className="size-5" strokeWidth={2.5} />
      </Button>

      <span className="relative shrink-0">
        <Avatar
          className="size-11 border-[2.5px] border-border bg-[#e5e0d8]"
          style={{ borderRadius: "55% 45% 60% 40% / 45% 55% 40% 60%" }}
        >
          <AvatarImage src={otherUser?.imageURL} alt={name} />
          <AvatarFallback className="bg-[#fdf8c1] font-[family-name:var(--font-kalam)] text-xl font-bold">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="absolute -bottom-0.5 -right-0.5 size-3.5 border-2 border-white bg-green-500" style={{ borderRadius: "60% 40% 55% 45%" }} />
      </span>

      <div className="min-w-0 flex-1">
        <h1 className="truncate font-[family-name:var(--font-kalam)] text-2xl font-bold leading-none">
          {name}
        </h1>
        <p className="mt-1 flex items-center gap-1.5 font-[family-name:var(--font-patrick-hand)] text-base leading-none text-foreground/55">
          <LockKeyhole className="size-3.5" strokeWidth={2.5} />
          encrypted · just you two
        </p>
      </div>

      <span className="hidden -rotate-2 items-center gap-1 border-[2.5px] border-border bg-[#e5e0d8]/60 px-2.5 py-1 font-[family-name:var(--font-patrick-hand)] text-base font-bold sm:inline-flex" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
        ✎ private
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="chat options"
            className="border-[2.5px] border-transparent hover:border-border hover:bg-[#fdf8c1]"
          >
            <MoreVertical className="size-5" strokeWidth={2.5} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="border-[3px] border-border bg-white font-[family-name:var(--font-patrick-hand)] text-lg shadow-[4px_4px_0px_0px_#2d2d2d]"
          style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}
        >
          <DropdownMenuItem onSelect={() => navigator.clipboard.writeText(window.location.href)}>
            <Link2 className="mr-2 size-4" /> copy chat link
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => otherUser?.username && navigator.clipboard.writeText(otherUser.username)}
          >
            <Copy className="mr-2 size-4" /> copy pal&apos;s name
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
