
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://azeeldm.com"),
  title: { default:"Azeel DM — Instagram Comment to DM Automation for India", template:"%s | Azeel DM" },
  description: "Automatically send DMs when someone comments on your Instagram post. Try Pro for Rs.7 for 7 days. Official Meta API. No scraping. Made in India.",
  keywords: ["instagram automation","comment to dm","auto dm","instagram dm","india"],
  authors: [{ name:"Azeel Technologies", url:"https://azeltechnologies.com" }],
  icons: { icon:"https://azeltechnologies.com/favicon.png", apple:"https://azeltechnologies.com/favicon.png" },
  openGraph: { type:"website", locale:"en_IN", siteName:"Azeel DM", images:[{ url:"/og.png", width:1200, height:630, alt:"Azeel DM" }] },
  twitter: { card:"summary_large_image", creator:"@azeeldm" },
  robots: { index:true, follow:true },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="icon" href="https://azeltechnologies.com/favicon.png" />
      </head>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
