/** Snapshot read from Vertex with only “Lot Disponible” enabled. Not live inventory. */
export const ALMA_STOCK_CHECKED = "2026-09-21";
/** Updated total supplied by BNG on 22/09/2026; remaining lot IDs not supplied. */
export const ALMA_AVAILABLE_COUNT = 7;
export const ALMA_STOCK_SOURCE = "https://vertex-france.com/PACKAGE/BNG_IMMO/ALMA/navigation/menu/index.html#model";
export const ALMA_LOTS = [
  { id: "V01", price: 3633000, surface: 179 },
  { id: "V07", price: 3633000, surface: 179 },
  { id: "V28", price: 3666600, surface: 179 },
  { id: "V55", price: 2986400, surface: 179 },
  { id: "V56", price: 3610600, surface: 179 },
  { id: "V57", price: 3610600, surface: 179 },
  { id: "V60", price: 3610600, surface: 179 },
  { id: "V71", price: 2986400, surface: 179 },
  { id: "V72", price: 3610600, surface: 179 },
  { id: "V74", price: 2986400, surface: 179 },
  { id: "V75", price: 2986400, surface: 179 },
] as const;
export type AlmaLot = typeof ALMA_LOTS[number];
