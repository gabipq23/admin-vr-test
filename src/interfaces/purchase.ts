import { UseMutateFunction } from "@tanstack/react-query";

export interface IPurchaseResponse {
  total: number;
  page: number;
  limit: number;
  pedidos: IPurchase[];
  status_pos_venda_enum: string[];
}

export interface IProspectsResponse {
  total: number;
  page: number;
  limit: number;
  prospects: IPurchase[];
}
export interface IPurchase {
  equipe: string;
  observacao: string;
  modelo_reserva: string;
  email_reserva: string;
  cliente_gold: number;
  url: string;
  demanda: string;
  possivel_prospect_nova_linha?: number;
  possivel_prospect_seguro?: number;
  possivel_prospect_iphone_17?: number;
  credito_disponivel: number;
  M: string;
  id: string;
  cnpj: string;
  telefone_comprador: string;
  nome: string;
  telefone_foi_editado: number;
  email_foi_editado: number;
  observacao_foi_editado: number;
  complemento_foi_editado: number;
  telefone_alterado: string;
  email_alterado: string;
  email: string;
  telefone: string;
  endereco_sfa: string;
  cep: string;
  cidade: string;
  complemento: string;
  bairro: string;
  numero_fachada: string;
  uf: string;
  razao_social: string;
  gestor_sfa: string;
  total: number;
  total_calculado: number;
  credito_utilizado: string;
  parcelamento: number;
  valor_parcela_total: number;
  forma_pagamento: string;
  data_criacao: string;
  status: string;
  data_fechamento: string | null;
  valor_parcelado: string;
  observacao_endereco: string;
  itens: IPurchaseItens[];
  status_pos_venda: string;
  consultor_responsavel: string;
  id_vivo_corp: string;
  id_crm: number;

  quantidade_aparelhos: number;
  cliente: {
    cnpj: string;
    email: string;
    telefone: string;
    endereco: string;
    razao_social: string;
  };
  empresa: {
    situacao_cadastral: string;
    porte: string;
    bairro: string;
    opcao_pelo_mei: boolean;
    nr_cnpj: string;
    nm_cliente: string;
    nr_cep: string;
    numero_fachada: string;
    complemento: string;
    cidade: string;
    uf: string;
  };
  credito_cliente: {
    cnpj: string;
    aparelho_atual: string;
    credito: number;
    credito_equipamentos: number | string;
    data_atualizacao: string;
    email: string;
    endereco: string;
    razao_social: string;
    sfa: string;
    telefones: {
      telefone: string;
      M: number;
      elegiveis: boolean;
    }[];
  };
}

export type IPurchaseItens = {
  id: number;
  cod_sap: string;
  pedido_id: string;
  aparelho_id: number;
  quantidade: number;
  valor_unitario: string;
  valor_parcela: number;
  valor_parcelado: string;
  marca: string;
  modelo: string;
  cores?: string[];
  cor_escolhida?: string;
  parcelamento?: number;
  tipo: string;
  seguro_tipo: string;
  seguro_valor: number;
  subtotal: number;
};

export type IPurchaseNewItemPayload = {
  aparelho_id: number;
  cor: string;
  quantidade: number;
};

export type IPurchaseQtdChange = {
  id: number;
  quantidade: number;
};

export type IPurchaseColorChange = {
  id: number;
  color: string;
};

export type IPayloadUpdateData = (
  | {
      observacao?: string;
      pedido_id: string;
      forma_pagamento?: string;
      parcelamento?: number;
      complemento?: string;
      observacao_endereco?: string;
      consultor_responsavel?: string;
      id_vivo_corp?: string;
      id_crm?: number;
    }
  | {
      pedido_id: string;
      item_id?: number;
      quantidade?: number;
      cor?: string;
      seguro_tipo?: string;
    }
)[];

export type IPayloadUpdateDataItems = {
  pedido_id: string;
  id: string;
  quantidade: number;
  cor: string;
};

export type IPayloadUpdateDataFormValues = {
  observacao?: string;
  pedido_id: string | undefined;
  forma_pagamento?: string;
  parcelamento?: number;
  complemento?: string;
  observacao_endereco?: string;
  itens?: IPayloadUpdateDataItems[];
  telefone_alterado?: string;
  email_alterado?: string;
  nome?: string;
  telefone_comprador?: string;
  consultor_responsavel?: string;
  id_vivo_corp?: string;
  id_crm?: number;
  endereco_sfa?: string;
  bairro?: string;
  numero_fachada?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
};

export type RemoveItemParams = { id: number; item_id: number };

export type IRemoveItemFunction = UseMutateFunction<
  void,
  Error,
  { id: number; item_id: number },
  void
>;

export type IAddItemInChartFunction = {
  idProduto: string | undefined;
  produto: IAddItemInChartData;
};

export type IAddItemInChartData = {
  aparelho_id: number;
  quantidade: number;
  cor: string;
  parcelamento: number;
};

export type IChangeStatusCallFunction = UseMutateFunction<
  void,
  Error,
  IChangeStatusData,
  void
>;

export type IChangeStatusData = {
  id: string | undefined;
  data: { status_pos_venda: string };
};

export type StatusType = "aberto" | "fechado" | "cancelado";

export interface IFilters {
  equipe?: string | null;
  id: string | null;
  data_ate: string | null;
  data_de?: string | null;
  status: StatusType | null;
  telefone: string | null;
  cnpj: string | null;
  razao_social?: string | null;
  status_pos_venda?: string | null;
  order?: "asc" | "desc" | null;
  sort?: string | null;
  possivel_prospect_seguro?: number;
  possivel_prospect_nova_linha?: number;
  possivel_prospect_iphone_17?: number;
  demanda?: "nova_linha" | "seguro" | "reserva_iphone_17" | "ambos" | null;
}
