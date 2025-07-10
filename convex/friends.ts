import { Id } from "./_generated/dataModel";
import { internalQuery, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const currentUser = await ctx.auth.getUserIdentity();
        if (!currentUser) {
            throw new Error("User not authenticated");
        }
        const currentUserid = await ctx.db.query("users")
            .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", currentUser.subject))
            .unique();

        if (!currentUserid) {
            throw new Error("Current user not found");
        }   

        const friends1 = await ctx.db.query("friends")
        .withIndex("by_user1", (q)=> q.eq("user1", currentUserid._id))
        .collect();
        
        const friends2 = await ctx.db.query("friends")
        .withIndex("by_user2", (q)=> q.eq("user2", currentUserid._id))
        .collect();

        const friendships = [...friends1, ...friends2];

    const friends = await Promise.all(
      friendships?.map(async (friendship) => {
        const friend = await ctx.db.get(
          friendship.user1 === currentUserid._id
            ? friendship.user2
            : friendship.user1
        );
        if (!friend) {
          throw new Error("Friend not found");
        }
        const conversation = await ctx.db.get(friendship.conversationId);
        return {
          ...conversation,
          conversationId: friendship.conversationId,
          ...friend,
        };
      })
    );
    return friends;
  },
});

export const getallFriendsConversationId = internalQuery({
    args: {
        userId : v.id("users")
    },
    handler: async (ctx,args): Promise<Id<"conversations">[]> => {
        const friends1 = await ctx.db.query("friends")
            .withIndex("by_user1", (q) => q.eq("user1", args.userId))
            .collect();

        const friends2 = await ctx.db.query("friends")
            .withIndex("by_user2", (q) => q.eq("user2", args.userId))
            .collect();

        const friendships = [...friends1, ...friends2];

        return friendships.map((friendship) => friendship.conversationId);
    }
})