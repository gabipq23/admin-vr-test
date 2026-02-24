import { apiPurchase } from "@/configs/api";
import {
  IAvailability,
  ISearchAvailabilityResponse,
  IBulkAvailabilityResponse,
} from "@/interfaces/availability";

export class ConsultAvailabilityService {
  async consultAvailability(
    cep: string,
    numero?: string
  ): Promise<IAvailability> {
    const params: any = { cep };
    if (numero && numero.trim() !== "") {
      params.numero = numero;
    }

    const res = await apiPurchase.get(`/disponibilidade/verificar`, {
      params,
    });
    return res.data;
  }

  async searchAvailability(
    cep?: string,
    numero?: string,
    uf?: string,
    bairro?: string | string[],
    cidade?: string,
    limite?: number,
    page?: number
  ): Promise<ISearchAvailabilityResponse> {
    const params = new URLSearchParams();

    if (uf) params.append("uf", uf);
    if (cidade) params.append("cidade", cidade);
    if (limite) params.append("limite", limite.toString());
    if (page) params.append("page", page.toString());
    if (cep && cep.trim() !== "") params.append("cep", cep);
    if (numero && numero.trim() !== "") params.append("numero", numero);

    if (bairro) {
      if (Array.isArray(bairro)) {
        bairro.forEach((b) => {
          if (b && b.trim() !== "") params.append("bairro", b);
        });
      } else if (bairro.trim() !== "") {
        params.append("bairro", bairro);
      }
    }

    const res = await apiPurchase.get(`/disponibilidade?${params.toString()}`);
    return res.data;
  }
  async getAllCidades(uf: string): Promise<any> {
    const res = await apiPurchase.get(`/disponibilidade/cidades`, {
      params: { uf },
    });
    return res.data;
  }

  async getAllBairros(uf: string, cidade: string): Promise<any> {
    const res = await apiPurchase.get(`/disponibilidade/bairros`, {
      params: { uf, cidade },
    });
    return res.data;
  }
  async consultAvailabilityBulk(
    dados: Array<{ cep: string; numero?: string }>,
    limite?: number,
    page?: number
  ): Promise<IBulkAvailabilityResponse> {
    const params = new URLSearchParams();

    if (page) params.append("page", page.toString());
    if (limite) params.append("limite", limite.toString());

    const res = await apiPurchase.post(
      `/disponibilidade/consultar-massa?${params.toString()}`,
      {
        dados,
      }
    );
    return res.data;
  }
}
