import type { Metadata } from "next";
import "@fontsource/kalam/400.css";
import "@fontsource/kalam/700.css";
import "@fontsource/patrick-hand/400.css";
import ConvexClientComponent from "@/providers/convexClientComponent";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";



export const metadata: Metadata = {
  title: "JustChatting",
  keywords: ["just chatting", "chat", "next.js", "react"],
  description: "A modern real-time chat application with friends and conversations",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: { url: "/favicon.ico" },
    apple: [{ url: "/apple-touch-icon.png", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JustChatting",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "JustChatting",
    "application-name": "JustChatting",
    "msapplication-TileColor": "#fdfbf7",
    "msapplication-tap-highlight": "no",
    "theme-color": "#fdfbf7",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ConvexClientComponent>
         <html lang="en" suppressHydrationWarning={true}>
           <body
            className="antialiased"
               >
            <ThemeProvider 
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              forcedTheme="light"
              disableTransitionOnChange
            >
             {children}
             <Toaster />
             <PWAInstallPrompt />
            </ThemeProvider>
            </body>
         </html>
      </ConvexClientComponent>
    </ClerkProvider>
  );
}

