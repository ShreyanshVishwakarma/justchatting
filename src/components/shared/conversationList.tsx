import React from 'react'
import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

// Sample conversations - you'll replace this with real data later
const conversatins = [
  { id: '1', name: 'John Doe', lastMessage: 'Hey, how are you doing?' },
  { id: '2', name: 'Jane Smith', lastMessage: 'Did you finish the project?' },
  { id: '3', name: 'Team Chat', lastMessage: 'Meeting at 3pm today' },
];

const conversations = useQuery(api.conversations.getConversations) || [];

const ConversationList = () => {
  return (
    <div>
      <div className="space-y-2">
        {conversations.map(conversation => (
          <Link href={`/conversations/${conversation._id}`} key={conversation._id}>
            <Card className="cursor-pointer p-1 rounded-none hover:bg-secondary/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-base">{conversation.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{conversation.lastMessageId}</p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
  

export default ConversationList