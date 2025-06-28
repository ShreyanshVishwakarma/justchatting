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
          <CardTitle>Friends</CardTitle>
        </CardHeader>
        <p className="text-muted-foreground">
          This is where you can view your friends and manage friend requests.
          You can also start new conversations with your friends from here.
        </p>
        </CardContent>
    </Card>
  )
}

export default page