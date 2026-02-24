export interface IPlanBLStock {
  id: string;
  plan_name: string;
  plan_price_from: string | number;
  plan_price_to: string | number;

  online: boolean;
  plan_speed: string;
  plan_badge: string;
  type_client: string;
  offer_conditions: string[];
  details: {
    title: string;
    description: string;
    images: string[];
    highlight_top: boolean;
    highlight_bottom: boolean;
  }[];
  created_at: string;
  updated_at: string;
}

export interface IPlanBLtockFilters {
  planName: string | null;
  planSpeed: string | null;
  minPrice: number | string | undefined;
  maxPrice: number | string | undefined;
  online: boolean | null;
  tipo: string | null;
  type_client: string | null;
}
