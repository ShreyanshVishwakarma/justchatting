import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type Props = {}

const conversationsPageLayout = (props: Props) => {
  return (
    <div className="h-full flex py-2 flex-col">
      <Card className="w-full md:w-1/4 flex-1 flex flex-col md:h-full">
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <Separator/>
        <CardContent className="flex-grow overflow-y-auto">
          <p className="text-muted-foreground">
            This is where you can view your conversations with friends.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default conversationsPageLayout