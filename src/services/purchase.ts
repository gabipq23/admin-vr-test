import { apiPurchase } from "@/configs/api";
import { IProduct } from "@/interfaces/product";
import {
  IAddItemInChartData,
  IPayloadUpdateData,
  IPurchase,
  IPurchaseResponse,
} from "src/interfaces/purchase";

export class PurchaseService {
  async allPurchases(): Promise<IPurchase[]> {
    const res = await apiPurchase.get(`/pedidos/filtro`);
    return res.data;
  }

  async allPurchasesFilterd({
    id,
    status,
    telefone,
    cnpj,
    page,
    razao_social,
    limit,
    data_ate,
    data_de,
    status_pos_venda,
    sort,
    order,
    equipe,
  }: {
    id?: string | number;
    status?: string;
    telefone?: string;
    data_ate?: string;
    data_de?: string;
    cnpj?: string;
    razao_social?: string;
    page?: string | number;
    limit?: string | number;
    status_pos_venda?: string;
    sort?: string;
    order?: "asc" | "desc" | null;
    equipe?: string;
  }): Promise<IPurchaseResponse> {
    const res = await apiPurchase.get(`/pedidos/filtro`, {
      params: {
        id: id,
        status: status,
        telefone: telefone,
        razao_social: razao_social,
        cnpj: cnpj,
        page: page || 1,
        limit: limit || 200,
        data_ate: data_ate,
        data_de: data_de,
        status_pos_venda: status_pos_venda,
        sort: sort || "data_criacao",
        order: order || "desc",
        equipe: equipe || "",
      },
    });

    return res.data;
  }

  async allProducts(): Promise<IProduct[]> {
    const res = await apiPurchase.get(`/aparelhos`);
    return res.data;
  }

  async removeItemFromOrder(id: number, item: number) {
    await apiPurchase.delete(`/pedidos/${id}/carrinho/itens/${item}`);
  }

  async removeOrder(id: number) {
    await apiPurchase.delete(`/pedidos/${id}`);
  }

  async changeCartStatus(id: string, data: { status: string }) {
    await apiPurchase.put(`/pedidos/${id}/status`, data);
  }
  async removeInsuranceFromProduct(id: number, itemId: number) {
    await apiPurchase.delete(`/pedidos/${id}/carrinho/itens/${itemId}/seguro`);
  }
  async addProductInChart(id: string | undefined, data: IAddItemInChartData) {
    await apiPurchase.post(`/pedidos/${id}/carrinho/itens`, data);
  }

  async updatePurchase(data: IPayloadUpdateData): Promise<IPurchase> {
    const res = await apiPurchase.put(`/pedidos/itens/lote`, data);
    return res.data;
  }

  async changePurchaseStatus(
    id: string | undefined,
    data: { status_pos_venda: string }
  ) {
    await apiPurchase.put(`/pedidos/${id}/status-pos-venda`, data);
  }
}
