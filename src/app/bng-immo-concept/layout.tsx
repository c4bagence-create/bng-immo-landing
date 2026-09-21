import type { Metadata, Viewport } from "next";
import MetaPixelConsent from "./MetaPixelConsent";

export const metadata: Metadata = {
  title: "Votre projet immobilier à Marrakech | BNG Immo",
  description: "Villas, appartements et terrains à Marrakech. Découvrez Jardin d’Alma, M Resort, Naïa Hills, Elyazia et Ayline Garden, leurs images et leurs plans de paiement.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 5, userScalable: true, viewportFit: "cover", themeColor: "#faf8f3" };

export default function GeneralLandingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}<MetaPixelConsent /></>;
}
