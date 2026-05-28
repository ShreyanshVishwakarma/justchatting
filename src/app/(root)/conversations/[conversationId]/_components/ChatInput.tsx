"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Mic, Smile } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type ChatInputProps = {
  handleSubmit: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
};

const ChatInput = ({
  handleSubmit,
  isLoading = false,
  placeholder = "say something...",
  maxLength = 1000,
  disabled = false,
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState(40);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.min(Math.max(scrollHeight, 40), 120);
      setTextareaHeight(newHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading || disabled) return;
    handleSubmit(message.trim());
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        const scrollHeight = textareaRef.current.scrollHeight;
        const newHeight = Math.min(Math.max(scrollHeight, 40), 120);
        setTextareaHeight(newHeight);
        textareaRef.current.style.height = `${newHeight}px`;
      }
    }
  };

  const isMessageEmpty = !message.trim();
  const characterCount = message.length;
  const isNearLimit = characterCount > maxLength * 0.8;

  return (
    <div className="relative border-t-[3px] border-dashed border-border bg-background/95 px-3 py-3">
      {/* Character counter */}
      {isNearLimit && (
        <div className="absolute -top-6 right-4 font-[family-name:var(--font-patrick-hand)] text-sm text-muted-foreground bg-background px-1">
          {characterCount}/{maxLength}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div
          className={cn(
            "flex items-end gap-2 px-2 py-2 bg-white border-[3px] border-border transition-all duration-200",
            isFocused
              ? "shadow-[2px_2px_0_0_#2d2d2d] translate-x-[2px] translate-y-[2px]"
              : "shadow-[4px_4px_0_0_#2d2d2d]",
          )}
          style={{ borderRadius: "var(--radius-wobbly)" }}
        >
          {/* Attachment */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 flex-shrink-0 border-[2px] border-dashed border-transparent hover:border-border/60 hover:bg-muted/40 transition-all"
            style={{ borderRadius: "var(--radius-wobbly-sm)" }}
            disabled={disabled}
          >
            <Paperclip className="h-4 w-4 text-muted-foreground" />
          </Button>

          {/* Textarea */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              placeholder={placeholder}
              className={cn(
                "min-h-[40px] max-h-[120px] resize-none border-0 bg-transparent px-2 py-2 text-sm leading-6 font-[family-name:var(--font-patrick-hand)] placeholder:text-muted-foreground/70 placeholder:font-[family-name:var(--font-patrick-hand)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200",
                isLoading && "opacity-50",
              )}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled || isLoading}
              style={{ height: `${textareaHeight}px` }}
              rows={1}
            />
          </div>

          {/* Emoji */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 flex-shrink-0 border-[2px] border-dashed border-transparent hover:border-border/60 hover:bg-muted/40 transition-all"
            style={{ borderRadius: "var(--radius-wobbly-sm)" }}
            disabled={disabled}
          >
            <Smile className="h-4 w-4 text-muted-foreground" />
          </Button>

          {/* Send / Voice */}
          {isMessageEmpty ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 flex-shrink-0 border-[2px] border-dashed border-transparent hover:border-border/60 hover:bg-muted/40 transition-all"
              style={{ borderRadius: "var(--radius-wobbly-sm)" }}
              disabled={disabled}
            >
              <Mic className="h-4 w-4 text-muted-foreground" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              onClick={onSubmit}
              className={cn(
                "h-9 w-9 flex-shrink-0 bg-[#ffeb3b] text-foreground border-[3px] border-border shadow-[3px_3px_0_0_#2d2d2d] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#2d2d2d] active:shadow-none active:translate-y-0 transition-all duration-200 rotate-[-2deg] hover:rotate-0",
                isLoading && "opacity-50 cursor-not-allowed",
              )}
              style={{ borderRadius: "var(--radius-wobbly-sm)" }}
              disabled={isMessageEmpty || isLoading || disabled}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
