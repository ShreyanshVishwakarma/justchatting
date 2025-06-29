import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function ConversationsPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Card className="flex-1 w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Conversations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">No active conversations</h3>
            <p className="text-muted-foreground text-sm">
              This is where your chats will appear once they're implemented.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
