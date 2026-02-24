import { apiPurchase } from "@/configs/api";
import { Office } from "@/interfaces/office";

export class OfficeService {
  async allOffices(): Promise<Office> {
    const response = await apiPurchase.get(`/pedidos-office`);
    return response.data;
  }

  async allOfficesFiltered({
    key,
    status,
    sort,
    order,
    cnpj,
    plan,
    page,
    limit,
    company_name,
    alreadyHaveMicrosoftDomain,
    isVivoClient,
    data_de,
    data_ate,
    id,
  }: {
    key?: string;
    status?: string;
    sort?: string;
    order?: "asc" | "desc" | null;
    cnpj?: string;
    plan?: string;
    page?: string | number;
    limit?: string | number;
    company_name?: string;
    alreadyHaveMicrosoftDomain?: string | number | boolean;
    isVivoClient?: string | number | boolean;
    data_de?: string;
    data_ate?: string;
    id?: string | number;
  }): Promise<any> {
    const res = await apiPurchase.get(`/pedidos-office`, {
      params: {
        key: key,
        status: status,
        sort: sort || "data_criacao",
        order: order || "desc",
        cnpj: cnpj,
        plan: plan,
        page: page || 1,
        limit: limit || 200,
        company_name: company_name,
        alreadyHaveMicrosoftDomain: alreadyHaveMicrosoftDomain,
        isVivoClient: isVivoClient,
        data_de: data_de,
        data_ate: data_ate,
        id: id,
      },
    });

    return res.data;
  }

  async updateOfficeOrderInfo(id: number, data: any): Promise<any> {
    const response = await apiPurchase.put(`/pedidos-office/${id}`, data);
    return response.data;
  }

  async removeOfficeOrder(id: number) {
    await apiPurchase.delete(`/pedidos-office/${id}`);
  }

  async changeOfficeOrderStatus(id: number, data: { status: string }) {
    await apiPurchase.patch(`/pedidos-office/${id}/status`, data);
  }
}
