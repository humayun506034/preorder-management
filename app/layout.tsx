import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
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
  title: "Preorder Management",
  description: "Manage product preorders, inventory status, and fulfillment workflow in one place.",
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
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              toast:
                "!rounded-xl !border-neutral-200 !bg-white !text-neutral-900 !shadow-lg",
              title: "!text-sm !font-bold !text-neutral-950",
              description: "!text-sm !text-neutral-500",
              success: "!border-neutral-300",
              error: "!border-red-200 !bg-red-50 !text-red-900",
            },
          }}
        />
      </body>
    </html>
  );
}
