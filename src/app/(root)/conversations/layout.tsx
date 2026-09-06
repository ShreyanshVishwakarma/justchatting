"use client";

import React from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { useConversation } from "@/hooks/useConversation";
import ConversationList from "@/components/shared/conversationList";
import { RedirectToHome } from "@/components/shared/RedirectTohome";
import { cn } from "@/lib/utils";

interface ConversationsLayoutProps {
  children: React.ReactNode;
}

const ConversationsLayout = ({ children }: ConversationsLayoutProps) => {
  const { isActive } = useConversation();
  return (
    <>
      <Unauthenticated>
        <RedirectToHome />
      </Unauthenticated>
      <Authenticated>
        <div className="mx-auto flex h-full max-w-6xl gap-4 p-3 md:p-5">
          {/* chat list doodle sheet */}
          <section
            aria-label="chat list"
            className={cn(
              "relative flex min-h-0 w-full flex-col border-[3px] border-border bg-white shadow-[6px_6px_0px_0px_#2d2d2d]",
              "md:w-[340px] md:shrink-0 lg:w-[380px] -rotate-[0.4deg]",
              isActive && "hidden md:flex"
            )}
            style={{ borderRadius: "255px 16px 225px 16px / 16px 225px 16px 255px" }}
          >
            <span aria-hidden="true" className="absolute left-1/2 top-0 z-10 h-5 w-16 -translate-x-1/2 -translate-y-1/2 rotate-[-5deg] border-x-2 border-dashed border-[#2d2d2d]/20 bg-[#2d2d2d]/10" />
            <div className="min-h-0 flex-1 overflow-hidden p-2">
              <ConversationList />
            </div>
          </section>

          {/* active chat doodle sheet */}
          <section
            aria-label="active chat"
            className={cn(
              "relative min-h-0 flex-1 flex-col overflow-hidden border-[3px] border-border bg-white shadow-[6px_6px_0px_0px_#2d2d2d] rotate-[0.4deg]",
              isActive ? "flex" : "hidden md:flex"
            )}
            style={{ borderRadius: "20px 255px 16px 225px / 255px 16px 225px 16px" }}
          >
            <span aria-hidden="true" className="absolute left-1/2 top-0 z-10 h-5 w-16 -translate-x-1/2 -translate-y-1/2 rotate-[4deg] border-x-2 border-dashed border-[#2d2d2d]/20 bg-[#ff4d4d]/20" />
            <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          </section>
        </div>
      </Authenticated>
    </>
  );
};

export default ConversationsLayout;
