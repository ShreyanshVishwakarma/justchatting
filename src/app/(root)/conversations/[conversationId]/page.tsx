"use client"
import React, { use, useEffect, useRef } from 'react'
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import ChatHeader from './_components/ChatHeader'
import MessageList from './_components/MessageList'
import ChatInput from './_components/ChatInput'

export default function ConversationPage({ params} : {
  params : Promise<{ conversationId: Id<"conversations">}>
}) {
  const { conversationId } = use(params);
  const otherUser = useQuery(api.conversations.getOtherUser, { conversationId });
  const deleteMessageMutation = useMutation(api.message.deleteMessage); 
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const newMessage = useMutation(api.message.newMessage);
  const {
    results: messages,
    status,
    loadMore
  } = usePaginatedQuery(
    api.messages.get,
    { conversationID: conversationId},
    { initialNumItems: 20 }
  )

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (message: string) => {
    newMessage({ conversationId, content: message })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  }

  const handleDeleteMessage = (messageId: Id<"messages">) => {
      try {
        deleteMessageMutation({ messageId })
          .then(() => {
            
          })
          .catch((error) => {
            console.error("Error deleting message:", error);
          });
      } catch (error) {
        console.error("Error deleting message:", error);
      }
  }

  const handleCopyMessage = (messageContent: string) => {
    navigator.clipboard.writeText(messageContent)
      .then(() => {
        console.log("Message copied to clipboard");
        // You could add a toast notification here
      })
      .catch((error) => {
        console.error("Error copying message:", error);
      });
  }
    
  return (
    <div className="flex flex-col h-full">
      <ChatHeader otherUser={otherUser} />
      <MessageList 
        messages={messages}
        status={status}
        loadMore={loadMore}
        messagesEndRef={messagesEndRef}
        otherUser={otherUser}
        onDeleteMessage={handleDeleteMessage}
        onCopyMessage={handleCopyMessage}
      />
      <ChatInput handleSubmit={handleSubmit} />
    </div>
  )
}