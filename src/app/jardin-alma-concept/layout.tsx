import type { Metadata } from "next";
import LandingLayout from "../m-resort-concept/layout";
export { viewport } from "../m-resort-concept/layout";

export const metadata: Metadata = {
  title: "Jardin d’Alma Marrakech | Villas dès 3 millions de DH | BNG Immo",
  description: "Découvrez Jardin d’Alma : villas avec piscine privée, chantier lancé et accompagnement BNG Immo à Marrakech.",
  robots: { index: false, follow: false },
};

export default function JardinAlmaLayout({ children }: { children: React.ReactNode }) {
  return <LandingLayout>{children}</LandingLayout>;
}
