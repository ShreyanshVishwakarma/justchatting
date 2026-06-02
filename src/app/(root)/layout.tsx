"use client";

import React, { useEffect } from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { UserButton, useAuth } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquare, Users, PenTool } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { useConversation } from "@/hooks/useConversation";
import { cn } from "@/lib/utils";
import { RedirectToHome } from "@/components/shared/RedirectTohome";
import { useUserOnboarding } from "@/hooks/useUserOnboarding";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { isActive } = useConversation();
  const router = useRouter();
  const cryptoStatus = useUserOnboarding(Boolean(isSignedIn));

  useEffect(() => {
    if (!isSignedIn) return;
    if (cryptoStatus === "needs_setup") {
      router.push("/onboarding/setup");
    }
    if (cryptoStatus === "needs_recovery") {
      router.push("/onboarding/recover");
    }
  }, [cryptoStatus, isSignedIn, router]);

  const navItems = [
    {
      label: "Chats",
      href: "/conversations",
      icon: MessageSquare,
      active: pathname.includes("/conversations"),
    },
    {
      label: "Pals",
      href: "/friends",
      icon: Users,
      active: pathname.includes("/friends"),
    },
  ];

  return (
    <>
      <Unauthenticated>
        <RedirectToHome />
      </Unauthenticated>
      <Authenticated>
        <TooltipProvider>
          <div className="tone-down flex h-screen w-full flex-col md:flex-row bg-transparent selection:bg-accent selection:text-white">
            {/* Sidebar Navigation */}
            <aside
              className={cn(
                "flex w-full flex-row justify-around p-2 md:w-[7rem] md:flex-col md:justify-start md:gap-4 order-last md:order-first z-50",
                {
                  "hidden md:flex": isActive,
                },
              )}
            >
              {/* Mobile Navigation Bar */}
              <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-dashed border-border shadow-[0_-4px_0_0_#2d2d2d] pb-safe">
                <div className="flex items-center justify-around py-2">
                  {navItems.map((item) => (
                    <Link key={item.label} href={item.href} className="w-1/3">
                      <div className="flex flex-col items-center gap-1 p-2">
                        <div
                          className={cn(
                            "flex items-center justify-center w-12 h-12 border-[3px] border-border shadow-[2px_2px_0_0_#2d2d2d] transition-transform",
                            item.active
                              ? "bg-accent text-white -translate-y-1"
                              : "bg-white text-foreground hover:-translate-y-1",
                          )}
                          style={{ borderRadius: "var(--radius-wobbly-sm)" }}
                        >
                          <item.icon className="w-6 h-6" strokeWidth={2.5} />
                        </div>
                      </div>
                    </Link>
                  ))}

                  <div className="flex flex-col items-center gap-1 p-2 w-1/3">
                    <div
                      className="flex items-center justify-center w-12 h-12 border-[3px] border-border bg-[#fdf8c1] shadow-[2px_2px_0_0_#2d2d2d]"
                      style={{ borderRadius: "var(--radius-wobbly-sm)" }}
                    >
                      <UserButton />
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Navigation Sidebar */}
              <div className="hidden md:flex md:flex-col md:h-full md:w-[7rem] md:py-8 bg-white border-r-4 border-border border-dashed shadow-[4px_0_0_0_#2d2d2d]">
                {/* Logo area */}
                <div className="flex flex-col items-center mb-8 relative">
                  <div className="absolute -top-4 w-8 h-2 bg-red-400/20 rotate-[-5deg] z-10"></div>
                  <div
                    className="w-16 h-16 bg-[#fdf8c1] border-[3px] border-border shadow-[3px_3px_0_0_#2d2d2d] flex flex-col items-center justify-center rotate-2 hover:rotate-[-2deg] transition-transform cursor-pointer"
                    style={{ borderRadius: "var(--radius-wobbly-sm)" }}
                  >
                    <span className="font-bold font-[family-name:var(--font-kalam)] text-2xl leading-none">
                      JC
                    </span>
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="flex flex-col gap-6 flex-1 items-center">
                  {navItems.map((item, i) => {
                    const rotation =
                      i % 2 === 0 ? "rotate-[-2deg]" : "rotate-[2deg]";
                    return (
                      <Tooltip key={item.label}>
                        <TooltipTrigger asChild>
                          <Link href={item.href}>
                            <div
                              className={cn(
                                `relative flex items-center justify-center w-14 h-14 mx-auto border-[3px] border-border shadow-[4px_4px_0_0_#2d2d2d] transition-transform hover:-translate-y-1 active:shadow-none active:translate-y-1 ${rotation}`,
                                item.active
                                  ? "bg-accent text-white"
                                  : "bg-white text-foreground hover:bg-muted",
                              )}
                              style={{
                                borderRadius: "var(--radius-wobbly-sm)",
                              }}
                            >
                              {item.active && (
                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-accent border-[3px] border-border rounded-full" />
                              )}
                              <item.icon
                                className="w-6 h-6"
                                strokeWidth={2.5}
                              />
                            </div>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          sideOffset={12}
                          className="border-[3px] border-border shadow-[4px_4px_0_0_#2d2d2d] font-[family-name:var(--font-kalam)] text-lg"
                          style={{ borderRadius: "var(--radius-wobbly-sm)" }}
                        >
                          <p>{item.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>

                {/* Desktop Bottom Section */}
                <div className="flex flex-col items-center gap-6 pt-8 border-t-4 border-dashed border-border mt-auto pb-6">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="flex items-center justify-center w-14 h-14 border-[3px] border-border bg-[#fdf8c1] shadow-[4px_4px_0_0_#2d2d2d] hover:-translate-y-1 transition-transform rotate-1"
                        style={{ borderRadius: "var(--radius-wobbly-sm)" }}
                      >
                        <div className="scale-125">
                          <UserButton />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      sideOffset={12}
                      className="border-[3px] border-border shadow-[4px_4px_0_0_#2d2d2d] font-[family-name:var(--font-kalam)] text-lg"
                      style={{ borderRadius: "var(--radius-wobbly-sm)" }}
                    >
                      <p>Profile</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto pb-16 md:pb-0 relative z-0">
              <div className="h-full w-full">{children}</div>
            </div>
          </div>
        </TooltipProvider>
      </Authenticated>
    </>
  );
};

export default RootLayout;
