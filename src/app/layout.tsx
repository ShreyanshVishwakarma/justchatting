import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ConvexClientComponent from "@/providers/convexClientComponent";
import { ClerkProvider } from "@clerk/nextjs";
import AuthHeader from "@/components/AuthHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Just Chatting",
  keywords: ["just chatting", "chat", "next.js", "react"],
  description: "A modern chat application built with Next.js and Clerk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ConvexClientComponent>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <AuthHeader />
            <main className="min-h-screen bg-gray-50">{children}</main>
          </body>
        </html>
      </ConvexClientComponent>
    </ClerkProvider>
  );
}
