import { api, apiPurchase } from "../configs/api";
import { ICompany, IConsult } from "../interfaces/consult";

export class ConsultService {
  async allConsultInfo(cnpj: string): Promise<IConsult> {
    const res = await api.get(`/dados/${cnpj}`);
    return res.data;
  }

  async getNewOpenInvoices(cnpj: string): Promise<IConsult> {
    const res = await api.get(`/dados/${cnpj}/reload`);
    return res.data;
  }

  async allCompanyListToCheckCNPJAndId(): Promise<ICompany[]> {
    const res = await apiPurchase.get(`/empresas/all`);
    return res.data;
  }
}
