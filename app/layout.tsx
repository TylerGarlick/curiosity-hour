import type { Metadata, Viewport } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import { PWAInitializer } from "@/components/PWAInitializer";
import { OfflineIndicator } from "@/components/OfflineIndicator";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Curiosity Hour",
  description: "A question game to get to know your partner or friend better through thought-provoking questions",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Curiosity Hour",
  },
  other: {
    'format-detection': 'telephone, date, address, email, number',
  },
  icons: {
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
      { url: "/icon-192.svg", sizes: "192x192" },
      { url: "/icon-192.svg", sizes: "512x512" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${lora.variable} ${inter.variable} font-sans antialiased min-h-screen`}
      >
        <ThemeInitializer />
        <PWAInitializer />
        <OfflineIndicator />
        {children}
      </body>
    </html>
  );
}
