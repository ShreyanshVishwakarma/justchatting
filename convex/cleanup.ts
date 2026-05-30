import { internalMutation } from "./_generated/server";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const BATCH_SIZE = 500;

export const cleanupOldMessages = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - THIRTY_DAYS_MS;
    let deleted = 0;

    while (true) {
      const oldMessages = await ctx.db
        .query("messages")
        .withIndex("by_timestamp", (q) => q.lt("timestamp", cutoff))
        .take(BATCH_SIZE);

      if (oldMessages.length === 0) {
        break;
      }

      for (const msg of oldMessages) {
        await ctx.db.delete(msg._id);
      }

      deleted += oldMessages.length;
    }

    return { deleted, cutoff };
  },
});
