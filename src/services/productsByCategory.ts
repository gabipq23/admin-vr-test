import { apiPurchase } from "@/configs/api";

export class ProductsByCategoryService {
  // Telefonia Fixa
  async getAllTelefoneFixoCategory({
    valorMin,
    valorMax,
  }: {
    valorMin?: string | number;
    valorMax?: string | number;
  }): Promise<any[]> {
    const res = await apiPurchase.get(`/produtos/categoria/telefonia-fixa`, {
      params: {
        valorMin,
        valorMax,
      },
    });
    return res.data;
  }
  async createTelefoneFixoCategory(data: any): Promise<any> {
    const res = await apiPurchase.post(
      `/produtos/categoria/telefonia-fixa`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data;
  }

  // Telefonia Movel
  async getAllTelefoneMovelCategory({
    valorMin,
    valorMax,
  }: {
    valorMin?: string | number;
    valorMax?: string | number;
  }): Promise<any[]> {
    const res = await apiPurchase.get(`/produtos/categoria/telefonia-movel`, {
      params: {
        valorMin,
        valorMax,
      },
    });
    return res.data;
  }
  async createTelefoneMovelCategory(data: any): Promise<any> {
    const res = await apiPurchase.post(
      `/produtos/categoria/telefonia-movel`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data;
  }

  // Streaming
  async getAllStreamingCategory({
    valorMin,
    valorMax,
    online,
    audience,
  }: {
    valorMin?: string | number;
    valorMax?: string | number;
    online?: boolean;
    audience?: string;
  }): Promise<any[]> {
    const res = await apiPurchase.get(`/produtos/categoria/streaming`, {
      params: {
        valorMin,
        valorMax,
        online,
        audience,
      },
    });
    return res.data;
  }
  async createStreamingCategory(data: any): Promise<any> {
    const res = await apiPurchase.post(`/produtos/categoria/streaming`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }

  // TV
  async getAllTTvCategory({
    valorMin,
    valorMax,
    status,
    audience,
  }: {
    valorMin?: string | number;
    valorMax?: string | number;
    status?: string;
    audience?: string;
  }): Promise<any[]> {
    const res = await apiPurchase.get(`/produtos/categoria/tv`, {
      params: {
        valorMin,
        valorMax,
        status,
        audience,
      },
    });
    return res.data;
  }

  async createTTvCategory(data: any): Promise<any> {
    const res = await apiPurchase.post(`/produtos/categoria/tv`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }
  async updateProductsByCategory(id: string, data: any): Promise<any> {
    const res = await apiPurchase.put(`/produtos/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }

  async changePlanTVStatus(id: string): Promise<void> {
    await apiPurchase.patch(`/produto_categoria/${id}/online`);
  }
  async removeProductsByCategory(id: string) {
    await apiPurchase.delete(`/produtos/${id}`);
  }
}
