import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DreamerAI - Explore o Cosmos Interior",
  description: "App mistico com sistema solar 3D interativo. Horoscopo, tarot, mapa astral, sonhos e mais.",
  icons: {
    icon: "/logo/logo-dreamer-ai.png",
    apple: "/logo/logo-dreamer-ai.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-deep-space text-lunar-silver`}>
        {children}
      </body>
    </html>
  );
}
