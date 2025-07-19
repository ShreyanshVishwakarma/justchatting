import { query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { ConvexError } from "convex/values";

export const get = query({
  args: {
    conversationID: v.id("conversations"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const result = await ctx.db
      .query("messages")
      .withIndex("by_conversationId_and_time", (q) =>
        q.eq("conversationId", args.conversationID)
      )
      .order("desc") // Newest messages first
      .paginate(args.paginationOpts);

    return {
      ...result,
    };
  },
});

export const getLastMessage = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const lastMessage = await ctx.db
      .query("messages")
      .withIndex("by_conversationId_and_time", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("desc")
      .first();

    return lastMessage;
  },
});