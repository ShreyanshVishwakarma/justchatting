import { query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { ConvexError } from "convex/values";
import { getUserbyTokenIdentifier } from "./_utils";

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

    const user = await getUserbyTokenIdentifier({
      ctx,
      tokenIdentifier: identity.subject,
    });
    if (!user) throw new ConvexError("User not found");

    const members = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationID),
      )
      .collect();
    if (!members.some((member) => member.userId === user._id)) {
      throw new ConvexError("You do not have access to this conversation");
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

    const user = await getUserbyTokenIdentifier({
      ctx,
      tokenIdentifier: identity.subject,
    });
    if (!user) return null;

    const members = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();
    if (!members.some((member) => member.userId === user._id)) {
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