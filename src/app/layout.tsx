import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });
export const metadata: Metadata = {
  title: "BNG Immo — Projets immobiliers à Marrakech",
  description: "Les projets immobiliers BNG Immo à Marrakech.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 5, userScalable: true, viewportFit: "cover", themeColor: "#faf8f3" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr" className={inter.variable}><body>{children}</body></html>;
}
