export interface OrdersTVResponse {
  pedidos: OrderTV[];
}
export interface PriceSummary {
  additionals_monthly: number;
  base_monthly: number;
  currency: string;
  installation_fee: number;
  total_monthly: number;
}

export interface OrderTV {
  address: string | null;
  addressFloor: string | null;
  addresscomplement: string | null;
  addressnumber: string | null;
  addressreferencepoint: string | null;
  birthdate: string | null;
  buildinghouse: string | null;
  cep: string | null;
  city: string | null;
  client_ip: string | null;
  cpf: string | null;
  created_at: string | null;
  district: string | null;
  dueday: number | null;
  email: string | null;
  fullname: string | null;
  id: number | null;
  installation_preferred_date_one: string | null;
  installation_preferred_date_two: string | null;
  installation_preferred_period_one: string | null;
  installation_preferred_period_two: string | null;
  ordernumber: string | null;
  phone: string | null;
  plan: string | null;
  price_summary: PriceSummary;
  state: string | null;
  status: string | null;
  terms_accepted: number | null;
  typeclient: string | null;
  url: string | null;
}
