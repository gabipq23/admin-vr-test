import { apiPurchase } from "@/configs/api";
import { IProduct } from "@/interfaces/product";

export class ProductsStockService {
  async allProducts({
    marca,
    modelo,
    cod_sap,
    online,
    tipo,
    minPreco24x,
    maxPreco24x,
    novo,
  }: {
    marca: string;
    modelo: string;
    cod_sap: string;
    online?: string;
    minPreco24x?: string | number;
    maxPreco24x?: string | number;
    tipo: string;
    novo?: boolean;
  }): Promise<IProduct[]> {
    const res = await apiPurchase.get(`/aparelhos`, {
      params: {
        marca: marca,
        modelo: modelo,
        cod_sap: cod_sap,
        online: online,
        tipo: tipo,
        minPreco24x: minPreco24x || undefined,
        maxPreco24x: maxPreco24x || undefined,
        novo: novo,
      },
    });
    return res.data;
  }

  async changeProductStatus(id: number, online: boolean): Promise<void> {
    await apiPurchase.patch(`/aparelhos/${id}/online`, { online });
  }

  async updateDevice(id: number, data: any): Promise<any> {
    const res = await apiPurchase.patch(`/aparelhos/${id}/ficha-tecnica`, data);
    return res.data;
  }
}
