import { ConvexError, v } from "convex/values";
import { getUserbyTokenIdentifier } from "./_utils";
import { mutation } from "./_generated/server";

export const newMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    encryptedBlob: v.string(),
    iv: v.string(), // Initialization vector (IV) for encrypted content
    senderPublicKey: v.string(),
    recipientPublicKey: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await getUserbyTokenIdentifier({
      ctx,
      tokenIdentifier: identity.subject,
    });

    if (!user) {
      throw new ConvexError("User not found");
    }

    if (!user.publicKey || args.senderPublicKey !== user.publicKey) {
      throw new ConvexError(
        "Your local encryption key does not match your account. Recover your key before sending messages.",
      );
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new ConvexError("Conversation not found");
    }

    const members = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();
    if (!members.some((member) => member.userId === user._id)) {
      throw new ConvexError("You do not have access to this conversation");
    }

    const recipientMember = members.find((member) => member.userId !== user._id);
    const recipient = recipientMember
      ? await ctx.db.get(recipientMember.userId)
      : null;
    if (!recipient?.publicKey || recipient.publicKey !== args.recipientPublicKey) {
      throw new ConvexError(
        "The recipient encryption key changed. Refresh the conversation and try again.",
      );
    }

    const message = {
      conversationId: args.conversationId,
      senderId: user._id,
      encryptedBlob: args.encryptedBlob,
      senderPublicKey: user.publicKey,
      recipientPublicKey: args.recipientPublicKey,
      timestamp: Date.now(),
      iv: args.iv,
    };

    const messageId = await ctx.db.insert("messages", message);

    // Update the last message in the conversation
    await ctx.db.patch(args.conversationId, { lastMessageId: messageId });

    return await ctx.db.get(messageId);
  },
});

//soft  delete
export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await getUserbyTokenIdentifier({
      ctx,
      tokenIdentifier: identity.subject,
    });

    if (!user) {
      throw new ConvexError("User not found");
    }

    const message = await ctx.db.get(args.messageId);
    if (!message || message.senderId !== user._id) {
      throw new ConvexError(
        "Message not found or you do not have permission to delete it",
      );
    }

    await ctx.db.patch(args.messageId, {
      isDeleted: true,
      isEdited: true, // Mark as edited to avoid confusion
      encryptedBlob: "",
    });
  },
});

export const hardDeleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const identify = await ctx.auth.getUserIdentity();
    if (!identify) {
      throw new ConvexError("Not authenticated");
    }
    const user = await getUserbyTokenIdentifier({
      ctx,
      tokenIdentifier: identify.subject,
    });
    if (!user) {
      throw new ConvexError("User not found");
    }
    const message = await ctx.db.get(args.messageId);
    if (!message || message.senderId !== user._id) {
      throw new ConvexError(
        "Message not found or you do not have permission to delete it",
      );
    }

    await ctx.db.delete(args.messageId);

    await ctx.db.patch(message.conversationId, {
      lastMessageId: undefined,
    });
  },
});
