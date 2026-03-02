import { api } from "@/configs/api";
import { VROrder } from "@/interfaces/VROrder";

export type VROrderType = "RH" | "BENEFICIOS" | "MOBILIDADE";

export interface IGetVROrdersParams {
  page?: number;
  per_page?: number;
  order_type?: VROrderType;
}

export interface IGetVROrdersResponse {
  success: boolean;
  orders: VROrder[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export class VROrdersService {
  async getOrders({
    page = 1,
    per_page = 20,
    order_type,
  }: IGetVROrdersParams): Promise<IGetVROrdersResponse> {
    const res = await api.get<IGetVROrdersResponse>("/orders", {
      params: {
        page,
        per_page,
        order_type,
      },
    });

    return res.data;
  }

  async deleteOrder(id: number): Promise<void> {
    await api.delete(`/orders/${id}`);
  }
}
