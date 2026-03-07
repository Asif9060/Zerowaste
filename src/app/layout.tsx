import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZeroWaste Farm — Connecting Farmers with Buyers",
  description:
    "Sell your surplus produce before it goes to waste. ZeroWaste Farm connects farmers in South Africa and Zimbabwe with restaurants, grocers, and food vendors.",
  keywords: ["surplus food", "farmers market", "South Africa", "Zimbabwe", "food waste", "fresh produce"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
