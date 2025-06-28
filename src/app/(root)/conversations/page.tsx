import React from 'react'
import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Sample conversations - you'll replace this with real data later
const conversations = [
  { id: '1', name: 'John Doe', lastMessage: 'Hey, how are you doing?' },
  { id: '2', name: 'Jane Smith', lastMessage: 'Did you finish the project?' },
  { id: '3', name: 'Team Chat', lastMessage: 'Meeting at 3pm today' },
];

const ConversationsPage = () => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Recent Conversations</h2>
      <div className="space-y-2">
        {conversations.map(conversation => (
          <Link href={`/conversations/${conversation.id}`} key={conversation.id}>
            <Card className="cursor-pointer hover:bg-secondary/50 transition-colors">
              <CardHeader className="p-4">
                <CardTitle className="text-base">{conversation.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{conversation.lastMessage}</p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ConversationsPage