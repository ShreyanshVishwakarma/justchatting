import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const keyDerivationValidator = v.object({
  salt: v.string(),
  iv: v.string(),
  iterations: v.number(),
  kdf: v.literal("pbkdf2"),
  hash: v.literal("SHA-256"),
});

async function getAuthenticatedUser(ctx: { auth: { getUserIdentity: () => Promise<{ subject: string } | null> }; db: any }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q: any) =>
      q.eq("tokenIdentifier", identity.subject),
    )
    .unique();
  if (!user) throw new Error("User not found");

  return user;
}

export const updateEncryptedKeys = mutation({
  args: {
    userId: v.id("users"),
    encryptedKeys: v.string(),
    publicKey: v.string(),
    keyDerivation: keyDerivationValidator,
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (user._id !== args.userId) throw new Error("Invalid user");

    const existingKey = await ctx.db
      .query("userKeys")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existingKey) {
      await ctx.db.patch(existingKey._id, {
        encryptedPrivateKey: args.encryptedKeys,
        keyDerivation: args.keyDerivation,
        keyVersion: existingKey.keyVersion ?? 1,
      });
    } else {
      await ctx.db.insert("userKeys", {
        userId: args.userId,
        encryptedPrivateKey: args.encryptedKeys,
        keyDerivation: args.keyDerivation,
        keyVersion: 1,
      });
    }

    if (user.publicKey !== args.publicKey) {
      await ctx.db.patch(user._id, { publicKey: args.publicKey });
    }

    return { ok: true };
  },
});

export const resetEncryptionIdentity = mutation({
  args: {
    encryptedKeys: v.string(),
    publicKey: v.string(),
    keyDerivation: keyDerivationValidator,
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const existingKey = await ctx.db
      .query("userKeys")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();
    const keyVersion = (existingKey?.keyVersion ?? 1) + 1;

    const [memberships, sentRequests, receivedRequests, friendshipsAsUser1, friendshipsAsUser2] =
      await Promise.all([
        ctx.db
          .query("conversationMembers")
          .withIndex("by_userId", (q) => q.eq("userId", user._id))
          .collect(),
        ctx.db
          .query("requests")
          .withIndex("by_senderId", (q) => q.eq("senderId", user._id))
          .collect(),
        ctx.db
          .query("requests")
          .withIndex("by_recieverId", (q) => q.eq("recieverId", user._id))
          .collect(),
        ctx.db
          .query("friends")
          .withIndex("by_user1", (q) => q.eq("user1", user._id))
          .collect(),
        ctx.db
          .query("friends")
          .withIndex("by_user2", (q) => q.eq("user2", user._id))
          .collect(),
      ]);

    await Promise.all([
      ...memberships.map((membership) => ctx.db.delete(membership._id)),
      ...sentRequests.map((request) => ctx.db.delete(request._id)),
      ...receivedRequests.map((request) => ctx.db.delete(request._id)),
      ...friendshipsAsUser1.map((friendship) => ctx.db.delete(friendship._id)),
      ...friendshipsAsUser2.map((friendship) => ctx.db.delete(friendship._id)),
    ]);

    if (existingKey) {
      await ctx.db.patch(existingKey._id, {
        encryptedPrivateKey: args.encryptedKeys,
        keyDerivation: args.keyDerivation,
        keyVersion,
      });
    } else {
      await ctx.db.insert("userKeys", {
        userId: user._id,
        encryptedPrivateKey: args.encryptedKeys,
        keyDerivation: args.keyDerivation,
        keyVersion,
      });
    }

    await ctx.db.patch(user._id, { publicKey: args.publicKey });

    return { keyVersion };
  },
});

export const getUserKeys = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.subject),
      )
      .unique();
    if (!user) throw new Error("User not found");

    const result = await ctx.db
      .query("userKeys")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();
    return result;
  },
});
