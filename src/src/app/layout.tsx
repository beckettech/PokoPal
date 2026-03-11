import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TabNav from "@/components/TabNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pokopia Guide",
  description: "RAG-powered companion for Pokémon Pokopia",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#dc2626",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen pb-20">{children}</main>
        <TabNav />
      </body>
    </html>
  );
}
