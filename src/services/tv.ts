import { apiPurchase } from "@/configs/api";

export class TVService {
  async allTV(): Promise<any> {
    const response = await apiPurchase.get(`/pedidos-tv`);
    return response.data;
  }

  async allTVFiltered({
    plan,
    fullname,
    phone,
    cpf,
    cnpj,
    razaosocial,
    ordernumber,
    page,
    limit,
    data_ate,
    data_de,
    sort,
    status,
    order,
    availability,
    status_pos_venda,
    consulta,
    pedido,
    initial_status,
  }: {
    availability?: boolean;
    plan?: string;
    fullname?: string;
    phone?: string;
    cpf?: string;
    cnpj?: string;
    razaosocial?: string;
    ordernumber?: string | number;
    page?: string | number;
    status_pos_venda?: string;
    limit?: string | number;
    data_ate?: string;
    data_de?: string;
    status?: string;
    sort?: string;
    order?: "asc" | "desc" | null;
    initial_status?: string;
    consulta?: boolean | number;
    pedido?: boolean | number;
  }): Promise<any> {
    const res = await apiPurchase.get(`/pedidos-tv`, {
      params: {
        availability: availability,
        plan: plan,
        fullname: fullname,
        phone: phone,
        cpf: cpf,
        cnpj: cnpj,
        razaosocial: razaosocial,
        ordernumber: ordernumber,
        page: page || 1,
        limit: limit || 200,
        data_ate: data_ate,
        data_de: data_de,
        status: status,
        sort: sort || "data_criacao",
        status_pos_venda: status_pos_venda,
        order: order || "desc",
        consulta: consulta,
        pedido: pedido,
        initial_status: initial_status,
      },
    });

    return res.data;
  }

  async updateTVOrderInfo(id: number, data: any): Promise<any> {
    const response = await apiPurchase.put(`/pedidos-tv/${id}`, data);
    return response.data;
  }
  async removeTVOrder(id: number) {
    await apiPurchase.delete(`/pedidos-tv/${id}`);
  }

  async changeTVOrderStatus(id: number, data: { status: string }) {
    await apiPurchase.patch(`/pedidos-tv/${id}/status`, data);
  }
}
