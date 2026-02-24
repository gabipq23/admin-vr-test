import { apiProducts } from "@/configs/api";

export interface IConsultProductsRequest {
  cnpj: string;
  tipo: Array<string>;
}

export class ConsultProductsService {
  async allConsultProducts(request: IConsultProductsRequest): Promise<IConsultProductsRequest> {
    const res = await apiProducts.post(`/api/b2b/`, {
      cnpj: request.cnpj,
      tipo: request.tipo,
    });
    return res.data;
  }
}
