import {mutation} from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserbyTokenIdentifier } from "./_utils";

export const createRequest = mutation({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const currentUser =  await ctx.auth?.getUserIdentity();
        console.log("Current User:", currentUser);
        if(!currentUser) {
            throw new ConvexError("User not authenticated");
        }

        const currentUserid = await getUserbyTokenIdentifier({
            ctx,
            tokenIdentifier: currentUser.subject,
        });

        if (args.email === currentUser.email) {
            throw new ConvexError("You cannot send a request to yourself");
        }

        const recieverId = await ctx.db.query("users")
        .withIndex("by_email", (q) => q.eq("email",args.email)).unique();

        if(!recieverId) {
            throw new ConvexError("User with this email does not exist"); 
        }

        if (!currentUserid) {
            throw new ConvexError("Current user not found");
        }

    const requestAlreadySent = await ctx.db
      .query("requests")
      .withIndex("by_senderId_recieverId", (q) =>
      q.eq("senderId", currentUserid._id).eq("recieverId", recieverId._id))
      .unique();

    if (requestAlreadySent) {
      throw new Error("Request already sent to this user");
    }

    const req = await ctx.db.insert("requests",{
        senderId: currentUserid._id,
        recieverId: recieverId._id,
    })
    if(!req){
        throw new Error(
            "request not creaated , please try again later"
        )
    }
    return req;
  }
});

export const acceptRequest = mutation({
    args: {
        requestId: v.id("requests"),
    },
    handler: async (ctx, args) => {
        const currentUser = await ctx.auth?.getUserIdentity();
        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        const currentUserid = await getUserbyTokenIdentifier({
            ctx,
            tokenIdentifier: currentUser.subject,
        });

        if (!currentUserid) {
            throw new Error("Current user not found");
        }

        const request = await ctx.db.get(args.requestId);
        if (!request) {
            throw new Error("Request not found");
        }

        if (request.recieverId.toString() !== currentUserid._id.toString()) {
            throw new Error("You are not authorized to accept this request");
        }

        const request_ = await ctx.db.get(args.requestId)
        if (!request_) {
            throw new Error("Request not found");
        }

        const conversationId = await ctx.db.insert("conversations", {
            // You can set a default image and name if needed (for groups only)
            // Initially, there is no last message
        })

        const conversationMembers1 = await ctx.db.insert("conversationMembers", {
            conversationId: conversationId,
            userId: request_.senderId,
        });


        const conversationMembers2 = await ctx.db.insert("conversationMembers", {
            conversationId: conversationId,
            userId: request_.recieverId,
        });

        if (!conversationMembers1 || !conversationMembers2) {
            throw new Error("Conversation members not created");
        }

        await ctx.db.insert("friends", {
            user1: request_.senderId,
            user2: request_.recieverId,
            conversationId : conversationId,
        });

        await ctx.db.delete(args.requestId);
    }

});

export const rejectRequest = mutation({
    args: {
        requestId: v.id("requests"),
    },
    handler: async (ctx, args) => {
        const currentUser = await ctx.auth?.getUserIdentity();
        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        const currentUserid = await getUserbyTokenIdentifier({
            ctx,
            tokenIdentifier: currentUser.subject,
        });

        if (!currentUserid) {
            throw new Error("Current user not found");
        }

        const request = await ctx.db.get(args.requestId);
        if (!request) {
            throw new Error("Request not found");
        }

        if (request.recieverId.toString() !== currentUserid._id.toString()) {
            throw new Error("You are not authorized to reject this request");
        }

        await ctx.db.delete(args.requestId);
    }
});