import React from "react";
import { cn } from "@/lib/utils";
import JustChattingLogo from "@/components/JustChattingLogo";

/* ————————————————————————————————————————————————
   justchat · central brand system
   Single source of truth for logo, wordmark, doodle
   decorations. Reuses the doodle theme tokens:
   paper #fdfbf7 · ink #2d2d2d · marker red #ff4d4d
   ballpoint #2d5da1 · post-it #fdf8c1 · erased #e5e0d8
———————————————————————————————————————————————— */

export const BRAND = {
  name: "justchat",
  tagline: "doodles 'n chats",
  description:
    "justchat is a fast, end-to-end encrypted chat app with a hand-drawn heart. no straight lines, no snooping — just chatting.",
  colors: {
    paper: "#fdfbf7",
    ink: "#2d2d2d",
    marker: "#ff4d4d",
    ballpoint: "#2d5da1",
    postit: "#fdf8c1",
    highlight: "#ffeb3b",
    erased: "#e5e0d8",
  },
} as const;

export const WOBBLY =
  "255px 15px 225px 15px / 15px 225px 15px 255px";
export const WOBBLY_SM =
  "20px 255px 15px 225px / 255px 15px 225px 15px";

/* ——— Logo lockup: favicon bubble + lowercase wordmark ——— */

export function JustchatMark({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex shrink-0 rotate-[-4deg]", className)}
      aria-hidden="true"
    >
      <JustChattingLogo size={size} />
    </span>
  );
}

export function JustchatLockup({
  size = 40,
  showTagline = false,
  dark = false,
  className,
  wordmarkClassName,
}: {
  size?: number;
  showTagline?: boolean;
  dark?: boolean;
  className?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("group flex items-center gap-2.5", className)}>
      <span>
        <JustChattingLogo size={size} />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-[family-name:var(--font-kalam)] font-bold tracking-tight",
            size >= 44 ? "text-3xl" : size >= 32 ? "text-2xl" : "text-xl",
            dark ? "text-white" : "text-foreground",
            wordmarkClassName
          )}
        >
          justchat
          <span className="text-[#ff4d4d]">.</span>
        </span>
        {showTagline && (
          <span className="font-[family-name:var(--font-patrick-hand)] text-sm text-foreground/60 -mt-0.5">
            {BRAND.tagline}
          </span>
        )}
      </span>
    </span>
  );
}

/* ——— Sticky-note section tag ——— */

export function DoodleTag({
  children,
  color = "postit",
  rotate = "-rotate-2",
  className,
}: {
  children: React.ReactNode;
  color?: "postit" | "white" | "red" | "blue";
  rotate?: string;
  className?: string;
}) {
  const bg =
    color === "postit"
      ? "bg-[#fdf8c1]"
      : color === "red"
        ? "bg-[#ff4d4d] text-white border-[#ff4d4d]"
        : color === "blue"
          ? "bg-[#2d5da1] text-white border-[#2d5da1]"
          : "bg-white";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border-[3px] border-border px-3 py-1",
        "font-[family-name:var(--font-patrick-hand)] text-base font-bold",
        "shadow-[3px_3px_0px_0px_#2d2d2d]",
        rotate,
        bg,
        className
      )}
      style={{ borderRadius: WOBBLY_SM }}
    >
      {children}
    </span>
  );
}

/* ——— Translucent tape strip ——— */

export function TapeStrip({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute left-1/2 top-0 h-5 w-16 -translate-x-1/2 -translate-y-1/2 rotate-[-5deg]",
        "bg-[#2d2d2d]/10 border-x-2 border-dashed border-[#2d2d2d]/20",
        className
      )}
    />
  );
}

/* ——— Wavy hand-drawn underline ——— */

export function Squiggle({
  className,
  color = "#ff4d4d",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 12"
      aria-hidden="true"
      className={cn("h-3 w-28", className)}
    >
      <path
        d="M2 8 Q 12 2, 24 7 T 46 7 T 68 7 T 90 7 T 118 6"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ——— Section heading: tag + title + squiggle ——— */

export function DoodleHeading({
  tag,
  title,
  description,
  align = "center",
  className,
}: {
  tag: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div className={cn(centered && "text-center", className)}>
      <DoodleTag>{tag}</DoodleTag>
      <h2 className="mt-4 font-[family-name:var(--font-kalam)] text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight">
        {title}
      </h2>
      <Squiggle
        className={cn("mt-2", centered ? "mx-auto" : "mx-0")}
      />
      {description && (
        <p className="mx-auto mt-4 max-w-2xl font-[family-name:var(--font-patrick-hand)] text-lg md:text-xl text-foreground/75">
          {description}
        </p>
      )}
    </div>
  );
}

/* ——— Paper-dot backdrop used behind hero / app shell ——— */

export function PaperDots({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: "radial-gradient(#e5e0d8 1.2px, transparent 1.2px)",
        backgroundSize: "22px 22px",
      }}
    />
  );
}
