"use client"
import React, { use, useEffect, useRef } from 'react'
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import ChatHeader from './_components/ChatHeader'
import MessageList from './_components/MessageList'
import ChatInput from './_components/ChatInput'
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/db"; 

export default function ConversationPage({ params} : {
  params : Promise<{ conversationId: Id<"conversations">}>
}) {
  const { conversationId } = use(params);
  const otherUser = useQuery(api.conversations.getOtherUser, { conversationId });
  const deleteMessageMutation = useMutation(api.message.deleteMessage); 
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const newMessage = useMutation(api.message.newMessage);
  const me = useQuery(api.user.getMe);

  const {
    results: messages,
    status,
    loadMore
  } = usePaginatedQuery(
    api.messages.get,
    { conversationID: conversationId},
    { initialNumItems: 100 }
  )

  const messagesLocal = useLiveQuery(async () => {
    try{
      return await db.messages
        .where('conversationId')
        .equals(conversationId as string)
        .sortBy("timestamp");
    }catch (error) {
      console.error("Error fetching local messages:", error);
      return [];
    }
  }, [conversationId]) || []; 

  useEffect(() => {
    const syncServerMessages = async () => {
      if (!messages || messages.length === 0) return;
      
      try {
        const transformedMessages = messages.map(msg => ({
          id: msg._id, 
          _id: msg._id as string,
          conversationId: conversationId as string,
          senderId: msg.senderId as string,
          content: msg.content,
          isEdited: msg.isEdited || false,
          timestamp: msg._creationTime, 
          creationTime: msg._creationTime,
          status: 'sent' as const
        }));
        
        await db.messages.bulkPut(transformedMessages);
        console.log(` Synced ${transformedMessages.length} server messages to local storage`);
      }
      catch (error) {
        console.error("❌ Error syncing server messages:", error);
      }
    }
    syncServerMessages();
  }, [messages, conversationId]); 

  const handleSubmit = async (message: string) => {
    if (!me) return;
    
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    
    try {
      // 1. Add optimistic message to local storage
      await db.messages.add({
        id: tempId,
        _id: tempId,
        conversationId: conversationId as string,
        senderId: me._id as string,
        content: message,
        timestamp: Date.now(),
        status: 'pending'
      });

      console.log(" Added optimistic message to local storage");

      const serverMessage = await newMessage({ 
        conversationId, 
        content: message 
      });

      if (serverMessage) {
        console.log(" Message sent to server:", serverMessage);
        
        await db.messages.update(tempId, {
          _id: serverMessage._id as string ,
          conversationId: conversationId as string,
          senderId: serverMessage.senderId as string,
          content: serverMessage.content,
          isEdited: serverMessage.isEdited || false,
          timestamp: serverMessage._creationTime,
          creationTime: serverMessage._creationTime,
          status: 'sent'
        });
        // await db.messages.put({
        //   id: serverMessage._id as string, 
        //   _id: serverMessage._id as string ,
        //   conversationId: conversationId as string,
        //   senderId: serverMessage.senderId as string,
        //   content: serverMessage.content,
        //   isEdited: serverMessage.isEdited || false,
        //   timestamp: serverMessage._creationTime,
        //   creationTime: serverMessage._creationTime,
        //   status: 'sent'
        // });
        
        console.log(" Updated local message with server data");
      }

    } catch (error) {
      console.error("❌ Error sending message:", error);
      
      try {
        await db.messages.update(tempId, {
          status: 'error'
        });
        console.log("✅ Marked message as error");
      } catch (updateError) {
        console.error(" Error updating message status:", updateError);
      }
    }
  }

  const handleDeleteMessage = async (messageId: Id<"messages">) => {
    try {
      // Delete from server
      await deleteMessageMutation({ messageId });
      
      // Delete from local storage
      await db.messages.where('_id').equals(messageId as string).delete();
      
      console.log(" Message deleted successfully");
    } catch (error) {
      console.error(" Error deleting message:", error);
    }
  }

  const handleCopyMessage = (messageContent: string) => {
    navigator.clipboard.writeText(messageContent)
      .then(() => {
        console.log(" Message copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying message:", error);
      });
  }

  // // Combine server and local messages for display
  // const displayMessages = React.useMemo(() => {
  //   const messageMap = new Map();
    
  //   // Add local messages first (includes pending/error states)
  //   messagesLocal?.forEach(msg => {
  //     messageMap.set(msg.id, msg);
  //   });
    
  //   // Add/override with server messages (more authoritative)
  //   messages?.forEach(msg => {
  //     messageMap.set(msg._id, {
  //       id: msg._id,
  //       _id: msg._id,
  //       conversationId: conversationId as string,
  //       senderId: msg.senderId as string,
  //       content: msg.content,
  //       isEdited: msg.isEdited || false,
  //       timestamp: msg._creationTime,
  //       creationTime: msg._creationTime,
  //       status: 'sent' as const
  //     });
  //   });
    
  //   return Array.from(messageMap.values())
  //     .sort((a, b) => a.timestamp - b.timestamp);
  // }, [messagesLocal, messages, conversationId]);

  // Debug logging
  console.log("🔍 Debug Info:", {
    serverMessages: messages?.length || 0,
    localMessages: messagesLocal?.length || 0,
    // displayMessages: displayMessages.length,
    conversationId: conversationId
  });
    
  return (
    <div className="flex flex-col h-full">
      <ChatHeader otherUser={otherUser} />
      <MessageList 
        messages={messagesLocal} 
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