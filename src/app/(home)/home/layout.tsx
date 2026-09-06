"use client";
import AuthHeader from "@/components/AuthHeader";
import { JustchatLockup, PaperDots } from "@/components/brand";

function SiteFooter() {
  return (
    <footer className="relative border-t-[3px] border-dashed border-border bg-white">
      <PaperDots className="opacity-60" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <JustchatLockup size={40} showTagline />
            <p className="mt-3 font-[family-name:var(--font-patrick-hand)] text-base text-foreground/70">
              fast, private chats with a hand-drawn heart. no straight lines —
              no snooping.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="font-[family-name:var(--font-kalam)] text-lg font-bold underline decoration-wavy decoration-[#ff4d4d] underline-offset-4">
                product
              </p>
              <ul className="mt-2 space-y-1.5 font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/70">
                <li><a href="#features" className="hover:text-foreground">features</a></li>
                <li><a href="#how" className="hover:text-foreground">how it works</a></li>
                <li><a href="#security" className="hover:text-foreground">security</a></li>
              </ul>
            </div>
            <div>
              <p className="font-[family-name:var(--font-kalam)] text-lg font-bold underline decoration-wavy decoration-[#2d5da1] underline-offset-4">
                friends
              </p>
              <ul className="mt-2 space-y-1.5 font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/70">
                <li><a href="#faq" className="hover:text-foreground">faq</a></li>
                <li><a href="/friends" className="hover:text-foreground">pals</a></li>
                <li><a href="/conversations" className="hover:text-foreground">chats</a></li>
              </ul>
            </div>
            <div>
              <p className="font-[family-name:var(--font-kalam)] text-lg font-bold underline decoration-wavy decoration-border underline-offset-4">
                fine print
              </p>
              <ul className="mt-2 space-y-1.5 font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/70">
                <li>you own your keys</li>
                <li>we can&apos;t read a thing</li>
                <li>made with a pencil</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t-2 border-dashed border-border/40 pt-5 sm:flex-row">
          <p className="font-[family-name:var(--font-patrick-hand)] text-base text-foreground/60">
            © 2026 justchat — just chatting, nothing else.
          </p>
          <p className="inline-flex items-center gap-2 font-[family-name:var(--font-patrick-hand)] text-base text-foreground/60">
            <span className="inline-block size-2.5 rotate-12 border-2 border-border bg-[#ff4d4d]" />
            sketched, not polished
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-foreground">
      <AuthHeader />
      <main className="min-h-screen">{children}</main>
      <SiteFooter />
    </div>
  );
}
