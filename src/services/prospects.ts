import { apiPurchase } from "../configs/api";

export class ProspectsService {
  async allProspectsList({
    id,
    cnpj,
    razao_social,
    telefone,
    possivel_prospect_seguro,
    possivel_prospect_nova_linha,
    possivel_prospect_iphone_17,
    page,
    limit,
  }: {
    id?: string | number;
    cnpj?: string;
    razao_social?: string;
    telefone?: string;
    possivel_prospect_seguro?: number | undefined;
    possivel_prospect_nova_linha?: number | undefined;
    possivel_prospect_iphone_17?: number | undefined;
    page?: string | number;
    limit?: string | number;
  }): Promise<any> {
    const res = await apiPurchase.get(`/pedidos/prospects`, {
      params: {
        id: id,
        telefone: telefone,
        razao_social: razao_social,
        cnpj: cnpj,
        possivel_prospect_seguro: possivel_prospect_seguro,
        possivel_prospect_nova_linha: possivel_prospect_nova_linha,
        possivel_prospect_iphone_17: possivel_prospect_iphone_17,
        page: page || 1,
        limit: limit || 200,
      },
    });

    return res.data;
  }
}
