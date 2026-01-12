import type { Metadata } from "next";
import { Archivo_Black, Space_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import ClientToaster from "./components/ClientToaster";

// 1. Configure the Retro Fonts
const archivo = Archivo_Black({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-heavy"
});

const spaceMono = Space_Mono({ 
  weight: ["400", "700"], 
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "flatMATE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} ${spaceMono.variable} bg-[#E6ECEE] text-black antialiased`}
      >
        <Providers>{children}</Providers>
        <ClientToaster />
      </body>
    </html>
  );
}
