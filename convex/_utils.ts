import { QueryCtx, MutationCtx } from "./_generated/server";

export const getUserbyTokenIdentifier = async({
    ctx,
    tokenIdentifier,
}:{
    ctx: QueryCtx | MutationCtx,
    tokenIdentifier: string,}) => {
    return await ctx.db.query("users")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", tokenIdentifier))
        .unique();
    }
