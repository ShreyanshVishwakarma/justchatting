import { query } from "./_generated/server";
import { v } from "convex/values";

export const getRequests = query({
    args: {},
    handler: async (ctx) =>{
        const currentUser = await ctx.auth?.getUserIdentity();
        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        const userId = await ctx.db.query("users")
            .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", currentUser.subject))
            .unique();

        if (!userId) {
            throw new Error("Current user not found");
        }

        const requests = await ctx.db.query("requests")
            .withIndex("by_recieverId", (q) => q.eq("recieverId", userId._id))
            .collect();

        return requests;
    }
})

export const getRequestById = query({
    args: {
        requestId: v.id("requests"),
    },
    handler: async (ctx, args) => {
        const request = await ctx.db.get(args.requestId);
        if (!request) {
            throw new Error("Request not found");
        }
        return request;
    }
});

export const getRequestWithSenderDetails = query({
    args: {},
    handler: async (ctx, args) => {
        const currentUser = await ctx.auth?.getUserIdentity();
        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        const userId = await ctx.db.query("users")
            .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", currentUser.subject))
            .unique();

        if (!userId) {
            throw new Error("Current user not found");
        }

        const requests = await ctx.db.query("requests")
            .withIndex("by_recieverId", (q) => q.eq("recieverId", userId._id))
            .collect();

        const requestsWithSenderDetails = await Promise.all(
            requests.map(async (request) => {
                const sender = await ctx.db.get(request.senderId);
                if (!sender) {
                    throw new Error(`Sender not found for request: ${request._id}`);
                }
                return {
                    requestId: request._id,
                    sender: sender,
                };
            }
        ));
        return requestsWithSenderDetails;
    }
})