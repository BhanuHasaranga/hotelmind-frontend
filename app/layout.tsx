import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/sonner";
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
  title: "HotelMind AI",
  description: "AI-Powered Hospitality Revenue, Operations & Guest Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Light-first by design: HotelMind always opens light regardless of
            the OS setting (no enableSystem). Dark and OS-following remain
            available, opt-in, via the theme toggle in the user menu. */}
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <ToastProvider>{children}</ToastProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
