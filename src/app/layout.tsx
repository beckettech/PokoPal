import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AdBanner } from "@/components/AdBanner";
import { MobileAdBanner } from "@/components/MobileAdBanner";
import { OfflineGuard } from "@/components/OfflineGuard";
import { SessionProvider } from "@/components/SessionProvider";

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
  title: "PokoPal - Your Pokémon Companion",
  description: "A comprehensive Pokémon guide and companion app for trainers. Browse Pokédex, manage inventory, explore maps, and more!",
  keywords: ["Pokemon", "Pokopia", "Pokédex", "Guide", "Companion", "Trainer", "Gaming"],
  authors: [{ name: "Pokopia Team" }],
  metadataBase: new URL("https://pokopal.com"),
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "PokoPal",
    description: "Your ultimate Pokémon companion app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PokoPal",
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
        {/* Detect Capacitor native for CSS targeting */}
        <script dangerouslySetInnerHTML={{ __html: 'if(/capacitor/i.test(navigator.userAgent)||location.protocol==="capacitor:")document.documentElement.classList.add("capacitor")' }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground h-full`}
      >
        <SessionProvider>
          <OfflineGuard>
            {children}
          </OfflineGuard>
        </SessionProvider>
        <AdBanner />
        <Toaster />
      </body>
    </html>
  );
}
