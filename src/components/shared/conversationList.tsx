import React from 'react'
import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const ConversationList = () => {
const conversations = useQuery(api.conversations.getConversations);
  return (
    <div>
      <div className="space-y-2">
        {conversations?.length === 0 && (
          <div className="text-center text-muted-foreground mt-4">
            <p>Add a friend to start a conversation</p>
          </div>
        )}
        {conversations?.map(conversation => (
          <Link href={`/conversations/${conversation._id}`} key={conversation._id}>
            <Card className="cursor-pointer p-2 rounded-none hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={conversation.imageURL || undefined} />
                  <AvatarFallback>
                    {conversation.name ? conversation.name.charAt(0).toUpperCase() : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className='w-full'>
                  <CardTitle className="text-base">{conversation.name || "Unnamed Conversation"}</CardTitle>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessageId ? "Last message" : "No messages yet"}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
  

export default ConversationList