import Dexie, { type EntityTable } from "dexie";

interface ChatMessage {
  id: string; // Primary key - simple string
  _id?: string; // Store Convex _id as string
  conversationId: string;
  senderId: string;
  content: string;
  isEdited?: boolean;
  timestamp: number;
  isDeleted?: boolean;
  creationTime?: number; // Store Convex _creationTime
  status: "pending" | "sent" | "error";
}

interface CryptoKeyRecord {
  id: "me";
  privateKey: CryptoKey;
  publicKeyBase64: string;
}

const db = new Dexie("JustChatting") as Dexie & {
  messages: EntityTable<ChatMessage, "id">;
  cryptoKey: EntityTable<CryptoKeyRecord, "id">;
};

db.version(1).stores({
  messages: "id, _id, conversationId, senderId, timestamp, status",
});

db.version(2).stores({
  messages: "id, _id, conversationId, senderId, timestamp, status",
  cryptoKey: "id",
});

export type { ChatMessage, CryptoKeyRecord };
export { db };
