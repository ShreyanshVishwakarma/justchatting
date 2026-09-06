"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { SignUpButton } from "@clerk/nextjs";
import {
  ArrowRight,
  Check,
  Eye,
  Heart,
  KeyRound,
  Lock,
  MessageCircle,
  Pencil,
  Send,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DoodleHeading,
  DoodleTag,
  JustchatMark,
  PaperDots,
  Squiggle,
  TapeStrip,
} from "@/components/brand";

/* ————— data ————— */

const FEATURES = [
  {
    icon: Shield,
    title: "scrambled by default",
    body: "every message is encrypted before it leaves your device. the server only ever sees gibberish.",
    bg: "bg-white",
    rotate: "-rotate-1",
    tape: true,
  },
  {
    icon: Zap,
    title: "stupidly fast",
    body: "local-first storage means chats open instantly. no spinners, no staring at skeletons.",
    bg: "bg-[#fdf8c1]",
    rotate: "rotate-1",
    tape: false,
  },
  {
    icon: KeyRound,
    title: "you hold the keys",
    body: "a seed phrase unlocks your identity on any device. lose it and even we can't peek — that's the point.",
    bg: "bg-white",
    rotate: "-rotate-2",
    tape: false,
  },
  {
    icon: Users,
    title: "pals, not contacts",
    body: "add friends by email, accept the doodle-stamped request, and you're chatting. no phone numbers.",
    bg: "bg-white",
    rotate: "rotate-2",
    tape: false,
  },
  {
    icon: Eye,
    title: "zero snooping",
    body: "no trackers, no ad profile, no “we value your privacy” banner that lies. justchat can't read a thing.",
    bg: "bg-[#fdf8c1]",
    rotate: "-rotate-1",
    tape: true,
  },
  {
    icon: Heart,
    title: "human, not corporate",
    body: "wobbly borders, marker smudges and all. chatting should feel like passing notes, not filing tickets.",
    bg: "bg-white",
    rotate: "rotate-1",
    tape: false,
  },
];

const STEPS = [
  {
    n: "1",
    title: "make your mark",
    body: "sign up, save your 12-word seed doodle, and your keys are born on your device.",
    emoji: "✏️",
  },
  {
    n: "2",
    title: "collect some pals",
    body: "send a request by email. they accept, a private chat appears. that's the whole ceremony.",
    emoji: "💌",
  },
  {
    n: "3",
    title: "justchat away",
    body: "type, send, grin. everything syncs encrypted and stays lightning fast offline too.",
    emoji: "💬",
  },
];

const FAQS = [
  {
    q: "how secure is this, really?",
    a: "messages are encrypted on your device with keys only you hold. the server stores scrambled blobs — useful to exactly nobody but you and your pal.",
  },
  {
    q: "is it actually free?",
    a: "yep. private 1:1 chats are free. privacy shouldn't cost an arm and a leg (just a pencil).",
  },
  {
    q: "what does local-first mean?",
    a: "your chat history lives in your browser first (IndexedDB), so it opens instantly and works offline. the cloud is just a synced backup.",
  },
  {
    q: "can anyone read my messages?",
    a: "no — not us, not your ISP, not a curious database admin. without your seed phrase the data is just noise.",
  },
];

/* ————— small pieces ————— */

function ChatMock() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* bouncing doodle star */}
      <div
        aria-hidden="true"
        className="absolute -left-6 -top-6 hidden size-14 items-center justify-center border-[3px] border-border bg-[#ff4d4d] text-white shadow-[3px_3px_0_0_#2d2d2d] md:flex"
        style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
      >
        <Sparkles className="size-6" strokeWidth={2.5} />
      </div>
      {/* hand arrow */}
      <svg
        viewBox="0 0 120 60"
        aria-hidden="true"
        className="absolute -left-24 top-10 hidden w-24 -rotate-12 lg:block"
      >
        <path
          d="M110 8 C 70 10, 40 20, 12 44 M12 44 l14 -4 M12 44 l4 -14"
          fill="none"
          stroke="#2d2d2d"
          strokeWidth="3"
          strokeDasharray="7 6"
          strokeLinecap="round"
        />
        <text x="18" y="18" fontSize="13" fill="#2d2d2d" fontFamily="Patrick Hand">
          try me!
        </text>
      </svg>

      <div
        className="relative rotate-2 border-4 border-border bg-white shadow-[10px_10px_0px_0px_#2d2d2d]"
        style={{ borderRadius: "255px 18px 225px 18px / 18px 225px 18px 255px" }}
      >
        <TapeStrip />
        <div className="flex items-center justify-between border-b-[3px] border-border bg-[#e5e0d8]/60 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="size-3.5 border-2 border-border bg-[#ff4d4d]" style={{ borderRadius: "60% 40% 55% 45%" }} />
            <span className="size-3.5 border-2 border-border bg-[#ffeb3b]" style={{ borderRadius: "45% 55% 40% 60%" }} />
            <span className="size-3.5 border-2 border-border bg-green-400" style={{ borderRadius: "55% 45% 60% 40%" }} />
          </div>
          <p className="flex items-center gap-1.5 font-[family-name:var(--font-kalam)] text-base font-bold">
            <JustchatMark size={20} /> just a chat…
          </p>
        </div>

        <div
          className="flex h-64 flex-col gap-3 overflow-hidden p-5"
          style={{
            backgroundImage: "radial-gradient(#e5e0d8 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        >
          <div className="max-w-[82%] -rotate-1 self-start border-2 border-border bg-white p-3 shadow-[3px_3px_0_0_#2d2d2d]" style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}>
            <p className="font-[family-name:var(--font-patrick-hand)] text-lg leading-snug">psst… look, no straight lines anywhere 👀</p>
          </div>
          <div className="max-w-[82%] rotate-1 self-end border-2 border-border bg-[#fdf8c1] p-3 shadow-[3px_3px_0_0_#2d2d2d]" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
            <p className="font-[family-name:var(--font-patrick-hand)] text-lg leading-snug">and nobody can read this but us 🔒</p>
          </div>
          <div className="max-w-[70%] -rotate-2 self-start border-2 border-border bg-white p-3 shadow-[3px_3px_0_0_#2d2d2d]" style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}>
            <p className="flex items-center gap-1.5 font-[family-name:var(--font-patrick-hand)] text-lg">
              <span className="flex gap-1">
                <span className="size-2 rounded-full bg-foreground" />
                <span className="size-2 rounded-full bg-foreground" />
                <span className="size-2 rounded-full bg-foreground" />
              </span>
              typing…
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t-[3px] border-border bg-white p-3">
          <div className="flex flex-1 items-center border-2 border-dashed border-border/60 bg-[#fdfbf7] px-4 py-2.5 font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/40">
            say something nice…
          </div>
          <span className="flex size-11 items-center justify-center border-2 border-border bg-[#ff4d4d] text-white shadow-[2px_2px_0_0_#2d2d2d]">
            <Send className="size-5" strokeWidth={2.5} />
          </span>
        </div>
      </div>

      <div className="mx-auto mt-4 inline-flex -rotate-1 items-center gap-2 border-2 border-dashed border-border/50 bg-white/80 px-3 py-1.5 font-[family-name:var(--font-patrick-hand)] text-base text-foreground/70">
        <Lock className="size-4" /> end-to-end encrypted · local-first
      </div>
    </div>
  );
}

function RedirectToConversations() {
  const router = useRouter();
  useEffect(() => {
    router.push("/conversations");
  }, [router]);
  return (
    <div className="flex h-64 items-center justify-center">
      <p className="flex items-center gap-2 font-[family-name:var(--font-kalam)] text-2xl font-bold">
        <Pencil className="size-6" /> flipping to your chats…
      </p>
    </div>
  );
}

/* ————— page ————— */

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-[#fdfbf7] selection:bg-[#ff4d4d] selection:text-white">
      <AuthLoading>
        <div className="flex h-[60vh] items-center justify-center">
          <p className="flex flex-col items-center gap-3 font-[family-name:var(--font-kalam)] text-2xl font-bold">
            <JustchatMark size={56} />
            sharpening pencils…
          </p>
        </div>
      </AuthLoading>

      <Unauthenticated>
        {/* HERO */}
        <section className="relative">
          <PaperDots />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-14 sm:px-6 md:pt-20 lg:grid-cols-2 lg:items-center lg:pb-24">
            <div className="text-center lg:text-left">
              <DoodleTag>✏️ v2.0 — the hand-drawn edition</DoodleTag>
              <h1 className="mt-5 font-[family-name:var(--font-kalam)] text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                scribble less,
                <br />
                <span className="relative inline-block text-[#ff4d4d]">
                  justchat
                  <Squiggle className="absolute -bottom-2 left-0 w-full" />
                </span>{" "}
                more.
              </h1>
              <p className="mx-auto mt-6 max-w-xl border-2 border-dashed border-border/30 bg-white/70 p-3 font-[family-name:var(--font-patrick-hand)] text-xl leading-relaxed text-foreground/80 lg:mx-0">
                fast, private 1:1 chats with a hand-drawn heart. encrypted on
                your device, stored locally first — so it feels like passing
                notes, not filing tickets.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <SignUpButton mode="modal">
                  <button className="inline-flex h-14 items-center justify-center gap-2 border-[3px] border-border bg-[#ff4d4d] px-8 font-[family-name:var(--font-kalam)] text-xl font-bold text-white shadow-[5px_5px_0px_0px_#2d2d2d] hover:bg-[#2d2d2d]" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                    get started — it&apos;s free <ArrowRight className="size-5" strokeWidth={3} />
                  </button>
                </SignUpButton>
                <a
                  href="#security"
                  className="inline-flex h-14 items-center justify-center gap-2 border-[3px] border-border bg-white px-8 font-[family-name:var(--font-patrick-hand)] text-xl shadow-[5px_5px_0px_0px_#2d2d2d] hover:bg-[#e5e0d8]"
                  style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}
                >
                  <Lock className="size-5" /> how we keep secrets
                </a>
              </div>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start">
                {[
                  { icon: Shield, label: "end-to-end encrypted" },
                  { icon: Zap, label: "local-first + instant" },
                  { icon: Users, label: "pals by email" },
                ].map((s) => (
                  <span key={s.label} className="inline-flex items-center gap-1.5 font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/70">
                    <s.icon className="size-4" strokeWidth={2.5} /> {s.label}
                  </span>
                ))}
              </div>
            </div>
            <ChatMock />
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
          <DoodleHeading
            tag="📌 why it's kinda awesome"
            title={<>serious privacy, silly drawings.</>}
            description="everything a grown-up chat app does — minus the surveillance capitalism and the boring rectangles."
          />
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className={`relative border-[3px] border-border ${f.bg} p-6 shadow-[6px_6px_0px_0px_#2d2d2d] ${f.rotate}`}
                style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
              >
                {f.tape && <TapeStrip />}
                <span className="inline-flex size-13 items-center justify-center border-[3px] border-border bg-white p-2.5 shadow-[3px_3px_0_0_#2d2d2d]" style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}>
                  <f.icon className="size-6" strokeWidth={2.5} />
                </span>
                <h3 className="mt-4 font-[family-name:var(--font-kalam)] text-2xl font-bold">{f.title}</h3>
                <p className="mt-1.5 font-[family-name:var(--font-patrick-hand)] text-lg leading-relaxed text-foreground/75">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* HOW */}
        <section id="how" className="scroll-mt-24 border-y-[3px] border-dashed border-border bg-[#e5e0d8]/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <DoodleHeading
              tag="🗺️ how it works"
              title={<>three scribbles to chatting.</>}
              description="no manuals, no 40-minute onboarding videos. if you can doodle a smiley, you can use justchat."
            />
            <div className="relative mt-12 grid gap-7 md:grid-cols-3">
              <svg viewBox="0 0 600 40" aria-hidden="true" className="absolute -top-6 left-[12%] hidden w-[76%] md:block">
                <path d="M10 28 Q 150 4, 300 24 T 590 18" fill="none" stroke="#2d2d2d" strokeWidth="3" strokeDasharray="9 8" strokeLinecap="round" />
              </svg>
              {STEPS.map((s, i) => (
                <article
                  key={s.n}
                  className={`relative border-[3px] border-border bg-white p-6 text-center shadow-[5px_5px_0px_0px_#2d2d2d] ${i === 1 ? "md:-translate-y-3 rotate-1" : i === 0 ? "-rotate-1" : "-rotate-2 md:translate-y-2"}`}
                  style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}
                >
                  <span className="absolute -top-5 left-1/2 flex size-10 -translate-x-1/2 -rotate-6 items-center justify-center border-[3px] border-border bg-[#ffeb3b] font-[family-name:var(--font-kalam)] text-xl font-bold shadow-[2px_2px_0_0_#2d2d2d]" style={{ borderRadius: "60% 40% 55% 45% / 50% 55% 45% 50%" }}>
                    {s.n}
                  </span>
                  <span className="mt-2 inline-block text-4xl">{s.emoji}</span>
                  <h3 className="mt-2 font-[family-name:var(--font-kalam)] text-2xl font-bold">{s.title}</h3>
                  <p className="mt-1.5 font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/75">{s.body}</p>
                </article>
              ))}
            </div>
            <div className="mt-10 text-center">
              <SignUpButton mode="modal">
                <button className="inline-flex h-13 items-center gap-2 border-[3px] border-border bg-[#2d2d2d] px-8 py-3 font-[family-name:var(--font-kalam)] text-xl font-bold text-white shadow-[5px_5px_0px_0px_#ff4d4d] hover:bg-[#ff4d4d]" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                try step 1 right now <ArrowRight className="size-5" strokeWidth={3} />
                </button>
              </SignUpButton>
            </div>
          </div>
        </section>

        {/* SECURITY */}
        <section id="security" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
          <div className="grid items-stretch gap-8 lg:grid-cols-2">
            <div className="flex flex-col justify-center">
              <DoodleTag color="red">🔒 security, minus the jargon</DoodleTag>
              <h2 className="mt-4 font-[family-name:var(--font-kalam)] text-4xl font-bold leading-tight md:text-5xl">
                we literally <span className="underline decoration-wavy decoration-[#ff4d4d] underline-offset-4">can&apos;t</span> read your chats.
              </h2>
              <p className="mt-4 font-[family-name:var(--font-patrick-hand)] text-xl text-foreground/75">
                keys are born on your device and locked with your seed phrase.
                justchat servers hold scrambled blobs — great for syncing,
                useless for snooping.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "encrypted before it leaves your keyboard",
                  "seed phrase recovery — no passwords on our servers",
                  "local-first: yours even when offline",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 border-2 border-dashed border-border/50 bg-white px-4 py-2.5 font-[family-name:var(--font-patrick-hand)] text-lg" style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}>
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center border-2 border-border bg-green-400"><Check className="size-4" strokeWidth={3.5} /></span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rotate-1 border-[3px] border-border bg-[#2d2d2d] p-6 text-white shadow-[8px_8px_0px_0px_#ff4d4d] sm:p-8" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
              <TapeStrip />
              <p className="font-[family-name:var(--font-patrick-hand)] text-lg text-white/60">your seed doodle looks like…</p>
              <p className="mt-2 border-2 border-dashed border-white/30 bg-white/5 p-4 font-mono text-base leading-relaxed text-[#ffeb3b]">
                pencil · comet · teacup · giraffe · louder · blanket · rocket ·
                marble · noodle · lantern · pickle · sunset
              </p>
              <div className="mt-4 flex items-center gap-2 font-[family-name:var(--font-patrick-hand)] text-lg text-white/80">
                <MessageCircle className="size-5" /> keep it offline. keep it secret. keep chatting.
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {["AES-GCM", "ECDH", "IndexedDB", "realtime sync"].map((chip) => (
                  <span key={chip} className="border-2 border-white/40 px-3 py-1 font-[family-name:var(--font-patrick-hand)] text-base" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-4xl scroll-mt-24 px-4 py-16 sm:px-6">
          <DoodleHeading
            tag="❓ frequently scribbled questions"
            title={<>asked, answered, doodled.</>}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {FAQS.map((f, i) => (
              <article key={f.q} className={`border-[3px] border-border bg-white p-5 shadow-[4px_4px_0px_0px_#2d2d2d] ${i % 2 ? "rotate-1" : "-rotate-1"}`} style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}>
                <h3 className="flex items-start gap-2 font-[family-name:var(--font-kalam)] text-xl font-bold leading-snug">
                  <span className="text-[#ff4d4d]">Q:</span> {f.q}
                </h3>
                <p className="mt-2 border-t-2 border-dashed border-border/30 pt-2 font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/75">{f.a}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
          <div className="relative -rotate-1 border-4 border-border bg-[#ff4d4d] p-8 text-center text-white shadow-[10px_10px_0px_0px_#2d2d2d] sm:p-12" style={{ borderRadius: "255px 20px 225px 20px / 20px 225px 20px 255px" }}>
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 rotate-3 border-[3px] border-border bg-white px-4 py-1 font-[family-name:var(--font-patrick-hand)] font-bold text-foreground shadow-[3px_3px_0_0_#2d2d2d]" style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}>
              ✏️ no credit card, no nonsense
            </div>
            <JustchatMark size={64} className="mx-auto mt-2 bg-white p-1" />
            <h2 className="mx-auto mt-3 max-w-xl font-[family-name:var(--font-kalam)] text-4xl font-bold leading-tight md:text-5xl">
              ready to ditch the boring chat apps?
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-[family-name:var(--font-patrick-hand)] text-xl text-white/90">
              grab a pencil, bring a pal, and justchat. your first doodle is 30
              seconds away.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <SignUpButton mode="modal">
                <button className="inline-flex h-14 items-center gap-2 border-[3px] border-border bg-white px-10 font-[family-name:var(--font-kalam)] text-2xl font-bold text-foreground shadow-[5px_5px_0px_0px_#2d2d2d] hover:bg-[#ffeb3b]" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                  start chatting now
                </button>
              </SignUpButton>
            </div>
            <p className="mt-4 font-[family-name:var(--font-patrick-hand)] text-lg text-white/80">
              free forever for pals · your keys, your chats
            </p>
          </div>
        </section>
      </Unauthenticated>

      <Authenticated>
        <RedirectToConversations />
      </Authenticated>
    </div>
  );
}
