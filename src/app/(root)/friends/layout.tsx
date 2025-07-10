import React from 'react'
import { FriendRequests } from './FriendRequests';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AddFriend } from './addfriends'
import FriendList from './FriendList';

type Props = {}

const FriendsLayout = (props: Props) => {

  return (
    <div className="h-full flex flex-col p-4 bg-gradient-to-br from-background via-background to-muted/10">
      <Card className="w-full max-w-2xl mx-auto flex flex-col h-full bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg overflow-hidden">
        <CardHeader className="px-6 py-4 bg-gradient-to-r from-background/80 to-muted/20 border-b border-border/50">
          <CardTitle className="text-xl font-bold">
            <div className='flex items-center justify-between'>
              <div>
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Friends</span>
                <p className="text-sm font-normal text-muted-foreground mt-1">Connect and manage your network</p>
              </div>
              <AddFriend/>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <FriendRequests />
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Your Friends</h3>
            </div>
            <FriendList/>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FriendsLayout