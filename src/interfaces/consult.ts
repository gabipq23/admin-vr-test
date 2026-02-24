export interface IConsult {
  dados: {
    nomeFantasia: string;
    documento: string;
    codigo_grupo: string;
    segmento: string;
  };
  dadosDocumentacao: {
    endereco: string;
    cards: string[];
  };
  dadosTabela: DadoTabela[] | DadoTabela | "não tem dados";
  planta: { titulo: string; imagem: string; quantidade: string }[];
}
export interface IConsultDocumentationResult {
  documentacao: {
    CNAE: string;
    Cliente: string;
    "E-mail": string;
    Nome: string;
    Segmento: string;
    Totalizado: string;
  };
}
export interface IConsultCellParkResult {
  parqueCelular: {
    clientes: Record<string, string> | Record<string, string>[];
    produtos: Record<string, string> | Record<string, string>[];
  };
}
export interface IConsultCellFixedResult {
  parqueFixo: fixedPark;
}

export interface IConsult360VisionResult {
  parqueFixo: fixedPark;
  visao360: {
    carteirizacao: Record<string, string> | Record<string, string>[];
    contatos_e_adicionais: Record<string, string> | Record<string, string>[];
    dados_cadastrais: Record<string, string> | Record<string, string>[];
    parques: Record<string, string> | Record<string, string>[];
    recomendacao: Record<string, string> | Record<string, string>[];
    telefones: Record<string, string> | Record<string, string>[];
    trilhas: Record<string, string> | Record<string, string>[];
  };
}

type fixedPark = {
  clientes: Record<string, string> | Record<string, string>[];
  produtos: Record<string, string> | Record<string, string>[];
  recomendacao: Record<string, string> | Record<string, string>[];
};

export interface DadoTabela {
  cliente: string;
  billings: string;
  contrato: string;
  periodo: string;
  valor: string;
  vencimento: string;
  data_de_corte: string;
  code: string;
  retorno: string;
  sistema: string;
}

export interface ICompany {
  id: string;
  nr_cnpj: string;
  nr_cep: string;
  numero_fachada: string;
  complemento: string;
  situacao_cadastral: string;
  porte: string;
  bairro: string;
  cidade: string;
  uf: string;
  opcao_pelo_mei: boolean;
  nome_gestor?: string;
  email_gestor?: string;
  telefone_gestor?: string;
  cnae_fiscal?: string;
  marcas_modelos: {
    marca: string;
    modelo: string;
  }[];
  credito_cliente: {
    aparelho_atual: string;
    credito: number;
    credito_equipamentos: number | string;
    data_atualizacao: string;
    endereco: string;
    razao_social: string;
    telefones: {
      telefone: string;
      M: number;
      elegiveis: boolean;
    }[];
  };
}

export interface ICompanyResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  empresas: ICompany[];
}
export interface ICompanyFilter {
  nr_cnpj?: string | null;
  nm_cliente?: string | null;
  situacao_cadastral?: string | null;
  opcao_pelo_mei?: string | null;
  porte?: string | null;
  marca?: string | null;
  modelo?: string | null;
  page: number;
  limit: number;
  credito_min?: string | number;
  credito_max?: string | number;
  M_min?: string | number;
  M_max?: string | number;
  quantidade_telefones_min?: string | number;
  quantidade_telefones_max?: string | number;
  credito_equipamentos_min?: string | number;
  credito_equipamentos_max?: string | number;
  sort?: string | null;
  order?: "asc" | "desc" | null;
}

export interface stateRecomendation {
  recomendacao: string;
  conta_cobranca: string;
  tipo_recomendacao: string;
  oferta: string;
  plano: string;
  valor_recomendacao: string;
  valor_oferta_movel: string;
}
