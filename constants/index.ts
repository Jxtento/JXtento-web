import { FeatureItem, NavigationLink, TokenDetails, TrustItem } from "@/types";

export const NAVIGATION_LINKS: NavigationLink[] = [
  { label: "The map", href: "#map" },
  { label: "Intel", href: "#features" },
  { label: "Read-only", href: "#trust" },
  { label: "$JXTENTO", href: "#token" },
];

export const FOOTER_LINKS: NavigationLink[] = [
  { label: "The map", href: "#map" },
  { label: "Intel", href: "#features" },
  { label: "Read-only", href: "#trust" },
  { label: "$JXTENTO", href: "#token" },
  { label: "Docs", href: "#" },
];

export const FEATURES_DATA: FeatureItem[] = [
  {
    id: "map",
    tag: "MAP",
    title: "Force-directed clusters",
    description: "Every holder is a bubble, sized by supply. Wallets funded from the same parent snap into colored clusters. Click any node to open its funding trace."
  },
  {
    id: "trace",
    tag: "TRACE",
    title: "Funding provenance",
    description: "Follow the SOL backward: bridge, CEX, or parent wallet. See wallet age, every token it has touched, and its full deployer history in one panel."
  },
  {
    id: "bundle",
    tag: "BUNDLE",
    title: "Bundler detection",
    description: "Behavioral heuristics run on the block stream and flag bundle clusters as they form, so you see distribution starting before the chart tells you."
  },
  {
    id: "social",
    tag: "SOCIAL",
    title: "Social discovery",
    description: "The moment a tracked account or KOL posts a contract, it surfaces in your feed with the CA extracted and scored. Catch the call, not the aftermath."
  },
  {
    id: "smart",
    tag: "SMART",
    title: "Smart money tracker",
    description: "A curated and algorithmic list of profitable wallets, ranked by realized PnL and early-entry rate. Follow one and get a realtime alert when it moves."
  },
  {
    id: "dev",
    tag: "DEV",
    title: "Dev profiler",
    description: "Per deployer: tokens launched, rug and dump rate, average token lifespan, linked wallets. Serial ruggers get a badge before they hit you."
  }
];

export const TRUST_ITEMS: TrustItem[] = [
  {
    id: "no-wallet",
    number: "01",
    title: "No wallet connect",
    description: "Paste an address to watch it. Nothing to sign, nothing to approve, no popup. Your wallet stays yours."
  },
  {
    id: "no-execution",
    number: "02",
    title: "No execution",
    description: "There is no buy, sell, snipe, or deploy button anywhere. JXTENTO is intelligence, not a router. That is the whole point."
  },
  {
    id: "no-custody",
    number: "03",
    title: "No custody",
    description: "We hold no SOL and no private keys, ever. There is no surface to drain because there is nothing to drain."
  }
];

export const TOKEN_DETAILS: TokenDetails = {
  kicker: "$JXTENTO · SOLANA",
  title: "Hold to unlock Pro.",
  description: "New fair launch on Solana. Holders unlock the full intel stack: bubble map traces, bundler alerts, smart money follows, and Copilot. Free tier stays open for the trenches feed.",
  stats: [
    { label: "Supply", value: "1,000,000,000" },
    { label: "Launch", value: "Fair · Solana" },
    { label: "Utility", value: "Hold to unlock Pro" },
    { label: "Access", value: "Free trenches feed" }
  ]
};

export const TICKERS = ["BONK", "WIF", "POPCAT", "MEW", "MOODENG", "PNUT", "GOAT", "FWOG", "GIGA", "RETARDIO", "PONKE", "MICHI"];
export const FLAGS = ["dev funded", "bundle 34%", "smart in", "new pair", "LP locked", "rug flag", "trace ok"];

