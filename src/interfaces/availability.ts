export interface IAvailability {
  disponibilidade: boolean;
  availability: boolean;
  encontrado_via_range: boolean;
  range_max: number;
  range_min: number;
  dados: {
    id: number;
    UF: string;
    CIDADE: string;
    ARMARIO: string;
    TERRITORIO: string;
    LOGRADOURO: string;
    NUM: string;
    CEP: string;
    BAIRRO: string;
    TIPO: string;
    created_at: string;
    updated_at: string;
  };
}

export interface ISearchAvailabilityResponse {
  sucesso: boolean;
  dados: IAvailability[];
  paginacao: {
    total: number;
    limite: number;
    pagina: number;
    totalPaginas: number;
  };
  filtros: {
    uf?: string;
    cidade?: string;
    limite?: number;
    page?: number;
    cep?: string;
    numero?: string;
    bairro?: string[];
  };
}

export interface IBulkAvailabilityResult {
  linha: number;
  cep: string;
  numero: string | null;
  disponibilidade: boolean;
  encontrado_via_range: boolean;
  range_min: number;
  range_max: number;
  uf: string;
  cidade: string;
  bairro: string;
  endereco_completo: string;
  logradouro: string;
  numero_endereco: string;
  armario: string;
  tipo: string;
  territorio: string;
}

export interface IBulkAvailabilityReport {
  total: number;
  com_disponibilidade: number;
  sem_disponibilidade: number;
  erros: number;
}

export interface IBulkAvailabilityResponse {
  sucesso: boolean;
  mensagem: string;
  relatorio: IBulkAvailabilityReport;
  paginacao: {
    total: number;
    limite: number;
    pagina: number;
    totalPaginas: number;
  };
  resultados: IBulkAvailabilityResult[];
}
