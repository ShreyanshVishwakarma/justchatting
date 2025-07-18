"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, Mic, Smile } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

type ChatInputProps = {
  handleSubmit: (message: string) => void
  isLoading?: boolean
  placeholder?: string
  maxLength?: number
  disabled?: boolean
}

const ChatInput = ({
  handleSubmit,
  isLoading = false,
  placeholder = "Type a message...",
  maxLength = 1000,
  disabled = false,
}: ChatInputProps) => {
  const [message, setMessage] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [textareaHeight, setTextareaHeight] = useState(40)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px"
      const scrollHeight = textareaRef.current.scrollHeight
      const newHeight = Math.min(Math.max(scrollHeight, 40), 120) // Min 40px, max 120px
      setTextareaHeight(newHeight)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }, [message])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading || disabled) return
    handleSubmit(message.trim())
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= maxLength) {
      setMessage(value)
    }
  }

  const isMessageEmpty = !message.trim()
  const characterCount = message.length
  const isNearLimit = characterCount > maxLength * 0.8

  return (
    <div className="relative">
      {/* Character counter */}
      {isNearLimit && (
        <div className="absolute -top-6 right-2 text-xs text-muted-foreground">
          {characterCount}/{maxLength}
        </div>
      )}

      <div
        className={cn(
          "flex items-end gap-2 p-3 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200",
          isFocused && "border-primary/20 bg-background",
        )}
      >
        {/* Attachment button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          disabled={disabled}
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* Input container */}
        <div className="flex-1 relative">
          <form onSubmit={onSubmit} className="relative">
            <Textarea
              ref={textareaRef}
              placeholder={placeholder}
              className={cn(
                "min-h-[40px] max-h-[120px] resize-none rounded-2xl border-0 bg-muted/50 px-4 py-2 pr-12 text-sm leading-6 placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:bg-background transition-all duration-200",
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

            {/* Emoji button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              disabled={disabled}
            >
              <Smile className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Send/Voice button */}
        {isMessageEmpty ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            disabled={disabled}
          >
            <Mic className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onSubmit}
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 transform",
              isLoading && "opacity-50 cursor-not-allowed",
              !isMessageEmpty && "scale-100 opacity-100",
              "shadow-md hover:shadow-lg",
            )}
            disabled={isMessageEmpty || isLoading || disabled}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

export default ChatInput
