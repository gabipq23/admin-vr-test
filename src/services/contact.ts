import { apiPurchase } from "@/configs/api";
import { IContactResponse } from "src/interfaces/contacts";

export class ContactService {
  async allContacts({
    nome,
    email,
    cnpj,
    data_ate,
    data_de,
    sort,
    order,
    status_mensagem,
    assunto,
    page,
    limit,
  }: {
    nome?: string | number;
    email?: string;
    cnpj?: string | number;
    data_ate?: string;
    data_de?: string;
    status_mensagem?: string | null;
    sort?: string;
    order?: "asc" | "desc" | null;
    assunto?: string | null;
    page?: string | number;
    limit?: string | number;
  }): Promise<IContactResponse> {
    const res = await apiPurchase.get(`/contatos`, {
      params: {
        nome: nome,
        email: email,
        cnpj: cnpj,
        data_ate: data_ate,
        data_de: data_de,
        sort: sort || "data_criacao",
        order: order || "desc",
        status_mensagem: status_mensagem || undefined,
        assunto: assunto || undefined,
        page: page || 1,
        limit: limit || 200,
      },
    });
    return res.data;
  }

  async changeContactStatus({
    id,
    status_mensagem,
  }: {
    id: number;
    status_mensagem: "Visualizada" | "Respondida";
  }) {
    return apiPurchase.patch(`/contatos/${id}/status-mensagem`, {
      status_mensagem: status_mensagem,
    });
  }

  async removeContact(id: number) {
    await apiPurchase.delete(`/contatos/${id}`);
  }
}
