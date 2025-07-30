import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
const inter = Inter({ subsets: ["latin"] })
export const metadata: Metadata = {
  title: {
    default: "CompQCode",
    template: "%s | Rakshit",
  },
  description: "Rakshit's Full Stack Developer Portfolio showcasing projects, skills, and experience.",
  keywords: ["Rakshit", "Portfolio", "Full Stack Developer", "Next.js", "TypeScript", "Web Development"],
  authors: [{ name: "Rakshit" }],
  creator: "Rakshit",
  metadataBase: new URL("https://chaotic-curse.onrender.com/"), // Replace with your domain
  openGraph: {
    title: "Rakshit | Portfolio",
    description: "Explore Rakshit's full stack development portfolio, featuring tech stacks, certifications, and contact info.",
    url: "https://chaotic-curse.onrender.com/",
    siteName: "Kumar Rakshit Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rakshit Portfolio Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rakshit | Portfolio",
    description: "Check out Rakshit's projects and skills as a full stack developer.",
    creator: "@_kr_rakshit",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  themeColor: "#ffffff",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
