import { v } from "convex/values";
import { query } from "./_generated/server";

export const addnumber = query({
  args: {
    a: v.number(),
    b: v.number(),
  },
  handler: async (_, args) => {
    return args.a + args.b;
  }
})
