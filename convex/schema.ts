import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    email: v.string(),
    imageURL: v.string(),
    tokenIdentifier: v.string()
  }).index("by_email", ["email"]).index("by_tokenIdentifier", ["tokenIdentifier"]),

  requests: defineTable({
    senderId : v.id("users"),
    recieverId : v.id("users")
  }).index("by_senderId", ["senderId"])
  .index("by_senderId_recieverId", ["senderId","recieverId"])
  .index("by_recieverId", ["recieverId"]),

  conversations: defineTable({
    name: v.optional(v.string()),
    imageURL: v.optional(v.string()),
    lastMessageId : v.optional(v.id("messages")),
    isGroup : v.optional(v.boolean())
  }),

  friends: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    conversationId: v.id("conversations")
  }).index("by_user1_user2", ["user1", "user2"])
  .index("by_user2_user1", ["user2", "user1"])
  .index("by_user1", ["user1"])
  .index("by_user2", ["user2"])
  .index("by_conversationId", ["conversationId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    isEdited: v.optional(v.boolean()),
    timestamp: v.number()
  }).index("by_conversationId_and_time", ["conversationId" , "timestamp"]),

  conversationMembers: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users")
  }).index("by_conversationId", ["conversationId"])
  .index("by_userId", ["userId"])
});

