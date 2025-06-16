import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to Just Chatting
        </h1>
        
        <SignedOut>
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
        </SignedOut>

        <SignedIn>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-8">
              Welcome back! You're successfully signed in and ready to start chatting.
            </p>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Chat Features Coming Soon
              </h2>
              <p className="text-gray-600 mb-6">
                Your chat application is ready to go! Start building your chat features.
              </p>
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                Start Chatting
              </Button>
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
