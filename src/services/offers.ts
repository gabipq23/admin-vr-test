import { apiPurchase } from "@/configs/api";

export class OffersService {
  async allOffersFiltered({
    pagina,
    dataDe,
    dataAte,
    nome,
  }: {
    pagina?: number;
    dataDe?: string;
    dataAte?: string;
    nome?: string;
  }): Promise<any> {
    const res = await apiPurchase.get(`/ofertas-mes`, {
      params: {
        pagina: pagina,
        dataDe: dataDe,
        dataAte: dataAte,
        nome: nome,
      },
    });

    return res.data;
  }

  async inputOffers(file: File, descricao: string): Promise<any> {
    const formData = new FormData();
    formData.append("arquivo", file);
    formData.append("descricao", descricao);

    const response = await apiPurchase.post(`/ofertas-mes`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async downloadOfferFile(id: number, fileName: string): Promise<void> {
    const response = await apiPurchase.get(`/ofertas-mes/${id}/download`);
    const downloadUrl = response.data.url || response.data;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", fileName);
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async updateOffers(id: number, data: any): Promise<any> {
    const response = await apiPurchase.put(`/ofertas-mes/${id}`, data);
    return response.data;
  }

  async removeOffers(id: number) {
    await apiPurchase.delete(`/ofertas-mes/${id}`);
  }
}
