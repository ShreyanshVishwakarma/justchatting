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

// Compact logo component for sidebar
const CompactLogo = () => (
  <div className="flex flex-col items-center justify-center p-2 mb-2">
    <div className="bg-gradient-to-br from-primary to-purple-600 p-2 rounded-lg shadow-lg transition-all duration-300 hover:shadow-primary/30 hover:scale-105">
      <MessageSquare className="h-6 w-6 text-white" />
    </div>
    <span className="text-[10px] text-muted-foreground mt-1 text-center hidden md:block">JustChat</span>
  </div>
);

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  
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
      <div className="flex h-screen w-full flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="flex w-full flex-row justify-around p-2 md:w-20 md:flex-col md:justify-start md:gap-4 order-last md:order-first">
          <Card className="fixed bottom-0 left-0 z-10 flex w-full flex-row justify-around rounded-t-lg border-t bg-background p-2 md:py-4 md:px-1 md:static md:items-center md:h-full md:flex-col md:rounded-lg md:border">
            {/* Logo - only visible on desktop */}
            <div className="hidden md:block mb-4">
              <CompactLogo />
            </div>
            {navItems.map((item) => (
              <React.Fragment key={item.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant={item.active ? "outline" : "ghost"}
                      size="icon"
                    >
                      <Link href={item.href}>
                        <item.icon className="size-6" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={2}>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </React.Fragment>
            ))}
            <div className="mt-auto p-3 hidden md:flex md:flex-col md:justify-center md:items-center md:gap-2">
              {/* User button at the bottom for desktop */}

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-8 h-8 flex items-center justify-center">
                    <ModeToggle />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={2}>
                  <p>Theme</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-8 h-8 flex items-center justify-center">
                    <UserButton />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={2}>
                  <p>Profile</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center md:hidden">
              {/* User button for mobile */}
              <UserButton />
            </div>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto md:pb-0">
          {children}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default RootLayout;