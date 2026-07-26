"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
  placeholder = "Write a message…",
  maxLength = 1000,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 44), 140)}px`;
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

  return (
    <div className="border-t border-border bg-card px-4 py-3 sm:px-6">
      <form onSubmit={onSubmit} className="mx-auto flex max-w-4xl items-end gap-3">
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
          className="min-h-11 max-h-35 resize-none border-2 border-border bg-background px-3 py-2 text-base shadow-none focus-visible:ring-2"
        />
        <Button type="submit" size="icon" disabled={!message.trim() || disabled || isLoading} aria-label="Send message">
          <Send className="size-5" />
        </Button>
      </form>
      {!disabled && <p className="mx-auto mt-2 max-w-4xl text-xs text-muted-foreground">Press Enter to send, Shift + Enter for a new line</p>}
    </div>
  );
}
