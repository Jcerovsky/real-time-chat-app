import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import React from "react";
import ContextProvider from "@/app/context/Context";
import Navbar from "@/app/components/Navbar";

const roboto = Roboto({ weight: ["300", "500", "900"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Real-time Chat App",
  description: "Communicate effectively and securely",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ContextProvider>
        <body className={`${roboto.className} bg-zinc-50`}>
          <Navbar />
          {children}
        </body>
      </ContextProvider>
    </html>
  );
}
