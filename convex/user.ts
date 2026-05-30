import {
  internalMutation,
  mutation,
  internalQuery,
  query,
} from "./_generated/server";
import { v } from "convex/values";

const updateUserPublicKey = mutation({
  args: {
    publicKey: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.subject),
      )
      .unique();
    if (!user) {
      return null;
    }

    if (user.publicKey === args.publicKey) {
      return user;
    }

    await ctx.db.patch(user._id, { publicKey: args.publicKey });
    return user;
  },
});

export const updatePublicKey = updateUserPublicKey;
export const updatePrivateKey = updateUserPublicKey;

export const create = internalMutation({
  args: {
    username: v.string(),
    email: v.string(),
    imageURL: v.string(),
    tokenIdentifier: v.string(),
  },
  handler: async ({ db }, args) => {
    await db.insert("users", args);
  },
});

export const getByUserId = internalQuery({
  args: {
    tokenIdentifier: v.string(),
  },
  async handler(ctx, args) {
    return ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier),
      )
      .unique();
  },
});

export const getMe = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.subject),
      )
      .unique();
    if (!user) {
      return null;
    }
    return user;
  },
});

export const getUserById = query({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) return null;
    return {
      username: user.username,
      imageURL: user.imageURL,
    };
  },
});
