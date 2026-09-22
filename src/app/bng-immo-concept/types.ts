export type ProjectId = "jardin-alma" | "m-resort" | "naia-hills" | "elyazia" | "ayline-garden" | "jardin-eden" | "plaza-view";
export type PaymentStep = { percent: number; label: string; shortLabel: string; event: "reservation" | "scheduled" | "keys" | "title_notary"; month?: number };
export type ProjectPhoto = { src: string; alt: string; caption: string };
export type BngProject = {
  id: ProjectId;
  name: string;
  soldOut?: boolean;
  delivered?: boolean;
  kind: "villa" | "apartment" | "land";
  category: string;
  headline: string;
  highlight: string;
  description: string;
  price: number | null;
  pricePerM2?: number;
  surface: string;
  format: string;
  location: string;
  airport?: string;
  proximity?: { label: string; duration: string };
  delivery: string;
  features: string[];
  photos: ProjectPhoto[];
  payments: PaymentStep[];
  source: string;
  tour: string;
};

export const formatDH = (value: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value) + " DH";
