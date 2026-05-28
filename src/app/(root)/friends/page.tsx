import React from "react";
import { Users } from "lucide-react";

const FriendsPage = () => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-sm w-full">
        {/* Sketchy illustration */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Tape strip */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 w-12 h-4 bg-muted/80 border-[2px] border-border/30 rotate-[2deg] z-20" />
            <div
              className="w-24 h-24 bg-[#fdf8c1] border-[3px] border-border shadow-[4px_4px_0_0_#2d2d2d] flex items-center justify-center rotate-[-3deg]"
              style={{ borderRadius: "var(--radius-wobbly-sm)" }}
            >
              <Users className="w-12 h-12 text-foreground" strokeWidth={1.5} />
            </div>
            {/* Small accent square */}
            <div
              className="absolute -bottom-2 -right-3 w-8 h-8 bg-accent border-[3px] border-border shadow-[2px_2px_0_0_#2d2d2d] rotate-[10deg]"
              style={{ borderRadius: "var(--radius-wobbly-sm)" }}
            />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h2 className="font-[family-name:var(--font-kalam)] text-3xl font-bold text-foreground leading-tight">
            your pals
          </h2>
          <p className="font-[family-name:var(--font-patrick-hand)] text-lg text-muted-foreground leading-relaxed">
            manage friend requests, find new connections, and start
            conversations.
          </p>
        </div>

        {/* Hint note */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 border-[2px] border-dashed border-border/60 rotate-[-0.5deg]"
          style={{ borderRadius: "var(--radius-wobbly-sm)" }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
          <span className="font-[family-name:var(--font-patrick-hand)] text-base text-muted-foreground">
            ready to connect
          </span>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
