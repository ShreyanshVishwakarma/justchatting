"use client";
import React, { useEffect, useRef } from "react";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import ChatHeader from "./_components/ChatHeader";
import MessageList from "./_components/MessageList";
import ChatInput from "./_components/ChatInput";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { encryptMessage } from "@/lib/encrypt";
import { decryptMessage } from "@/lib/decrypt";
import { generateAndStoreUserKeys } from "@/lib/cryptoService";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useUserOnboarding } from "@/hooks/useUserOnboarding";

export type DexieId<TableName extends string> = string & { __brand: TableName };
type MessageId = DexieId<"messages">;

const syncToLocal = async (
  messagesLive: any[],
  currentUserId?: string,
  otherUserPublicKey?: string,
) => {
  if (!messagesLive || messagesLive.length === 0) return;

  try {
    const serverMessages = [...messagesLive];
    const serverIds = serverMessages.map((msg) => msg._id);

    // Fetch ONLY the local messages that share these exact server IDs
    const existingLocalMessages = await db.messages
      .where("_id")
      .anyOf(serverIds)
      .toArray();

    const localMapByServerId = new Map(
      existingLocalMessages.map((msg) => [msg._id, msg]),
    );

    // Decrypt outside the transaction to avoid PrematureCommitError
    const itemsToPut = await Promise.all(
      serverMessages.map(async (serverMsg) => {
        const localMatch = localMapByServerId.get(serverMsg._id);

        const localPrimaryKey = localMatch
          ? localMatch.id
          : `msg-${Date.now()}-${Math.random()}`;

        const {
          iv,
          encryptedBlob,
          senderPublicKey,
          recipientPublicKey,
          ...serverMsgWithoutCrypto
        } = serverMsg as any;

        const isMine = currentUserId && serverMsg.senderId === currentUserId;
        const keyForDecrypt = isMine
          ? recipientPublicKey ?? otherUserPublicKey
          : senderPublicKey;
        const needsDecryption =
          !localMatch || localMatch.content.startsWith("🔒 [");

        let decryptedContent = localMatch?.content ?? "";
        try {
          if (needsDecryption && encryptedBlob && iv && keyForDecrypt) {
            decryptedContent = await decryptMessage(
              encryptedBlob,
              iv,
              keyForDecrypt,
            );
          } else if (needsDecryption && (!encryptedBlob || !iv)) {
            decryptedContent = "🔒 [Invalid encrypted payload]";
          } else if (needsDecryption && !keyForDecrypt) {
            decryptedContent = "🔒 [Missing decrypt key]";
          }
        } catch (error) {
          console.error("❌ Error decrypting message during sync:", error);
        }

        return {
          ...localMatch,
          ...serverMsgWithoutCrypto,
          content: decryptedContent,
          id: localPrimaryKey,
          _id: serverMsg._id,
          status: "sent",
        };
      }),
    );

    await db.transaction("rw", db.messages, async () => {
      if (itemsToPut.length > 0) {
        await db.messages.bulkPut(itemsToPut);
      }


    });

    console.log(
      `Successfully synced ${serverMessages.length} messages in a single transaction.`,
    );
  } catch (error) {
    console.error("❌ Error during atomic sync optimization:", error);
  }
};

export default function ConversationPage() {
  const params = useParams<{ conversationId: string }>();
  const { isSignedIn } = useAuth();
  const cryptoStatus = useUserOnboarding(Boolean(isSignedIn));
  const hasUsableCryptoKey = cryptoStatus === "ready";
  const conversationId = params.conversationId as Id<"conversations">;
  const otherUser = useQuery(api.conversations.getOtherUser, {
    conversationId,
  });
  const deleteMessageMutation = useMutation(api.message.deleteMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const newMessage = useMutation(api.message.newMessage);
  const me = useQuery(api.user.getMe);
  const HardDeleteMessageMutation = useMutation(api.message.hardDeleteMessage);


  const {
    results: messages,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.messages.get,
    { conversationID: conversationId },
    { initialNumItems: 100 },
  );

  const rawMessagesLocal =
    useLiveQuery(async () => {
      try {
        return await db.messages
          .where("conversationId")
          .equals(conversationId as string)
          .sortBy("timestamp");
      } catch (error) {
        console.error("Error fetching local messages:", error);
        return [];
      }
    }, [conversationId]) || [];

  useEffect(() => {
    if (!hasUsableCryptoKey) return;
    syncToLocal(messages, me?._id, otherUser?.publicKey);
  }, [hasUsableCryptoKey, messages, me?._id, otherUser?.publicKey]);
  /*
  useEffect(() => { const syncServerMessages = async () => {
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

        // await db.messages.bulkPut(transformedMessages);
        //this was the old way, but it was causing issues with deleted messages
// idk how to send clone of treanformedMessages to this function ...... what if treansformedMessages updates in between
// exectuion of this fucntion ?
        await syncToLocal(transformedMessages);
        console.log(` Synced ${transformedMessages.length} server messages to local storage`);
      }
      catch (error) {
        console.error("❌ Error syncing server messages:", error);
      }
    }
    syncServerMessages();
  }, [messages,conversationId]);
 */
  const handleSubmit = async (message: string) => {
    if (!me || !hasUsableCryptoKey) return;

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
        status: "pending",
      });

      console.log(" Added optimistic message to local storage");
      const recipientPublicKey = otherUser?.publicKey;
      if (!recipientPublicKey) {
        throw new Error(
          "Cannot encrypt message: recipient public key is missing",
        );
      }

      const { encryptedBlob, iv } = await encryptMessage(
        message,
        recipientPublicKey,
      );
      const senderPublicKey = await generateAndStoreUserKeys();
      const serverMessage = await newMessage({
        conversationId,
        encryptedBlob,
        iv,
        senderPublicKey,
        recipientPublicKey,
      });

      if (serverMessage) {
        console.log(" Message sent to server:", serverMessage);

        await db.messages.update(tempId, {
          _id: serverMessage._id as string,
          isDeleted: serverMessage.isDeleted || false,
          isEdited: serverMessage.isEdited || false,
          timestamp: serverMessage._creationTime,
          creationTime: serverMessage._creationTime,
          status: "sent",
        });
        // await db.messages.delete(tempId);
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
          status: "error",
        });
        console.log("✅ Marked message as error");
      } catch (updateError) {
        console.error(" Error updating message status:", updateError);
      }
    }
  };

  const handleSoftDeleteMessage = async (messageId: MessageId) => {
    try {
      let messageToDelete = await db.messages.get(messageId as string);
      if (!messageToDelete) {
        console.warn("Message not found locally for soft delete:", messageId);
        return;
      }
      await db.messages.update(messageId as string, { isDeleted: true });
      await deleteMessageMutation({
        messageId: messageToDelete._id as Id<"messages">,
      });
      // await db.messages.where('_id').equals(messageId as string).delete();
      console.log(" Message deleted successfully");
    } catch (error) {
      console.error(" Error deleting message:", error);
    }
  };

  const handleHardDeleteMessage = async (messageId: MessageId) => {
    try {
      let messageToDelete = await db.messages.get(messageId as string);
      if (!messageToDelete) {
        console.warn("Message not found locally for soft delete:", messageId);
        return;
      }
      await HardDeleteMessageMutation({
        messageId: messageToDelete._id as Id<"messages">,
      });
      await db.messages
        .where("id")
        .equals(messageId as string)
        .delete();
      console.log(" Message deleted successfully");
    } catch (error) {
      console.error(" Error deleting message:", error);
    }
  };

  const handleCopyMessage = (messageContent: string) => {
    navigator.clipboard
      .writeText(messageContent)
      .then(() => {
        console.log(" Message copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying message:", error);
      });
  };

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

  const memoMe = React.useMemo(() => {
    return me;
  }, [me]);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader otherUser={otherUser} />
      <MessageList
        messages={rawMessagesLocal}
        status={status}
        loadMore={loadMore}
        messagesEndRef={messagesEndRef}
        otherUser={otherUser}
        me={memoMe}
        onSoftDeleteMessage={handleSoftDeleteMessage}
        onHardDeleteMessage={handleHardDeleteMessage}
        onCopyMessage={handleCopyMessage}
      />
      <ChatInput
        handleSubmit={handleSubmit}
        disabled={!hasUsableCryptoKey}
        placeholder={
          hasUsableCryptoKey
            ? "say something..."
            : "Encryption key unavailable — recover your key to continue"
        }
      />
    </div>
  );
}
