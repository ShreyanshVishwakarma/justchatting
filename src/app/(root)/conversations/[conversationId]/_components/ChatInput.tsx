"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import { LockKeyhole, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ChatInputProps = {
  handleSubmit: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
};

export default function ChatInput({
  handleSubmit,
  isLoading = false,
  placeholder = "scribble something…",
  maxLength = 1000,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 48), 140)}px`;
  }, [message]);

  const submit = () => {
    const content = message.trim();
    if (!content || disabled || isLoading) return;
    handleSubmit(content);
    setMessage("");
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submit();
  };

  const canSend = message.trim().length > 0 && !disabled && !isLoading;

  return (
    <div className="shrink-0 border-t-[3px] border-dashed border-border bg-white px-3 pb-3 pt-2.5 sm:px-5">
      {disabled ? (
        <p className="mx-auto mb-2 flex max-w-3xl items-center justify-center gap-2 border-[2.5px] border-[#ff4d4d] bg-[#ff4d4d]/10 px-3 py-2 text-center font-[family-name:var(--font-patrick-hand)] text-lg text-[#ff4d4d]" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
          <LockKeyhole className="size-4 shrink-0" /> key missing — recover your seed doodle to keep chatting
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="mx-auto flex max-w-3xl items-end gap-2.5">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(event) => setMessage(event.target.value.slice(0, maxLength))}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            rows={1}
            aria-label="message"
            className={cn(
              "max-h-35 min-h-12 resize-none border-[3px] border-border bg-[#fdfbf7] px-4 py-3 font-[family-name:var(--font-patrick-hand)] text-lg shadow-[3px_3px_0px_0px_#2d2d2d] placeholder:text-foreground/35 focus-visible:border-[#2d5da1]"
            )}
            style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}
          />
          {message.length > maxLength - 120 && (
            <span className="absolute -top-2 right-4 border-2 border-border bg-white px-2 font-[family-name:var(--font-patrick-hand)] text-xs text-foreground/60" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
              {message.length}/{maxLength}
            </span>
          )}
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={!canSend}
          aria-label="send message"
            className={cn(
              "size-13 shrink-0 border-[3px] !p-0",
              canSend
                ? "rotate-2 bg-[#ff4d4d] text-white hover:bg-[#2d2d2d]"
                : "-rotate-2 bg-[#e5e0d8] text-foreground/40"
            )}
          style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}
        >
          <SendHorizontal className="size-6" strokeWidth={2.5} />
        </Button>
      </form>
      {!disabled && (
        <p className="mx-auto mt-1.5 max-w-3xl text-center font-[family-name:var(--font-patrick-hand)] text-sm text-foreground/45 sm:text-left">
          enter ↵ to send · shift + enter for a new line · justchat encrypts it first
        </p>
      )}
    </div>
  );
}
