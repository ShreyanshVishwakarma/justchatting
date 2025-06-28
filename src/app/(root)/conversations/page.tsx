import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const page = () => {
  return (
    <Card>
      <CardContent>
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <p className="text-muted-foreground">
          This is where you can view your conversations with friends.
        </p>
        </CardContent>
    </Card>
  )
}

export default page