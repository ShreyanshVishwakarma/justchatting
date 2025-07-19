"use client";

import React from "react";
import { Authenticated , Unauthenticated } from "convex/react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquare, Users } from "lucide-react";
import Link from "next/link"; 
import { ModeToggle } from "@/components/mode-toggle";
import { useConversation } from "@/hooks/useConversation";
import { cn } from "@/lib/utils";
import { RedirectToHome } from "@/components/shared/RedirectTohome";
import { JustChattingLogo } from "@/components/JustChattingLogo";

// Compact logo component for sidebar
const CompactLogo = () => (
  <div className="flex flex-col items-center justify-center p-2 mb-4">
    <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 group">
      <JustChattingLogo size={48} className="rounded-2xl" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background shadow-sm"></div>
    </div>
    <span className="text-[10px] font-medium text-muted-foreground mt-1.5 text-center hidden md:block">JustChat</span>
  </div>
);

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { isActive } = useConversation();
  
  // Define navigation items directly here
  const navItems = [
    {
      label: "Conversations",
      href: "/conversations",
      icon: MessageSquare,
      active: pathname.includes("/conversations"),
    },
    {
      label: "Friends",
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
      <div className="flex h-screen w-full flex-col md:flex-row bg-gradient-to-br from-background via-background to-muted/20">
        {/* Sidebar Navigation */}
        <aside className={cn("flex w-full flex-row justify-around p-2 md:w-16 md:flex-col md:justify-start md:gap-2 order-last md:order-first", {
          "hidden md:flex": isActive
        })}>
          {/* Mobile Navigation Bar */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/20">
            <div className="flex items-center justify-around">
              {navItems.map((item) => (
                <Link key={item.label} href={item.href}>
                  <div className="flex flex-col items-center gap-1 p-2 min-w-[60px]">
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200",
                      item.active 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className={cn(
                      "text-xs font-medium transition-colors duration-200",
                      item.active ? "text-primary" : "text-muted-foreground"
                    )}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              ))}
              
              {/* Mobile User Button */}
              <div className="flex flex-col items-center gap-1 p-2 min-w-[60px]">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-muted/50 transition-colors duration-200">
                  <UserButton />
                </div>
                <span className="text-xs font-medium text-muted-foreground">Profile</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Sidebar */}
          <div className="hidden md:flex md:flex-col md:h-full md:w-16 md:py-4 bg-background/60 backdrop-blur-sm border-r border-border/20">
            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 hover:scale-105">
                <JustChattingLogo size={40} className="rounded-xl" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground mt-1">JustChat</span>
            </div>
            
            {/* Navigation Items */}
            <div className="flex flex-col gap-2 flex-1">
              {navItems.map((item) => (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <div className={cn(
                        "relative flex items-center justify-center w-12 h-12 mx-auto rounded-xl transition-all duration-200",
                        item.active 
                          ? "bg-primary text-primary-foreground shadow-sm" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}>
                        {item.active && (
                          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-sm" />
                        )}
                        <item.icon className="w-5 h-5" />
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Desktop Bottom Section */}
            <div className="flex flex-col items-center gap-2 pt-4 border-t border-border/20">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl hover:bg-muted/50 transition-colors duration-200">
                    <ModeToggle />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  <p>Theme</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl hover:bg-muted/50 transition-colors duration-200">
                    <UserButton />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  <p>Profile</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-0 md:pb-0">
          <div className="h-full w-full">
            {children}
          </div>
        </div>
      </div>
    </TooltipProvider>
    </Authenticated>
    </>
  );
};

export default RootLayout;