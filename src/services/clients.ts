import { apiPurchase } from "../configs/api";
import { ICompanyResponse } from "../interfaces/consult";

export class ClientsService {
  async allCompanyList({
    nr_cnpj,
    nm_cliente,
    situacao_cadastral,
    opcao_pelo_mei,
    porte,
    page,
    limit,
    credito_min,
    credito_max,
    M_min,
    M_max,
    quantidade_telefones_min,
    quantidade_telefones_max,
    credito_equipamentos_min,
    credito_equipamentos_max,
    marca,
    modelo,
    sort,
    order,
  }: {
    nr_cnpj?: string;
    nm_cliente?: string;
    situacao_cadastral?: string;
    opcao_pelo_mei?: string;
    porte?: string;
    credito_min?: string | number;
    credito_max?: string | number;
    M_min?: string | number;
    M_max?: string | number;
    quantidade_telefones_min?: string | number;
    quantidade_telefones_max?: string | number;
    credito_equipamentos_min?: string | number;
    credito_equipamentos_max?: string | number;
    marca?: string;
    modelo?: string;
    page?: string | number;
    limit?: string | number;
    sort?: string;
    order?: "asc" | "desc" | null;
  }): Promise<ICompanyResponse> {
    const res = await apiPurchase.get(`/empresas`, {
      params: {
        nr_cnpj: nr_cnpj || "",
        nm_cliente: nm_cliente || "",
        situacao_cadastral: situacao_cadastral || "",
        opcao_pelo_mei: opcao_pelo_mei || "",
        porte: porte || "",
        credito_min: credito_min || undefined,
        credito_max: credito_max || undefined,
        M_min: M_min || undefined,
        M_max: M_max || undefined,
        quantidade_telefones_min: quantidade_telefones_min || undefined,
        quantidade_telefones_max: quantidade_telefones_max || undefined,
        credito_equipamentos_min: credito_equipamentos_min || undefined,
        credito_equipamentos_max: credito_equipamentos_max || undefined,
        marca: marca || "",
        modelo: modelo || "",
        page: page || 1,
        limit: limit || 200,
        sort: sort || "nm_cliente",
        order: order || "desc",
      },
    });
    return res.data;
  }

  async allBrandsList(): Promise<string[]> {
    const res = await apiPurchase.get("/marcas");
    return Array.isArray(res.data) ? res.data : [];
  }
}
