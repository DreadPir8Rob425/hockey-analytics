import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "Cold Hard Puck",
    template: "%s | Cold Hard Puck"
  },
  description: "Cold Hard Puck - Professional NHL hockey analytics and statistics platform with advanced metrics, game analysis, and team performance insights",
  keywords: ["NHL", "hockey", "analytics", "statistics", "Corsi", "Fenwick", "xG", "expected goals", "hockey metrics", "cold hard puck"],
  authors: [{ name: "Cold Hard Puck Team" }],
  creator: "Cold Hard Puck",
  publisher: "Cold Hard Puck",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://hockey-analytics.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Cold Hard Puck",
    description: "Cold Hard Puck - Professional NHL hockey analytics and statistics platform with advanced metrics and game analysis",
    type: "website",
    locale: "en_US",
    siteName: "Cold Hard Puck",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cold Hard Puck",
    description: "Cold Hard Puck - Professional NHL hockey analytics and statistics platform",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual verification code when ready
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
