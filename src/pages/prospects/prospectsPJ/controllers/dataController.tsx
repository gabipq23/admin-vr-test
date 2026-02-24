import { useQuery } from "@tanstack/react-query";
import { IProduct } from "src/interfaces/product";

import { IProspectsResponse, IPurchase } from "src/interfaces/purchase";
import { formatCNPJ } from "@/utils/formatCNPJ";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { DataType } from "@/interfaces/orderModal";
import { useState } from "react";
import { ProspectsService } from "@/services/prospects";
import { PurchaseService } from "@/services/purchase";

export function useAllOrdersController() {
  const prospectsService = new ProspectsService();
  const purchaseService = new PurchaseService();
  const params = new URLSearchParams(window.location.search);
  const filters = Object.fromEntries(params.entries());

  const { data: productsQuery, isFetching: isProspectsFetching } =
    useQuery<IProspectsResponse>({
      refetchOnWindowFocus: false,
      queryKey: [
        "prospects",
        Number(filters.page) || 1,
        Number(filters.limit) || 100,
        filters.telefone || "",
        filters.cnpj || "",
        filters.razao_social || "",
        filters.id || "",
        filters.possivel_prospect_seguro || undefined,
        filters.possivel_prospect_nova_linha || undefined,
        filters.possivel_prospect_iphone_17 || undefined,
      ],
      queryFn: async (): Promise<IProspectsResponse> => {
        const params: any = {
          page: Number(filters.page) || 1,
          limit: Number(filters.limit) || 100,
          id: filters.id || "",
          telefone: filters.telefone || "",
          razao_social: filters.razao_social || "",
          cnpj: filters.cnpj || "",
        };

        if (
          filters.possivel_prospect_seguro !== undefined &&
          filters.possivel_prospect_seguro !== ""
        ) {
          params.possivel_prospect_seguro = Number(
            filters.possivel_prospect_seguro
          );
        }
        if (
          filters.possivel_prospect_nova_linha !== undefined &&
          filters.possivel_prospect_nova_linha !== ""
        ) {
          params.possivel_prospect_nova_linha = Number(
            filters.possivel_prospect_nova_linha
          );
        }
        if (
          filters.possivel_prospect_iphone_17 !== undefined &&
          filters.possivel_prospect_iphone_17 !== ""
        ) {
          params.possivel_prospect_iphone_17 = Number(
            filters.possivel_prospect_iphone_17
          );
        }

        const response = await prospectsService.allProspectsList(params);
        return response;
      },
    });

  const devicesQuery = useQuery<IProduct[]>({
    refetchOnWindowFocus: false,
    queryKey: ["devices"],
    queryFn: async (): Promise<IProduct[]> => {
      const response = await purchaseService.allProducts();
      return response;
    },
  });

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const prospectsFilteredQuery = productsQuery?.prospects;

  const mapBase = (item: IPurchase) => ({
    cliente_gold: item.cliente_gold ?? 1,
    telefone_foi_editado: item.telefone_foi_editado ?? false,
    email_foi_editado: item.email_foi_editado ?? false,
    observacao_foi_editado: item.observacao_foi_editado ?? false,
    complemento_foi_editado: item.complemento_foi_editado ?? false,
    quantidade_aparelhos: item.quantidade_aparelhos ?? 0,
    credito_disponivel:
      item.credito_cliente?.credito != null
        ? `R$ ${Number(item.credito_cliente?.credito).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`
        : "R$ 0,00",
    nome: item.nome ?? "",
    email_alterado: item.email_alterado ?? "",
    telefone_alterado: formatPhoneNumber(item.telefone_alterado) ?? "",
    email: item.email ?? "",
    telefone_comprador: formatPhoneNumber(item.telefone_comprador) ?? "",
    credito_cliente: {
      cnpj: item.credito_cliente?.cnpj ?? "",
      aparelho_atual: item.credito_cliente?.aparelho_atual ?? "",
      credito: item.credito_cliente?.credito ?? 0,
      credito_equipamentos: item.credito_cliente?.credito_equipamentos ?? "",
      data_atualizacao: item.credito_cliente?.data_atualizacao ?? "",
      email: item.credito_cliente?.email ?? "",
      endereco: item.credito_cliente?.endereco ?? "",
      razao_social: item.credito_cliente?.razao_social ?? "",
      sfa: item.credito_cliente?.sfa ?? "",
      telefones: Array.isArray(item.credito_cliente?.telefones)
        ? item.credito_cliente.telefones.map((tel: any) => ({
            telefone: tel.telefone ?? "",
            M: tel.M ?? 0,
            elegiveis: tel.elegiveis ?? false,
          }))
        : [],
    },
    M: item.M ?? "",
    id: item.id ?? "",
    cnpj: formatCNPJ(item.cnpj) ?? "",
    gestor_sfa: item.gestor_sfa ?? "",
    telefone: formatPhoneNumber(item.telefone) ?? "",
    bairro: item.bairro ?? "",
    cidade: item.cidade ?? "",
    empresa: {
      situacao_cadastral: item.empresa?.situacao_cadastral ?? "",
      porte: item.empresa?.porte ?? "",
      opcao_pelo_mei: item.empresa?.opcao_pelo_mei ?? false,
      nr_cep: item.empresa?.nr_cep ?? "",
      nr_cnpj: item.empresa?.nr_cnpj ?? "",
      nm_cliente: item.empresa?.nm_cliente ?? "",
      uf: item.empresa?.uf ?? "",
      cidade: item.empresa?.cidade ?? "",
      numero_fachada: item.empresa?.numero_fachada ?? "",
      complemento: item.empresa?.complemento ?? "",
      bairro: item.empresa?.bairro ?? "",
    },
    razao_social: item.razao_social ?? "",
    data_criacao: item.data_criacao
      ? new Date(
          new Date(item.data_criacao).getTime() + 3 * 60 * 60 * 1000
        ).toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "-",
    data_fechamento: item.data_fechamento
      ? new Date(item.data_fechamento).toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "-",

    valor_parcela_total:
      item.valor_parcela_total != null
        ? `${item.parcelamento}x de R$ ${Number(
            item.valor_parcela_total
          ).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`
        : "",
    total:
      item?.total != null
        ? `R$ ${Number(item.total).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`
        : "",
    status:
      item.status === "aberto"
        ? "Aberto"
        : item.status === "fechado"
        ? "Fechado"
        : item.status === "cancelado"
        ? "Cancelado"
        : item.status ?? "",

    itens: Array.isArray(item.itens)
      ? item.itens.map((it: any) => ({
          id: it.id,
          pedido_id: it.pedido_id,
          aparelho_id: it.aparelho_id,
          quantidade: it.quantidade,
          valor_unitario: it.valor_unitario,
          valor_parcela: it.valor_parcela,
          valor_parcelado: it.valor_parcelado,
          marca: it.marca,
          modelo: it.modelo,
          cores: it.cores,
          cor_escolhida: it.cor_escolhida,
          parcelamento: it.parcelamento,
          tipo: it.tipo,
          subtotal: it.subtotal,
          cod_sap: it.cod_sap,
          seguro_tipo: it.seguro_tipo,
          seguro_valor: it.seguro_valor,
        }))
      : [],
  });

  const dataSource: DataType[] =
    prospectsFilteredQuery?.flatMap((item: IPurchase) => {
      const rows: DataType[] = [];
      const novaLinha = item.possivel_prospect_nova_linha === 1;
      const seguro = item.possivel_prospect_seguro === 1;
      const reserva_iphone_17 = item.possivel_prospect_iphone_17 === 1;

      if (novaLinha && seguro && reserva_iphone_17) {
        rows.push({ ...mapBase(item), demanda: "Nova Linha" });
        rows.push({ ...mapBase(item), demanda: "Seguro" });
        rows.push({ ...mapBase(item), demanda: "Reserva iPhone 17" });
      } else if (novaLinha) {
        rows.push({ ...mapBase(item), demanda: "Nova Linha" });
      } else if (seguro) {
        rows.push({ ...mapBase(item), demanda: "Seguro" });
      } else if (reserva_iphone_17) {
        rows.push({ ...mapBase(item), demanda: "Reserva iPhone 17" });
      } else {
        rows.push({ ...mapBase(item), demanda: "" });
      }
      return rows;
    }) ?? [];
  return {
    showModal,
    closeModal,
    isModalOpen,
    productsQuery,
    devices: devicesQuery.data,
    prospectsFilteredQuery,
    isProspectsFetching,
    dataSource,
  };
}
