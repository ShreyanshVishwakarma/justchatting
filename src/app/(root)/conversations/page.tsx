import React from 'react'
import { MessageSquare, Users, Sparkles } from "lucide-react"

export default function ConversationsPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="max-w-sm w-full space-y-4">
        {/* Main illustration */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="text-center space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">
              Select a conversation
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose from your conversations to start chatting
            </p>
          </div>

          {/* Feature items */}
          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-3 w-3 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-sm">Real-time messaging</h3>
                <p className="text-xs text-muted-foreground">Instant conversations</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-3 w-3 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-sm">Connect with friends</h3>
                <p className="text-xs text-muted-foreground">Stay in touch</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground/60">
            💡 Add friends in the Friends tab
          </p>
        </div>
      </div>
    </div>
  )
}
