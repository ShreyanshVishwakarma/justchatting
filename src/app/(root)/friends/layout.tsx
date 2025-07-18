import React from 'react'
import { FriendRequests } from './FriendRequests';
import { AddFriend } from './addfriends'
import FriendList from './FriendList';

type Props = {}

const FriendsLayout = (props: Props) => {

  return (
    <div className="h-full relative overflow-hidden">
      {/* Beautiful gradient background matching website theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="relative h-full flex flex-col p-4">
        <div className="w-full max-w-3xl mx-auto flex flex-col h-full">
          {/* Beautiful header section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                  Friends
                </h1>
                <p className="text-muted-foreground text-sm">Connect and manage your network</p>
              </div>
              <div className="p-2 rounded-xl bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50">
                <AddFriend/>
              </div>
            </div>
          </div>

          {/* Content area with beautiful glassmorphism */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full bg-card/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
              <div className="h-full overflow-y-auto p-6 space-y-6">
                <FriendRequests />
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/30"></div>
                    <h2 className="text-lg font-bold text-foreground">Your Friends</h2>
                  </div>
                  <FriendList/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FriendsLayout