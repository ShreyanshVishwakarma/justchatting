"use client"
import React from 'react'
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { useAuth } from '@clerk/nextjs'
import { ConvexReactClient } from 'convex/react';

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

type Props = {
    children?: React.ReactNode;
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || '')

const convexClientComponent = (props: Props) => {
  return (
        <ConvexProviderWithClerk useAuth={useAuth} client={convex} >
            {props.children}
        </ConvexProviderWithClerk>
  )
}

export default convexClientComponent