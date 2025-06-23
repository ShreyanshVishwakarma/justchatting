"use client"
import { Button } from "@/components/ui/button";
import { AuthLoading, Unauthenticated, Authenticated } from "convex/react";
import Loading from './loading';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


const RedirectToConversation = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/conversations");
  }, [router]);
  return (
    <div className="flex justify-center items-center h-64">
      <Loading />
    </div>
  );
};
export default function Home() {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to Just Chatting
        </h1>

        <AuthLoading>
          <div className="flex justify-center items-center h-64">
            <Loading />
          </div>
        </AuthLoading>

        <Unauthenticated>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-8">
              Join our community and start chatting with people from around the world.
              Sign in or create an account to get started.
            </p>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Ready to Chat?
              </h2>
              <p className="text-gray-600 mb-6">
                Sign in to access all features and start conversations.
              </p>
            </div>
          </div>
        </Unauthenticated>

        <Authenticated>
          <RedirectToConversation/>
        </Authenticated>
      </div>
    </div>
  );
}