import { ConvexError, v } from "convex/values";
import { getUserbyTokenIdentifier } from "./_utils";
import { mutation } from "./_generated/server";

export const newMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await getUserbyTokenIdentifier({
      ctx,
      tokenIdentifier: identity.subject,
    })

    if (!user) {
      throw new ConvexError("User not found");
    }

    const message = {
      conversationId: args.conversationId,
      senderId: user._id,
      content: args.content,
      timestamp: Date.now(),
    };

    const messageId = await ctx.db.insert("messages", message);
    
    // Update the last message in the conversation
    await ctx.db.patch(args.conversationId, { lastMessageId: messageId });

    return message;
  },
})


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
    })

    if (!user) {
      throw new ConvexError("User not found");
    }

    const message = await ctx.db.get(args.messageId);
    if (!message || message.senderId !== user._id) {
      throw new ConvexError("Message not found or you do not have permission to delete it");
    }

    await ctx.db.delete(args.messageId);

    // Optionally, update the conversation's last message
    const conversation = await ctx.db.get(message.conversationId);
    if (conversation?.lastMessageId === args.messageId) {
      await ctx.db.patch(message.conversationId, { lastMessageId: undefined });
    }

    return true;
  },
});