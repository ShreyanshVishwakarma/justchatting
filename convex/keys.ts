import { internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const updateEncryptedKeys = mutation({
  args: {
    userId: v.id("users"),
    encryptedKeys: v.string(),
    publicKey: v.string(),
    keyDerivation: v.object({
      salt: v.string(), // 16 byte rand number (base64)
      iv: v.string(),
      iterations: v.number(),
      kdf: v.literal("pbkdf2"),
      hash: v.literal("SHA-256"),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.subject),
      )
      .unique();
    if (!user) throw new Error("User not found");
    if (user._id !== args.userId) throw new Error("Invalid user");

    const existingKey = await ctx.db
      .query("userKeys")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existingKey) {
      await ctx.db.patch(existingKey._id, {
        encryptedPrivateKey: args.encryptedKeys,
        keyDerivation: args.keyDerivation,
      });
    } else {
      await ctx.db.insert("userKeys", {
        userId: args.userId,
        encryptedPrivateKey: args.encryptedKeys,
        keyDerivation: args.keyDerivation,
      });
    }

    if (user.publicKey !== args.publicKey) {
      await ctx.db.patch(user._id, { publicKey: args.publicKey });
    }

    return { ok: true };
  },
});

export const getUserKeys = query({
  args: {},
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
      throw new Error("User not found");
    }
    const result = await ctx.db
      .query("userKeys")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();
    if (!result) throw new Error("Failed to get user keys");
    return result;
  },
});
