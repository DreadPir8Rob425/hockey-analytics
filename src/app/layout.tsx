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
    default: "Hockey Analytics",
    template: "%s | Hockey Analytics"
  },
  description: "Professional NHL hockey analytics and statistics platform with advanced metrics, game analysis, and team performance insights",
  keywords: ["NHL", "hockey", "analytics", "statistics", "Corsi", "Fenwick", "xG", "expected goals", "hockey metrics"],
  authors: [{ name: "Hockey Analytics Team" }],
  creator: "Hockey Analytics Platform",
  publisher: "Hockey Analytics",
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
    title: "Hockey Analytics",
    description: "Professional NHL hockey analytics and statistics platform with advanced metrics and game analysis",
    type: "website",
    locale: "en_US",
    siteName: "Hockey Analytics",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hockey Analytics",
    description: "Professional NHL hockey analytics and statistics platform",
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
