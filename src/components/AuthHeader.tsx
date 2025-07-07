"use client";

import { 
  SignInButton, 
  SignUpButton, 
  UserButton 
} from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

import { MessageCircle } from "lucide-react";

// Logo component with gradient text effect
const Logo = () => (
  <div className="flex items-center space-x-2 group">
    <div className="bg-gradient-to-br from-primary to-purple-600 p-2 rounded-lg shadow-lg transition-all duration-300 group-hover:shadow-primary/30 group-hover:scale-105">
      <MessageCircle className="h-5 w-5 text-white" />
    </div>
    <div className="flex flex-col">
      <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
        Just Chatting
      </h1>
      <span className="text-[10px] text-muted-foreground opacity-70 -mt-1">Encrypted & Local-First</span>
    </div>
  </div>
);

export default function AuthHeader() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Logo />
          </div>
          <div className="flex items-center space-x-4">
            <Unauthenticated>
              <SignInButton mode="modal">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow-md">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-blue-400 hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow-md border border-primary/10">
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
