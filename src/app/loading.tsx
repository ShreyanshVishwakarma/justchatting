import JustChattingLogo from "@/components/JustChattingLogo";

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "doodling…" }: LoadingProps) {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="flex flex-col items-center gap-4">
        <span>
          <JustChattingLogo size={52} />
        </span>
        <span className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff4d4d]" />
          <span className="size-2.5 rounded-full bg-[#2d5da1]" />
          <span className="size-2.5 rounded-full bg-[#2d2d2d]" />
        </span>
        <span className="border-2 border-dashed border-border/40 bg-white px-3 py-1 font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/60" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
          {message}
        </span>
      </div>
    </div>
  );
}
