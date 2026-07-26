import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    email: v.string(),
    imageURL: v.string(),
    tokenIdentifier: v.string(),
    publicKey: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_tokenIdentifier", ["tokenIdentifier"]),

  userKeys: defineTable({
    userId: v.id("users"),
    encryptedPrivateKey: v.string(),
    keyDerivation: v.object({
      salt: v.string(), // 16 byte rand number (base64)
      iv: v.string(),
      iterations: v.number(),
      kdf: v.literal("pbkdf2"),
      hash: v.literal("SHA-256"),
    }),
    keyVersion: v.optional(v.number()), // optional, for future key rotation
  }).index("by_userId", ["userId"]),

  requests: defineTable({
    senderId: v.id("users"),
    recieverId: v.id("users"),
  })
    .index("by_senderId", ["senderId"])
    .index("by_senderId_recieverId", ["senderId", "recieverId"])
    .index("by_recieverId", ["recieverId"]),

  conversations: defineTable({
    name: v.optional(v.string()),
    imageURL: v.optional(v.string()),
    lastMessageId: v.optional(v.id("messages")),
    isGroup: v.optional(v.boolean()),
  }),

  friends: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    conversationId: v.id("conversations"),
  })
    .index("by_user1_user2", ["user1", "user2"])
    .index("by_user2_user1", ["user2", "user1"])
    .index("by_user1", ["user1"])
    .index("by_user2", ["user2"])
    .index("by_conversationId", ["conversationId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    encryptedBlob: v.string(),
    iv: v.string(),
    senderPublicKey: v.string(),
    // Retains the exact recipient key used for encryption so the sender can
    // decrypt their own historical message after a recipient rotates keys.
    recipientPublicKey: v.optional(v.string()),
    isEdited: v.optional(v.boolean()),
    isDeleted: v.optional(v.boolean()),
    timestamp: v.number(),
  })
    .index("by_conversationId_and_time", ["conversationId", "timestamp"])
    .index("by_timestamp", ["timestamp"]),

  conversationMembers: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  })
    .index("by_conversationId", ["conversationId"])
    .index("by_userId", ["userId"]),
});
