import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "@/store/StoreProvider";

const urbanist = Urbanist({
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "Sahit NGO",
  description: "Sahit NGO dashboard to help people in need",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${urbanist.className} antialiased`}
      >
        <StoreProvider>
          {children}
        </StoreProvider>
        <Toaster />
      </body>
    </html>
  );
}
