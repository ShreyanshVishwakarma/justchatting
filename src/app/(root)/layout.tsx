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

// Replace the useNavigation hook with inline functionality
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
        <aside className="flex w-full flex-row justify-around p-2 md:w-20 md:flex-col md:justify-center md:gap-4 order-last md:order-first">
          <Card className="fixed bottom-0 left-0 z-10 flex w-full flex-row justify-around rounded-t-lg border-t bg-background p-2 md:py-2 md:px-1 md:static md:items-center md:h-full md:flex-col md:rounded-lg md:border">
            {navItems.map((item) => (
              <React.Fragment key={item.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant={item.active ? "outline" : "ghost"}
                      size="icon"
                      className=""
                    >
                      <a href={item.href}>
                        <item.icon className="size-6" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={2}>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </React.Fragment>
            ))}
            <div className="mt-auto p-3 hidden md:flex md:justify-center md:items-center">
              {/* User button at the bottom for desktop */}
              <Tooltip>
                <TooltipTrigger asChild>
                        <UserButton />
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={2}>
                  <p>Profile</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center md:hidden">
              {/* User button for mobile */}
              <div className="w-8 h-8">
                <UserButton />
              </div>
            </div>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
};

export default RootLayout;