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



const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://justchatting-eight.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "justchat — doodles 'n chats",
  keywords: ["justchat", "just chatting", "chat", "next.js", "react"],
  description: "justchat is a fast, end-to-end encrypted chat app with a hand-drawn heart. no straight lines, no snooping — just chatting.",
  openGraph: {
    type: "website",
    url: "/home",
    siteName: "justchat",
    title: "justchat — doodles 'n chats",
    description: "fast, private chats with a hand-drawn heart. encrypted on your device, local-first, and refreshingly human.",
    images: [
      {
        url: "/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "justchat — fast, private, hand-drawn chats with pals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "justchat — doodles 'n chats",
    description: "fast, private chats with a hand-drawn heart. encrypted on your device, local-first, and refreshingly human.",
    images: ["/og/og-image.png"],
  },
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
    title: "justchat",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "justchat",
    "application-name": "justchat",
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

