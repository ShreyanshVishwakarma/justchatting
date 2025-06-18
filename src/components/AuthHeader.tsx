"use client";

import { 
  SignInButton, 
  SignUpButton, 
  UserButton 
} from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

export default function AuthHeader() {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Just Chatting
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Unauthenticated>
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Sign Up
                </button>
              </SignUpButton>
            </Unauthenticated>
            <Authenticated>
              <UserButton afterSignOutUrl="/" />
            </Authenticated>
            <AuthLoading>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </AuthLoading>
          </div>
        </div>
      </div>
    </header>
  );
}
