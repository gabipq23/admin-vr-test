export interface DataType {
  demanda: string;
  cliente_gold: number;
  telefone_comprador: string;
  email_alterado?: string;
  possivel_prospect_nova_linha?: number;
  possivel_prospect_seguro?: number;
  possivel_prospect_iphone_17?: number;
  telefone_alterado?: string;
  email?: string;
  endereco_sfa?: string;
  nome: string;
  M: string;
  id: string;
  cnpj: string;
  gestor_sfa: string;
  telefone: string;
  total: string;
  quantidade_aparelhos: number;
  status: string;
  telefone_foi_editado: number;
  email_foi_editado: number;
  observacao_foi_editado: number;
  complemento_foi_editado: number;
  data_criacao: string;
  data_fechamento: string;
  valor_parcela_total: string;
  itens: IPurchaseItens[];
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
    aparelho_atual: string;
    credito: number;
    credito_equipamentos: number | string;
    data_atualizacao: string;
    email: string;

    telefones: {
      telefone: string;
      M: number;
      elegiveis: boolean;
    }[];
  };
  whatsapp?: WhatsAppInfo;
  availability_pap?: string;
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
export type IPurchaseItens = {
  id: number;
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
  subtotal: number;
  cod_sap: string;
  seguro_tipo: string;
  seguro_valor: number;
};
