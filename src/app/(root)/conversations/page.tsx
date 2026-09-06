import React from "react";
import Link from "next/link";
import { MessageCircle, PenLine } from "lucide-react";
import { JustchatMark } from "@/components/brand";

export default function ConversationsPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center overflow-y-auto bg-[#fdfbf7] p-6 sm:p-8" style={{ backgroundImage: "radial-gradient(#e5e0d8 1px, transparent 1px)", backgroundSize: "18px 18px" }}>
      <div className="w-full max-w-sm">
        <div className="relative mx-auto size-36">
          <span aria-hidden="true" className="absolute left-1/2 top-0 z-20 h-5 w-14 -translate-x-1/2 -translate-y-2 rotate-[-4deg] border-x-2 border-dashed border-[#2d2d2d]/25 bg-[#2d2d2d]/10" />
          <span className="absolute inset-0 flex -rotate-3 flex-col items-center justify-center border-[3px] border-border bg-[#fdf8c1] shadow-[6px_6px_0_0_#2d2d2d]" style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}>
            <MessageCircle className="size-12" strokeWidth={1.75} />
            <JustchatMark size={34} className="absolute -bottom-3 -right-3 rotate-6 border-2 border-border bg-white" />
          </span>
          <span className="absolute -right-6 -top-4 flex size-13 rotate-12 items-center justify-center border-[3px] border-dashed border-border bg-white p-2.5 shadow-[3px_3px_0_0_#2d2d2d]" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
            <PenLine className="size-5 text-foreground/60" />
          </span>
          <span aria-hidden="true" className="absolute -bottom-2 -left-2 size-7 rotate-12 border-[3px] border-border bg-[#ff4d4d] shadow-[2px_2px_0_0_#2d2d2d]" style={{ borderRadius: "60% 40% 55% 45%" }} />
        </div>

        <div className="mt-6 text-center">
          <p className="inline-block rotate-1 border-[2.5px] border-border bg-white px-3 py-0.5 font-[family-name:var(--font-patrick-hand)] text-base font-bold shadow-[2px_2px_0_0_#2d2d2d]" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
            ✎ justchat inbox zero
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-kalam)] text-4xl font-bold leading-none">pick a chat!</h2>
          <p className="mt-1.5 font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/60">
            choose a pal on the left to start doodling words
          </p>
        </div>

        <div className="mt-5 space-y-2.5">
          {[
            { emoji: "⚡", title: "realtime", desc: "appears the second you hit send" },
            { emoji: "🔒", title: "private", desc: "scrambled before it leaves you" },
          ].map((item, i) => (
            <div key={item.title} className={`flex items-center gap-3 border-[2.5px] border-dashed border-border/70 bg-white p-3 shadow-[3px_3px_0_0_#2d2d2d] ${i % 2 ? "rotate-[0.6deg]" : "-rotate-[0.6deg]"}`} style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
              <span className="flex size-10 shrink-0 -rotate-3 items-center justify-center border-2 border-border bg-[#fdf8c1] text-lg" style={{ borderRadius: "60% 40% 55% 45%" }}>{item.emoji}</span>
              <span className="text-left">
                <span className="block font-[family-name:var(--font-kalam)] text-lg font-bold leading-tight">{item.title}</span>
                <span className="block font-[family-name:var(--font-patrick-hand)] text-base leading-snug text-foreground/60">{item.desc}</span>
              </span>
            </div>
          ))}
        </div>

        <p className="mt-5 border-2 border-dashed border-border/40 bg-white/70 p-3 text-center font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/60" style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}>
          💡 no pals yet? <Link href="/friends" className="font-bold text-foreground underline decoration-wavy decoration-[#ff4d4d] underline-offset-4">hop to pals</Link> to add some
        </p>
      </div>
    </div>
  );
}
