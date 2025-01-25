import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from './components/GoogleAnalytics';
import CookieBanner from './components/CookieBanner';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HVAC-Tools',
  description: 'HVAC Tools er designet til at forenkle dit arbejde inden for VVS og ventilation',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics GA_MEASUREMENT_ID='G-2C3BJM37S3'/>
      <body className={inter.className}>{children}
        <CookieBanner />
      </body>
    </html>
  );
}
