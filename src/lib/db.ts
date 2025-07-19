import Dexie, { type EntityTable } from 'dexie';

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
  status: 'pending' | 'sent' | 'error';
}

const db = new Dexie('ChatApp') as Dexie & {
  messages: EntityTable<ChatMessage, 'id'>;
};

db.version(1).stores({
  messages: 'id, _id, conversationId, senderId, timestamp, status'
});

export type { ChatMessage };
export { db };