"use client";

import { Button } from "@/components/ui/button";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="bg-muted/20 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
          <WifiOff className="h-12 w-12 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">You're offline</h1>
          <p className="text-muted-foreground">
            Check your internet connection and try again.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={handleRefresh} className="w-full" size="lg">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <p>While you're offline, you can still:</p>
            <ul className="mt-2 space-y-1">
              <li>• View previously loaded conversations</li>
              <li>• Browse your friend list</li>
              <li>• See cached messages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
