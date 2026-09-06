"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, WifiOff } from "lucide-react";
import { JustchatLockup } from "@/components/brand";

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm -rotate-1 border-[3px] border-border bg-white p-8 text-center shadow-[8px_8px_0px_0px_#2d2d2d]" style={{ borderRadius: "255px 18px 225px 18px / 18px 225px 18px 255px" }}>
        <JustchatLockup size={36} className="justify-center" />
        <span className="mx-auto mt-5 flex size-20 -rotate-3 items-center justify-center border-[3px] border-dashed border-border bg-[#e5e0d8]/50" style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}>
          <WifiOff className="size-9 text-foreground/60" />
        </span>
        <h1 className="mt-4 font-[family-name:var(--font-kalam)] text-4xl font-bold">you&apos;re offline!</h1>
        <p className="mt-1 font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/60">
          the pencils can&apos;t reach the cloud. check your connection.
        </p>
        <Button onClick={handleRefresh} className="mt-5 w-full" size="lg">
          <RefreshCw className="mr-2 size-4" /> try again
        </Button>
        <div className="mt-5 border-t-2 border-dashed border-border/40 pt-4 text-left font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/65">
          <p className="font-bold">meanwhile, you can still:</p>
          <ul className="mt-1.5 space-y-1">
            <li>✎ re-read loaded chats</li>
            <li>✎ browse your pals</li>
            <li>✎ admire the doodles</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
