import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AdBanner } from "@/components/AdBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "Pokopia Guide - Your Pokémon Companion",
  description: "A comprehensive Pokémon guide and companion app for trainers. Browse Pokédex, manage inventory, explore maps, and more!",
  keywords: ["Pokemon", "Pokopia", "Pokédex", "Guide", "Companion", "Trainer", "Gaming"],
  authors: [{ name: "Pokopia Team" }],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Pokopia Guide",
    description: "Your ultimate Pokémon companion app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokopia Guide",
    description: "Your ultimate Pokémon companion app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8733903111878090" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground h-full`}
      >
        {children}
        <AdBanner />
        <Toaster />
      </body>
    </html>
  );
}
