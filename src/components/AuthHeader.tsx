"use client";

import { 
  SignInButton, 
  SignUpButton, 
  UserButton 
} from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

import { JustChattingLogo } from "@/components/JustChattingLogo";

// Logo component
const Logo = () => (
  <div className="flex items-center space-x-2 group">
    <div className="transition-all duration-300 rotate-[-5deg] group-hover:rotate-[5deg]">
      <JustChattingLogo size={40} />
    </div>
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold font-[family-name:var(--font-kalam)] text-foreground">
        Just Chatting
      </h1>
      <span className="text-sm text-foreground/70 font-[family-name:var(--font-patrick-hand)] -mt-1">Doodles 'n Chats</span>
    </div>
  </div>
);

export default function AuthHeader() {
  return (
    <header className="border-b-[3px] border-dashed border-border bg-white shadow-[0_4px_0_0_rgba(0,0,0,0.05)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Logo />
          </div>
          <div className="flex items-center space-x-4">
            <Unauthenticated>
              <SignInButton mode="modal">
                <button className="bg-[#ffeb3b] text-foreground border-[3px] border-border px-5 py-2 hover:-translate-y-1 transition-all shadow-[4px_4px_0_0_#2d2d2d] hover:shadow-[6px_6px_0_0_#2d2d2d] text-xl font-[family-name:var(--font-patrick-hand)] rotate-[1deg]" style={{ borderRadius: "var(--radius-wobbly-sm)" }}>
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-white text-foreground border-[3px] border-border px-5 py-2 hover:-translate-y-1 transition-all shadow-[4px_4px_0_0_#2d2d2d] hover:shadow-[6px_6px_0_0_#2d2d2d] text-xl font-[family-name:var(--font-patrick-hand)] rotate-[-1deg]" style={{ borderRadius: "var(--radius-wobbly-sm)" }}>
                  Sign Up
                </button>
              </SignUpButton>
            </Unauthenticated>
            <Authenticated>
              <UserButton />
            </Authenticated>
            <AuthLoading>
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
            </AuthLoading>
          </div>
        </div>
      </div>
    </header>
  );
}
