import { api } from "@/configs/api";
import { VROrder } from "@/interfaces/VROrder";

export type VROrderType = "RH" | "BENEFICIOS" | "MOBILIDADE";
export type VROrderStatus = "ABERTO" | "FECHADO" | "CANCELADO";

export interface IGetVROrdersParams {
  page?: number;
  per_page?: number;
  order_type?: VROrderType;
  order_number?: number;
  status?: VROrderStatus;
  date_from?: string;
  date_to?: string;
}

export interface IGetVROrdersResponse {
  success: boolean;
  orders: VROrder[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface IUpdateVROrderStatusPayload {
  status: VROrderStatus;
}

export class VROrdersService {
  async getOrders({
    page = 1,
    per_page = 20,
    order_type,
    order_number,
    status,
    date_from,
    date_to,
  }: IGetVROrdersParams): Promise<IGetVROrdersResponse> {
    const res = await api.get<IGetVROrdersResponse>("/orders", {
      params: {
        page,
        per_page,
        order_type,
        order_number,
        status,
        date_from,
        date_to,
      },
    });

    return res.data;
  }

  async deleteOrder(id: number): Promise<void> {
    await api.delete(`/orders/${id}`);
  }

  async updateOrderStatus(
    id: number,
    data: IUpdateVROrderStatusPayload,
  ): Promise<void> {
    await api.patch(`/orders/${id}/status`, data);
  }
}
