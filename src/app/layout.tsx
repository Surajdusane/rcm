import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/proiders/theme-provider";
import { Analytics } from "@vercel/analytics/next"
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rcm-six.vercel.app"),
  title: "RCM | Make Medical Claims Smarter",
  description:
    "RCM demo app for automate financial tasks, stay organized, and make informed decisions effortlessly.",
  twitter: {
    title: "RCM | Make Medical Claims Smarter",
    description:
      "RCM demo app for automate financial tasks, stay organized, and make informed decisions effortlessly.",
    images: [
      {
        url: "https://rcm-six.vercel.app/og.png",
        width: 1200,
        height: 630,
        alt: "RCM | Make Medical Claims Smarter",
      }
    ]
    // images: [
    //   {
    //     url: "https://cdn.midday.ai/opengraph-image.jpg",
    //     width: 800,
    //     height: 600,
    //   },
    //   {
    //     url: "https://cdn.midday.ai/opengraph-image.jpg",
    //     width: 1800,
    //     height: 1600,
    //   },
    // ],
  },
  openGraph: {
    title: "RCM | Make Medical Claims Smarter",
    description:
      "Automate financial tasks, stay organized, and make informed decisions effortlessly.",
    url: "https://rcm-six.vercel.app",
    siteName: "RCM | Make Medical Claims Smarter",
    // images: [
    //   {
    //     url: "https://cdn.midday.ai/opengraph-image.jpg",
    //     width: 800,
    //     height: 600,
    //   },
    //   {
    //     url: "https://cdn.midday.ai/opengraph-image.jpg",
    //     width: 1800,
    //     height: 1600,
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
};

const poppins = Poppins({
  variable: "--font-poppints",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
}
