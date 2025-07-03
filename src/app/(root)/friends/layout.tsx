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
    <div className="h-full flex flex-col p-2">
      <Card className="w-full md:w-80 flex flex-col h-full border-0 shadow-none bg-background">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-lg font-semibold">
            <div className='flex items-center justify-between'>
              <span>Friends</span>
              <AddFriend/>
            </div>
          </CardTitle>
        </CardHeader>
        <Separator className="mx-4"/>
        <CardContent className="flex-1 overflow-y-auto px-4 py-3 space-y-6">
          <FriendRequests />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Friends</h3>
            <FriendList/>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FriendsLayout