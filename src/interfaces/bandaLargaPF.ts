import { StatusType } from "./purchase";

export interface OrderBandaLargaPFResponse {
  pedidos: OrderBandaLargaPF[];
  status_pos_venda_enum: string[];
}

export interface OrderBandaLargaPF {
  credito?: number | string;
  accept_offers: number;
  address: string;
  cep_unico: number;
  encontrado_via_range: number;
  range_max: string;
  range_min: string;
  addressblock: string;
  addresscomplement: string;
  addressFloor: string;
  addresslot: string;
  addressnumber: string;
  addressreferencepoint: string;
  availability: boolean | number;
  birthdate: string;
  buildingorhouse: number | string;
  cep: string;
  city: string;
  client_ip: string;
  consultor_responsavel?: string;
  consulta: boolean;
  cpf: string;
  created_at: string;
  district: string;
  dueday: number;
  email: string;
  equipe: string;
  finger_print?: {
    os: { name: string; version: string };
    browser: { name: string; version: string };
    device: string;
    timezone: string;
    timezone_offset: number;
    resolution?: { dpr: number; height: number; width: number };
  };
  fixedLineNumberToPort?: string | null;
  hasFixedLinePortability?: boolean | number;
  fullname: string;
  nome_receita: string;
  data_de_nascimento_receita: string;
  nome_da_mae_receita: string;
  id: number;
  id_consult: string;
  id_crm?: number;
  id_order: string;
  id_vivo_corp?: string;
  installation_preferred_date_one: string;
  installation_preferred_date_two: string;
  installation_preferred_period_one: string;
  installation_preferred_period_two: string;
  motherfullname: string;
  numero_valido: boolean | number;
  ordernumber: number;
  obs_consultor: string;
  observacao_consultor: string;
  operadora: string;
  pedido: boolean;
  phone: string;
  phoneAdditional?: string;
  plan: {
    name: string;
    price: number;
    id: string;
    speed: string;
  };
  razaosocial?: string;
  status: string;
  status_pos_venda?: string;
  state: string;
  terms_accepted: number;
  typeclient: "PF" | "PJ";
  url: string;
  wantsFixedIp: boolean;
  mei?: boolean;
  socio?: boolean;
  empresas: string;
  device: string;
  provider: string;
  provedor: string;
  so: string;
  ip_isp: string;
  ip_tipo_acesso: string;
  is_comercial?: boolean;
  nome_whatsapp?: string;
  recado?: string;
  avatar?: string;
  is_mei: boolean | number;
  is_socio: boolean | number;
  socios_empresas: SociosEmpresas[];
  voz_fixa?: string;
  browser?: string;
  resolution?: string;
  numero_adicional_valido: boolean | number;
  operadora_adicional: string;
  whatsapp?: WhatsAppInfo;
  availability_pap?: boolean;
  temperatura_pf?: number;
  genero_receita?: string;
  portabilidade?: string;
  data_portabilidade?: string;
  portabilidade_adicional?: string;
  data_portabilidade_adicional?: string;
  fingerprintId?: string;
  second_call?: {
    attempts: {
      cpf: string;
      birthdate: string;
      fullname: string;
      motherfullname: string;
    }[];
    number_attempts: number;
  };
  geolocalizacao?: {
    sucesso: boolean;
    latitude: string;
    precisao: string;
    link_maps: string;
    longitude: string;
    consultado_em: string;
    cep_mais_proximo: string;
    link_street_view: string;
    endereco_formatado: string;
    tem_disponibilidade: boolean;
    distancia_km_ponto_mais_proximo: number;
  };
}

export interface WhatsAppInfo {
  links: string[];
  avatar: string | null;
  numero: string | null;
  recado: string;
  sucesso: boolean;
  endereco: string | null;
  categoria: string;
  is_comercial: boolean;
  verificado_em: string;
  existe_no_whatsapp: boolean;
}

interface SociosEmpresas {
  cnpj: string;
  nome: string;
  porte: string;
}

export interface BandaLargaFilters {
  status_pos_venda?: string | null;
  availability?: boolean;
  plan?: string;
  fullname?: string;
  phone?: string;
  cpf?: string;
  cnpj?: string;
  razaosocial?: string;
  ordernumber?: string;
  data_de?: string;
  data_ate?: string;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
  status: StatusType | null;
  consulta?: boolean | number;
  pedido?: boolean | number;
  initial_status?: string;
}
