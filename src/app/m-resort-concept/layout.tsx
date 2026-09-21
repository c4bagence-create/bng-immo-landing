import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./m-resort-concept.css";
import "./mobile-chapters.css";

const inter = Inter({
  variable: "--font-mr",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "M Resort Marrakech | Appartements dès 116 000 € | BNG Immo",
  description:
    "Découvrez les appartements disponibles à M Resort Marrakech : plans, prix, paiement 30/30/40 et accompagnement BNG Immo.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#FAFAF9",
};

export default function MResortConceptLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={`mr-route ${inter.variable}`}>{children}</div>;
}
