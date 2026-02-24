import { apiPurchase } from "@/configs/api";
import { IPlanBLStock } from "@/interfaces/plansBLStock";

export class PlansBLStockService {
  async allPlansBLStock({
    planName,
    planSpeed,
    minPrice,
    maxPrice,
    online,
    tipo,
    type_client,
  }: {
    planName?: string;
    planSpeed?: string;
    minPrice?: string | number;
    maxPrice?: string | number;
    online?: string | boolean;
    tipo?: string;
    type_client?: string;
  }): Promise<IPlanBLStock[]> {
    const res = await apiPurchase.get(`/estoque-banda-larga`, {
      params: {
        planName,
        planSpeed,
        minPrice,
        maxPrice,
        online,
        tipo,
        type_client,
      },
    });
    return res.data;
  }

  async updatePlansBL(id: string, data: any): Promise<any> {
    const res = await apiPurchase.put(`/estoque-banda-larga/${id}`, data);
    return res.data;
  }

  async changePlanStatus(id: string, online: boolean): Promise<void> {
    await apiPurchase.patch(`/estoque-banda-larga/${id}/status`, { online });
  }

  async createPlanBL(data: any): Promise<any> {
    const res = await apiPurchase.post(`/estoque-banda-larga`, data);
    return res.data;
  }

  async removePlanBL(id: string) {
    await apiPurchase.delete(`/estoque-banda-larga/${id}`);
  }
}
