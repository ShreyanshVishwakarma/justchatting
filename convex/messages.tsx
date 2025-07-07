import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";

export const getMessages = query({
    args: { 
        convesatoinID : v.id("conversations")
    },
    handler: async (ctx , args) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity) {
            throw new ConvexError("Not authenticated");
        }
    
        const messages = await ctx.db.query("messages").withIndex("by_conversationId", (q) => q.eq("conversationId", args.convesatoinID)).collect();
        if(!messages) {
            return [];
        }
        return messages;
    }
});