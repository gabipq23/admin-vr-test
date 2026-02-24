export interface MonthOffer {
  id: number;
  nome: string;
  data_upload: string;
  descricao: string;
  arquivo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateMonthOfferData {
  descricao?: string;
  nome?: string;
  arquivo_url?: string;
}
