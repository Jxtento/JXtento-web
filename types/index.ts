export interface NavigationLink {
  label: string;
  href: string;
}

export interface FeatureItem {
  id: string;
  tag: string;
  title: string;
  description: string;
}

export interface TrustItem {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface TokenStat {
  label: string;
  value: string;
}

export interface TokenDetails {
  kicker: string;
  title: string;
  description: string;
  stats: TokenStat[];
}
