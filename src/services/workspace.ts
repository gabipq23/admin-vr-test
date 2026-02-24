import { apiPurchase } from "@/configs/api";
import { Workspace, WorkspaceResponse } from "@/interfaces/workspace";

export class WorkspaceService {
  async allWorkspaces(): Promise<Workspace> {
    const response = await apiPurchase.get(`/workspace/pedidos`);
    return response.data;
  }

  async allWorkspacesFiltered({
    key,
    status,
    sort,
    order,
    cnpj,
    plan,
    page,
    limit,
    company_name,
    alreadyHaveWorkspace,
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
    alreadyHaveWorkspace?: string | number | boolean;
    isVivoClient?: string | number | boolean;
    data_de?: string;
    data_ate?: string;
    id?: string | number;
  }): Promise<WorkspaceResponse> {
    const res = await apiPurchase.get(`/workspace/pedidos`, {
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
        alreadyHaveWorkspace: alreadyHaveWorkspace,
        isVivoClient: isVivoClient,
        data_de: data_de,
        data_ate: data_ate,
        id: id,
      },
    });

    return res.data;
  }

  async updateWorkspaceOrderInfo(id: number, data: any): Promise<any> {
    const response = await apiPurchase.put(`/workspace/pedidos/${id}`, data);
    return response.data;
  }

  async removeWorkspaceOrder(id: number) {
    await apiPurchase.delete(`/workspace/pedidos/${id}`);
  }

  async changeWorkspaceOrderStatus(id: number, data: { status: string }) {
    await apiPurchase.patch(`/pedidos-workspace/${id}/status`, data);
  }
}
