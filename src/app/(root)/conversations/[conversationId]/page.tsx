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
  const HardDeleteMessageMutation = useMutation(api.message.hardDeleteMessage);

  const {
    results: messages,
    status,
    loadMore
  } = usePaginatedQuery(
    api.messages.get,
    { conversationID: conversationId},
    { initialNumItems: 100 }
  )

  const rawMessagesLocal = useLiveQuery(async () => {
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
          isDeleted: msg.isDeleted || false,
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
          isDeleted: serverMessage.isDeleted || false,
          isEdited: serverMessage.isEdited || false,
          timestamp: serverMessage._creationTime,
          creationTime: serverMessage._creationTime,
          status: 'sent'
        });
        await db.messages.delete(tempId);
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

  const handleSoftDeleteMessage = async (messageId: Id<"messages">) => {
    try {
      await deleteMessageMutation({ messageId });
      // await db.messages.where('_id').equals(messageId as string).delete();
      console.log(" Message deleted successfully");
    } catch (error) {
      console.error(" Error deleting message:", error);
    }
  }

  const handleHardDeleteMessage = async (messageId: Id<"messages">) => {
    try {
      await HardDeleteMessageMutation({ messageId });
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

  // Filter out temp messages that have a matching real message
  // const filteredMessages = React.useMemo(() => {
  //   const realIds = new Set(messagesLocal.filter(m => !m.id.startsWith('temp-')).map(m => m._id));
  //   return messagesLocal.filter(m => {
  //     if (m.id.startsWith('temp-') && realIds.has(m._id)) return false;
  //     return true;
  //   });
  // }, [messagesLocal]);

  // console.log("Page component rendering");
  // console.log("messagesLocal:", messagesLocal); 
  // console.log("me:", me);

const messagesLocal = React.useMemo(() => {
  return rawMessagesLocal;
}, [rawMessagesLocal]);


const memoMe = React.useMemo(() => {
  return me;
}, [me]);


  return (
    <div className="flex flex-col h-full">
      <ChatHeader otherUser={otherUser} />
      <MessageList 
        messages={messagesLocal}
        status={status}
        loadMore={loadMore}
        messagesEndRef={messagesEndRef}
        otherUser={otherUser}
        me={memoMe}
        onSoftDeleteMessage={handleSoftDeleteMessage}
        onHardDeleteMessage={handleHardDeleteMessage}
        onCopyMessage={handleCopyMessage}
      />
      <ChatInput handleSubmit={handleSubmit} />
    </div>
  )
}