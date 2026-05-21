import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientProviders from "@/lib/client-providers";
import localFont from 'next/font/local'

const lufga = localFont({
  src: [
    {
      path: '../../public/lufga/LufgaMedium.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/lufga/LufgaSemiBold.woff',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/lufga/LufgaBold.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/lufga/LufgaExtraBold.woff',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/lufga/LufgaBlack.woff',
      weight: '900',
      style: 'normal',
    },
  ],
})

const satoshi = localFont({
  src: [
    {
      path: '../../public/fonts/SatoshiRegular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SatoshiBold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SatoshiBlack.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-satoshi-family',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Instastylin Admin Panel",
  description: "Instastylin admin dashboard",
  manifest: "/logo/manifest.json",
  icons: {
    icon: [
      { url: "/logo/favicon.ico" },
      { url: "/logo/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/logo/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/logo/apple-icon.png" },
      { url: "/logo/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "msapplication-config": "/logo/browserconfig.xml",
    "msapplication-TileColor": "#ffffff",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={satoshi.variable} suppressHydrationWarning>
      <body
        className={`${lufga.className} antialiased`}
        suppressHydrationWarning
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
