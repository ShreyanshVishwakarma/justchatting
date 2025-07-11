"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";

type ChatInputProps = {
  handleSubmit: (message: string) => void;
};

const ChatInput = ({ handleSubmit }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    handleSubmit(message);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <form onSubmit={onSubmit} className="flex gap-2">
        <Input
          placeholder="Type a message..."
          className="flex-1 rounded-full px-4 py-2 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          maxLength={1000}
        />
        <Button
          type="submit"
          size="icon"
          className="rounded-full h-10 w-10"
          disabled={!message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
