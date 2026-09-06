"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JustchatLockup } from "@/components/brand";

const NAV = [
  { label: "features", href: "#features" },
  { label: "how it works", href: "#how" },
  { label: "security", href: "#security" },
  { label: "faq", href: "#faq" },
];

export default function AuthHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-dashed border-border bg-[#fdfbf7]/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/home" aria-label="justchat home" className="shrink-0">
          <JustchatLockup size={38} showTagline />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="site">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/70 underline decoration-wavy decoration-[#ff4d4d]/60 decoration-2 underline-offset-4 transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Unauthenticated>
            <SignInButton mode="modal">
              <button
                className="hidden h-11 items-center border-[3px] border-border bg-white px-5 font-[family-name:var(--font-patrick-hand)] text-lg shadow-[3px_3px_0px_0px_#2d2d2d] hover:bg-[#e5e0d8] sm:inline-flex"
                style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}
              >
                log in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                className="inline-flex h-11 items-center gap-1.5 border-[3px] border-border bg-[#ffeb3b] px-5 font-[family-name:var(--font-kalam)] text-lg font-bold shadow-[3px_3px_0px_0px_#2d2d2d] hover:bg-[#ff4d4d] hover:text-white"
                style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
              >
                start chatting <ArrowRight className="size-4" strokeWidth={3} />
              </button>
            </SignUpButton>
          </Unauthenticated>
          <Authenticated>
            <Link
              href="/conversations"
              className="inline-flex h-11 items-center gap-1.5 border-[3px] border-border bg-[#ffeb3b] px-5 font-[family-name:var(--font-kalam)] text-lg font-bold shadow-[3px_3px_0px_0px_#2d2d2d] hover:bg-[#ff4d4d] hover:text-white"
              style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
            >
              open justchat <ArrowRight className="size-4" strokeWidth={3} />
            </Link>
            <span className="inline-flex items-center justify-center border-[3px] border-border bg-white p-1 shadow-[3px_3px_0px_0px_#2d2d2d]">
              <UserButton />
            </span>
          </Authenticated>
          <AuthLoading>
            <span className="flex items-center gap-1.5 border-[3px] border-dashed border-border/40 px-4 py-2 font-[family-name:var(--font-patrick-hand)] text-foreground/50">
              <span className="size-2 rounded-full bg-[#ff4d4d]" />
              <span className="size-2 rounded-full bg-[#2d5da1]" />
              <span className="size-2 rounded-full bg-[#2d2d2d]" />
              sketching…
            </span>
          </AuthLoading>
        </div>
      </div>
    </header>
  );
}
