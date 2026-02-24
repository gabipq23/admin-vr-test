export interface IContact {
  id: number;
  nome: string;
  empresa: string;
  telefone: string;
  email: string;
  assunto: string;
  mensagem: string;
  data_criacao: string;
  status: string;
  status_mensagem: string;
  cnpj: string;
  total?: string;
}
export interface IContactResponse {
  total: number;
  page: number;
  limit: number;
  data: IContact[];
  assunto_enum: string[];
}
export interface IFilters {
  cnpj?: string | null;
  nome?: string | null;
  email?: string | null;
  status_mensagem?: string | null;
  data_de?: string | null;
  data_ate?: string | null;
  assunto?: string | null;
  sort?: string | null;
  order?: "asc" | "desc" | null;
}
