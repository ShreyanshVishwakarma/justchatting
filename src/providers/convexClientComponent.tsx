"use client"
import React from 'react'
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { useAuth } from '@clerk/nextjs'
import { ConvexReactClient } from 'convex/react';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your environment variables')
}

type Props = {
    children?: React.ReactNode;
}

const convex = new ConvexReactClient(convexUrl)

const ConvexClientComponent = (props: Props) => {
  return (
        <ConvexProviderWithClerk useAuth={useAuth} client={convex} >
            {props.children}
        </ConvexProviderWithClerk>
  )
}

export default ConvexClientComponent