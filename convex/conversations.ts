import { query } from "./_generated/server";
import { getUserbyTokenIdentifier } from "./_utils";
import { ConvexError, v } from "convex/values";

// refactor it to get only group conversations after it is implemented
export const getConversations = query({
    args: {},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }

        const user = await getUserbyTokenIdentifier({
            ctx,
            tokenIdentifier: identity.subject,
        });

        if (!user) {
            return [];
        }

        const conversationMembers = await ctx.db
            .query("conversationMembers")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .collect();

        const conversationsWithDetails = await Promise.all(
            conversationMembers.map(async (member) => {
                const conversation = await ctx.db.get(member.conversationId);
                if (!conversation) {
                    throw new Error(`Conversation not found for member record: ${member._id}`);
                }
                return conversation;
            })
        );

        return conversationsWithDetails;
    },
});

export const getOtherUser = query({
    args: {
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const currentUser = await getUserbyTokenIdentifier({
            ctx,
            tokenIdentifier: identity.subject,
        });

        if (!currentUser) {
            return null;
        }

        const members = await ctx.db
            .query("conversationMembers")
            .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
            .collect();

        const otherMember = members.find(member => member.userId !== currentUser._id);

        if (!otherMember) {
            return null;
        }

        return await ctx.db.get(otherMember.userId);
    }
});

export const getConversationlist = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }
        const user = await getUserbyTokenIdentifier({
            ctx,
            tokenIdentifier: identity.subject,
        });
        if (!user) {
            return [];
        }

        const conversationMembers = await ctx.db
            .query("conversationMembers")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .collect();
        
        const conversations = await Promise.all(
            conversationMembers.map(async (member) => {
                const conversation = await ctx.db.get(member.conversationId);
                if (!conversation) {
                    throw new ConvexError(`Conversation not found for member record: ${member._id}`);
                }
                
                const lastMessage = conversation.lastMessageId ? await ctx.db.get(conversation.lastMessageId) : null;
                
                // For non-group conversations, get the other user's details
                let conversationName = conversation.name || "Unnamed Chat";
                let conversationAvatar = conversation.imageURL || null;
                
                if (!conversation.isGroup) {
                    const members = await ctx.db
                        .query("conversationMembers")
                        .withIndex("by_conversationId", (q) => q.eq("conversationId", conversation._id))
                        .collect();
                    
                    const otherMember = members.find(m => m.userId !== user._id);
                    if (otherMember) {
                        const otherUser = await ctx.db.get(otherMember.userId);
                        if (otherUser) {
                            conversationName = otherUser.username || "Unknown User";
                            conversationAvatar = otherUser.imageURL || null;
                        }
                    }
                }
                
                return {
                    _id: conversation._id,
                    name: conversationName,
                    lastMessage: lastMessage?.content || "No messages yet",
                    timestamp: lastMessage?._creationTime,
                    avatar: conversationAvatar,
                    unread: false, // TODO: Implement unread message counting
                    isGroup: conversation.isGroup || false,
                    messageType: "text", // TODO: Get from lastMessage?.messageType when implemented
                    readStatus: "sent", // TODO: Get from lastMessage?.readStatus when implemented  
                    isOnline: false, // TODO: Implement online status
                };
            })
        );
        
        return conversations;
                    },
                });