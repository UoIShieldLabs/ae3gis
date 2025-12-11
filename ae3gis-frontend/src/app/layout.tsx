import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Test App",
  description: "A simple Next.js app with Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen font-sans bg-white text-black dark:bg-black dark:text-white antialiased">
        {/* Main content */}
        <main className="flex-grow">{children}</main>
        {/* {children} */}
      </body>
    </html>
  );
}
