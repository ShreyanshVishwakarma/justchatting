import React from "react";
import { MessageSquare, PenLine } from "lucide-react";
import Link from "next/link";

export default function ConversationsPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-background select-none">
      <div className="max-w-md w-full space-y-8">
        {/* Sketchy illustration cluster */}
        <div className="flex justify-center">
          <div className="relative w-40 h-40">
            {/* Tape strip */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 w-14 h-5 bg-muted/80 border-[2px] border-border/30 rotate-[-3deg] z-20 shadow-sm" />

            {/* Main sticky note */}
            <div
              className="absolute inset-0 bg-[#fdf8c1] border-[3px] border-border shadow-[5px_5px_0_0_#2d2d2d] flex flex-col items-center justify-center rotate-[-3deg]"
              style={{ borderRadius: "var(--radius-wobbly-sm)" }}
            >
              <MessageSquare
                className="w-14 h-14 text-foreground"
                strokeWidth={1.5}
              />
            </div>

            {/* Floating dashed note — top right */}
            <div
              className="absolute -top-5 -right-7 w-14 h-14 bg-white border-[3px] border-dashed border-border shadow-[2px_2px_0_0_#2d2d2d] flex items-center justify-center rotate-[10deg] z-30"
              style={{ borderRadius: "var(--radius-wobbly-sm)" }}
            >
              <PenLine
                className="w-6 h-6 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>

            {/* Red accent scrap — bottom left */}
            <div
              className="absolute -bottom-3 -left-3 w-8 h-8 bg-accent border-[3px] border-border shadow-[2px_2px_0_0_#2d2d2d] rotate-[12deg] z-10"
              style={{ borderRadius: "var(--radius-wobbly-sm)" }}
            />
          </div>
        </div>

        {/* Main heading */}
        <div className="text-center space-y-2 pt-4">
          <h2 className="font-[family-name:var(--font-kalam)] text-3xl font-bold text-foreground leading-tight">
            pick a chat!
          </h2>
          <p className="font-[family-name:var(--font-patrick-hand)] text-lg text-muted-foreground">
            select a conversation on the left to start messaging
          </p>
        </div>

        {/* Sketchy feature hints */}
        <div className="space-y-3">
          {[
            {
              emoji: "⚡",
              title: "Real-time",
              desc: "messages appear the moment you hit send",
            },
            {
              emoji: "✍️",
              title: "Just type",
              desc: "no accounts to verify again, no fuss",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 p-4 bg-white border-[3px] border-dashed border-border shadow-[3px_3px_0_0_#2d2d2d] ${i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"}`}
              style={{ borderRadius: "var(--radius-wobbly)" }}
            >
              <div
                className="w-10 h-10 bg-[#fdf8c1] border-[3px] border-border shadow-[2px_2px_0_0_#2d2d2d] flex items-center justify-center text-lg flex-shrink-0 rotate-[-3deg]"
                style={{ borderRadius: "var(--radius-wobbly-sm)" }}
              >
                {item.emoji}
              </div>
              <div className="text-left">
                <h3 className="font-[family-name:var(--font-kalam)] font-bold text-lg text-foreground leading-tight">
                  {item.title}
                </h3>
                <p className="font-[family-name:var(--font-patrick-hand)] text-base text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom sticky hint */}
        <div
          className="p-3 border-[2px] border-dashed border-border/60 text-center rotate-[0.4deg]"
          style={{ borderRadius: "var(--radius-wobbly-sm)" }}
        >
          <p className="font-[family-name:var(--font-patrick-hand)] text-base text-muted-foreground/80">
            💡 no friends yet?{" "}
            <Link
              href="/friends"
              className="font-bold text-foreground underline decoration-dashed decoration-border hover:text-accent transition-colors"
            >
              head to Pals
            </Link>{" "}
            to add some
          </p>
        </div>
      </div>
    </div>
  );
}
