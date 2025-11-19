import type { Metadata } from "next";
import { Geist, Geist_Mono, Bangers, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleOAuthProvider } from '@react-oauth/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bangers = Bangers({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bangers",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: " Allore AI -The all-in-one AI platform for clothing brands.",
  description: "Plan your strategy, generate stunning visuals, and launch directly to your store.",
  icons: {
    icon: [
      { url: '/draw-logo.png' },
      { url: '/draw-logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/draw-logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/draw-logo.png' },
    ],
  },
};

// Use environment variable instead of hardcoded value
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '830525870730-26k9e3g8clnkhrh6oi9en1rg55i69d4h.apps.googleusercontent.com';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bangers.variable} ${inter.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <div className="min-h-screen flex flex-col">

            <main className="flex-1">
              {children}
            </main>

          </div>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
