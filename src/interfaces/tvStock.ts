export type TVAudience = "CLIENT" | "NON_CLIENT";

export interface TVPricing {
  base_monthly: number;
  installation: number;
}

export interface TVDetail {
  title: string;
  images: string[];
  description: string;
  highlight_top: boolean;
  highlight_bottom: boolean;
}

export interface TVOfferCondition {
  url: string;
  type: string;
}

export interface TVCheckoutFlow {
  audience: TVAudience;
  steps: string[];
}

export interface TVExtraCardGroupItem {
  id: string;
  price: number;
  title: string;
  included?: boolean;
  subtitle?: string;
  preselected?: boolean;
  name?: string;
  ui_type?: string;
}

export interface TVExtraCardGroup {
  id: string;
  ui_type: "card_group";
  group_title: string;
  items: TVExtraCardGroupItem[];
}

export interface TVExtraOption {
  value?: number;
  label?: string;
  price: number;
  id?: string;
  name?: string;
  ui_type?: string;
}

export interface TVExtraOptions {
  id: string;
  title: string;
  default_value?: number;
  options: TVExtraOption[];
  ui_type?: string;
}

export interface TVExtraSimple {
  id: string;
  title: string;
  price: number;
  subtitle?: string;
  default_checked?: boolean;
  ui_type?: string;
}

export type TVExtra = TVExtraCardGroup | TVExtraOptions | TVExtraSimple;

export interface TVPlanExtrasSegmented {
  client: TVExtra[];
  non_client: TVExtra[];
}

export interface TVPlan {
  id: number;
  category: string;
  type: string;
  online: boolean;
  available_for: TVAudience[];
  badge?: string;
  offer_conditions: TVOfferCondition[];
  name: string;
  offer_title?: string;
  offer_subtitle?: string;
  pricing: TVPricing;
  details: TVDetail[];
  created_at: string;
  updated_at: string;
  checkout_flow: TVCheckoutFlow | TVCheckoutFlow[];
  extras: TVPlanExtrasSegmented;
}
