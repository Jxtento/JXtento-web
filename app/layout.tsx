import type { Metadata } from "next";
import { DM_Serif_Display, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "JXTENTO — Solana Trade Intelligence",
  description: "JXTENTO maps every wallet, funding trail, and bundle on Solana in realtime.",
};

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${plexMono.variable} ${instrumentSans.variable} scroll-smooth`}
    >
      <body 
        className="min-h-full flex flex-col font-sans bg-[var(--paper)] text-[var(--ink)] antialiased overflow-x-hidden"
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
