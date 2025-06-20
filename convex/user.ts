import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const create = internalMutation({
  args: {
    username: v.string(),
    email: v.string(),
    imageURL: v.string(),
    tokenIdentifier: v.string()
  },
  handler: async ({ db }, args) => {
    await db.insert("users", args);
  }
})

export const getByUserId = internalQuery({
  args: {
    tokenIdentifier: v.string()
  },
  async handler(ctx, args) {
    return ctx.db.query("users").withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", args.tokenIdentifier)).unique()
  }
})
