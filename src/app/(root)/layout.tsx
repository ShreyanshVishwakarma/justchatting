"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { MessageSquare, Users } from "lucide-react";
import Link from "next/link"; 
import { ModeToggle } from "@/components/mode-toggle";
import { useConversation } from "@/hooks/useConversation";
import { cn } from "@/lib/utils";

// Compact logo component for sidebar
const CompactLogo = () => (
  <div className="flex flex-col items-center justify-center p-2 mb-4">
    <div className="relative w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      <MessageSquare className="h-6 w-6 text-white relative z-10" />
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
    <TooltipProvider>
      <div className="flex h-screen w-full flex-col md:flex-row bg-gradient-to-br from-background via-background to-muted/20">
        {/* Sidebar Navigation */}
        <aside className={cn("flex w-full flex-row justify-around p-2 md:w-20 md:flex-col md:justify-start md:gap-2 order-last md:order-first", {
          "hidden md:flex": isActive
        })}>
          <Card className="fixed bottom-0 left-0 z-10 flex w-full flex-row justify-around rounded-t-2xl border-t bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90 p-3 md:py-6 md:px-2 md:static md:items-center md:h-full md:flex-col md:rounded-2xl md:border md:shadow-xl md:shadow-black/5">
            {/* Logo - only visible on desktop */}
            <div className="hidden md:block">
              <CompactLogo />
            </div>
            
            {/* Navigation Items */}
            <div className="flex flex-row md:flex-col gap-2 md:gap-3">
              {navItems.map((item) => (
                <React.Fragment key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant={item.active ? "default" : "ghost"}
                        size="icon"
                        className={cn(
                          "h-12 w-12 md:h-11 md:w-11 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95",
                          item.active 
                            ? "bg-gradient-to-r from-primary/90 to-primary shadow-lg shadow-primary/25 text-primary-foreground" 
                            : "hover:bg-muted/80 hover:shadow-md"
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-5 w-5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8} className="font-medium">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </React.Fragment>
              ))}
            </div>

            {/* Desktop Bottom Section */}
            <div className="mt-auto hidden md:flex md:flex-col md:justify-center md:items-center md:gap-3 md:pt-4">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-2 rounded-xl hover:bg-muted/80 transition-colors duration-200">
                    <ModeToggle />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8} className="font-medium">
                  <p>Theme</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-2 rounded-xl hover:bg-muted/80 transition-colors duration-200">
                    <UserButton />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8} className="font-medium">
                  <p>Profile</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Mobile User Section */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="p-2 rounded-xl">
                <UserButton />
              </div>
            </div>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto md:pb-0 relative">
          <div className="h-full w-full">
            {children}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default RootLayout;