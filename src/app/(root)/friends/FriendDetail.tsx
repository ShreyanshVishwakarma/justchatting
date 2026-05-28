"use client";

import React from "react";

type Props = {
  friendId: string | null;
  showPlaceholder?: boolean;
};

export default function FriendDetail({
  friendId,
  showPlaceholder = true,
}: Props) {
  if (!friendId) {
    if (!showPlaceholder) {
      // render an intentionally empty panel when we don't want the placeholder
      return <div className="h-full" />;
    }

    return (
      <div className="h-full flex items-center justify-center text-center p-8">
        <div className="max-w-xl w-full">
          <div
            className="w-24 h-24 bg-[#fff9c4] border-[3px] border-border shadow-[4px_4px_0_0_#2d2d2d] mx-auto mb-4"
            style={{ borderRadius: "var(--radius-wobbly-sm)" }}
          />
          <h3 className="font-[family-name:var(--font-kalam)] text-2xl font-bold">
            Select a pal
          </h3>
          <p className="font-[family-name:var(--font-patrick-hand)] text-lg text-muted-foreground mt-2">
            Choose a friend to see details, recent messages and quick actions.
          </p>
        </div>
      </div>
    );
  }

  // Minimal detailed view — can be expanded later to show activity, shared media, etc.
  return (
    <div className="h-full p-6">
      <div
        className="bg-white border-[3px] border-border shadow-[6px_6px_0_0_#2d2d2d] p-6"
        style={{ borderRadius: "var(--radius-wobbly)" }}
      >
        <h2 className="font-[family-name:var(--font-kalam)] text-2xl font-bold mb-2">
          Friend
        </h2>
        <p className="text-muted-foreground">
          Detail panel for friend id: {friendId}
        </p>
      </div>
    </div>
  );
}
