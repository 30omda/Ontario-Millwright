import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ontariomillwright.ca"),
  title: {
    default: "Ontario Millwright | Industrial Millwright Contractors in Ontario",
    template: "%s | Ontario Millwright",
  },
  description:
    "Machinery installation and relocation, precision alignment, maintenance, welding and rebuilds for plants across Ontario. Book a free consultation.",
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "Ontario Millwright",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0B2239",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-CA" className={`${GeistSans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
