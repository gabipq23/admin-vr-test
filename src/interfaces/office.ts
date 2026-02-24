import { StatusType } from "./purchase";

export interface Office {
  acceptContact: boolean | number;
  acceptTerms: boolean | number;
  alreadyHaveMicrosoftDomain: boolean | number;
  client_ip: string;
  cnpj: string;
  company_name: string;
  consultor_responsavel?: string;
  cpf: string;
  created_at: string;
  credito_servicos: number | string;
  domainName: string | null;
  email: string;
  equipe: string | null;
  finger_print: string;
  i_have_authorization: boolean;
  id: number;
  id_crm?: number;
  id_vivo_corp?: string;
  isVivoClient: boolean | number;
  managerName?: string | null;
  managerPhone: string | null;
  manager_name?: string | null;
  obs_consultor: string | null;
  observacao_consultor: string;
  ordernumber?: string | number;
  plans: OfficePlan[];
  second_manager_phone: string;
  status: StatusType | string | null;
  status_pos_venda?: string;
  updated_at: string;
  url: string;
}

export interface OfficeFilters {
  alreadyHaveMicrosoftDomain?: string | number | boolean | null;
  cnpj?: string;
  company_name?: string;
  data_ate?: string;
  data_de?: string;
  id?: string | number;
  isVivoClient?: string | number | boolean | null;
  key?: string;
  limit?: number;
  order?: "asc" | "desc";
  page?: number;
  plan?: string;
  sort?: string;
  status?: string;
}

export interface OfficePlan {
  id?: number;
  newPlan?: boolean;
  planName: string;
  price: string;
  type: string;
  users: number;
}

export interface OfficeResponse {
  data: Office[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
  success: boolean;
}
