"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Authenticated, Unauthenticated } from "convex/react";
import { UserButton, useAuth } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageCircle, Users } from "lucide-react";
import JustChattingLogo from "@/components/JustChattingLogo";
import { useConversation } from "@/hooks/useConversation";
import { useUserOnboarding } from "@/hooks/useUserOnboarding";
import { RedirectToHome } from "@/components/shared/RedirectTohome";
import { cn } from "@/lib/utils";

const NAV = [
  {
    label: "chats",
    href: "/conversations",
    icon: MessageCircle,
    match: "/conversations",
  },
  { label: "pals", href: "/friends", icon: Users, match: "/friends" },
];

function DoodleNavButton({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={href} aria-label={label} aria-current={active ? "page" : undefined}>
          <span
            className={cn(
              "relative flex size-14 items-center justify-center border-[3px] border-border",
              active
                ? "bg-[#ff4d4d] text-white shadow-[2px_2px_0px_0px_#2d2d2d] -rotate-2"
                : "bg-white text-foreground shadow-[4px_4px_0px_0px_#2d2d2d] rotate-2 hover:bg-[#fdf8c1]"
            )}
            style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}
          >
            {active && (
              <span className="absolute -left-2.5 top-1/2 size-3.5 -translate-y-1/2 border-[3px] border-border bg-[#ff4d4d]" style={{ borderRadius: "60% 40% 55% 45%" }} />
            )}
            <Icon className="size-6" strokeWidth={2.5} />
          </span>
          <span className={cn("mt-1 block text-center font-[family-name:var(--font-patrick-hand)] text-base leading-none", active ? "font-bold text-[#ff4d4d]" : "text-foreground/60")}>
            {label}
          </span>
        </Link>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={14}
        className="border-[3px] border-border bg-white font-[family-name:var(--font-kalam)] text-lg shadow-[3px_3px_0_0_#2d2d2d]"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { isActive } = useConversation();
  const router = useRouter();
  const cryptoStatus = useUserOnboarding(Boolean(isSignedIn));

  useEffect(() => {
    if (!isSignedIn) return;
    if (cryptoStatus === "needs_setup") router.push("/onboarding/setup");
    if (cryptoStatus === "needs_recovery") router.push("/onboarding/recover");
  }, [cryptoStatus, isSignedIn, router]);

  return (
    <>
      <Unauthenticated>
        <RedirectToHome />
      </Unauthenticated>
      <Authenticated>
        <TooltipProvider>
          <div
            className="flex h-dvh w-full flex-col bg-[#fdfbf7] md:flex-row"
            style={{
              backgroundImage: "radial-gradient(#e5e0d8 1.2px, transparent 1.2px)",
              backgroundSize: "22px 22px",
            }}
          >
            {/* ——— desktop doodle rail ——— */}
            <aside className="z-40 hidden w-24 shrink-0 flex-col items-center border-r-[3px] border-dashed border-border bg-white py-5 shadow-[4px_0_0_0_rgba(45,45,45,0.08)] md:flex">
              <Link href="/conversations" aria-label="justchat home" className="flex flex-col items-center">
                <span>
                  <JustChattingLogo size={48} />
                </span>
                <span className="mt-1 font-[family-name:var(--font-kalam)] text-lg font-bold leading-none">
                  justchat<span className="text-[#ff4d4d]">.</span>
                </span>
              </Link>

              <span aria-hidden="true" className="my-5 w-12 border-t-[3px] border-dashed border-border/40" />

              <nav className="flex flex-1 flex-col items-center gap-5" aria-label="primary">
                {NAV.map((item) => (
                  <DoodleNavButton
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={pathname.includes(item.match)}
                  />
                ))}
              </nav>

              <div className="flex flex-col items-center gap-2 border-t-[3px] border-dashed border-border/40 pt-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="flex size-14 items-center justify-center border-[3px] border-border bg-[#fdf8c1] shadow-[4px_4px_0px_0px_#2d2d2d]"
                      style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                    >
                      <span className="scale-110">
                        <UserButton />
                      </span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={14} className="border-[3px] border-border bg-white font-[family-name:var(--font-kalam)] text-lg shadow-[3px_3px_0_0_#2d2d2d]">
                    profile
                  </TooltipContent>
                </Tooltip>
                <span className="flex items-center gap-1 font-[family-name:var(--font-patrick-hand)] text-sm text-foreground/50">
                  <span className="size-2 rounded-full bg-green-500" /> you
                </span>
              </div>
            </aside>

            {/* ——— main ——— */}
            <div className="min-h-0 flex-1 overflow-hidden pb-20 md:pb-0">
              {children}
            </div>

            {/* ——— mobile doodle dock ——— */}
            <nav
              aria-label="primary mobile"
              className={cn(
                "fixed inset-x-3 bottom-3 z-50 border-[3px] border-border bg-white px-6 py-2 shadow-[4px_4px_0px_0px_#2d2d2d] md:hidden",
                isActive && "hidden"
              )}
              style={{ borderRadius: "255px 18px 225px 18px / 18px 225px 18px 255px" }}
            >
              <div className="flex items-center justify-around">
                {NAV.map((item) => {
                  const active = pathname.includes(item.match);
                  return (
                    <Link key={item.href} href={item.href} className="flex flex-col items-center gap-0.5 px-4 py-1.5" aria-current={active ? "page" : undefined}>
                      <span
                        className={cn(
                          "flex size-11 items-center justify-center border-[3px] border-border transition-all",
                          active
                            ? "bg-[#ff4d4d] text-white shadow-[2px_2px_0_0_#2d2d2d] -rotate-3"
                            : "bg-white text-foreground rotate-2"
                        )}
                        style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}
                      >
                        <item.icon className="size-5" strokeWidth={2.5} />
                      </span>
                      <span className={cn("font-[family-name:var(--font-patrick-hand)] text-base leading-none", active ? "font-bold text-[#ff4d4d]" : "text-foreground/60")}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
                <span className="flex flex-col items-center gap-0.5 px-4 py-1.5">
                  <span className="flex size-11 items-center justify-center border-[3px] border-border bg-[#fdf8c1]" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                    <UserButton />
                  </span>
                  <span className="font-[family-name:var(--font-patrick-hand)] text-base leading-none text-foreground/60">you</span>
                </span>
              </div>
            </nav>
          </div>
        </TooltipProvider>
      </Authenticated>
    </>
  );
};

export default RootLayout;
