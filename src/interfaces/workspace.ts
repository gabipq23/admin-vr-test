import { StatusType } from "./purchase";

export interface Workspace {
  accept_contact: number;
  accept_terms: number;
  already_have_workspace: number;
  client_ip: string;
  cnpj: string;
  company_name: string;
  consultor_responsavel?: string;
  cpf: string;
  created_at: string;
  credito_servicos: number | string;
  domain_name: string | null;
  email: string;
  equipe: string | null;
  finger_print: string;
  i_have_authorization: boolean;
  id: number;
  id_crm?: number;
  id_vivo_corp?: string;
  is_vivo_client: number;
  manager_name: string | null;
  manager_phone: string | null;
  obs_consultor: string | null;
  observacao_consultor: string;
  ordernumber: number;
  plans: WorkspacePlan[];
  second_manager_phone: string;
  status: StatusType | null;
  status_pos_venda?: string;
  updated_at: string;
  url: string;
}

export interface WorkspaceFilters {
  alreadyHaveWorkspace?: string | number | boolean | null;
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

export interface WorkspacePlan {
  id: number;
  newPlan?: boolean;
  planName: string;
  price: string;
  type: string;
  users: number;
}

export interface WorkspaceResponse {
  data: Workspace[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
  success: boolean;
}
