import { PurchaseService } from "@/services/purchase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IProduct } from "src/interfaces/product";
import { useState } from "react";
import { toast } from "sonner";
import {
  IPurchase,
  IAddItemInChartFunction,
  IAddItemInChartData,
  IPurchaseResponse,
  IPayloadUpdateData,
  IPayloadUpdateDataItems,
  IPayloadUpdateDataFormValues,
  IChangeStatusData,
} from "src/interfaces/purchase";
import { formatCNPJ } from "@/utils/formatCNPJ";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { DataType } from "@/interfaces/orderModal";

export function useAllOrdersController() {
  const purchaseService = new PurchaseService();

  const params = new URLSearchParams(window.location.search);
  const filters = Object.fromEntries(params.entries());

  const queryClient = useQueryClient();

  const productsQuery = useQuery<IPurchase[]>({
    refetchOnWindowFocus: false,
    queryKey: ["purchases"],
    queryFn: async (): Promise<IPurchase[]> => {
      const response = await purchaseService.allPurchases();
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

  const {
    data: productsFilteredQuery,
    isFetching: isproductsFilteredFetching,
  } = useQuery<IPurchaseResponse>({
    refetchOnWindowFocus: false,
    queryKey: [
      "purchases",
      filters.equipe || "",
      filters.status || "",
      filters.status_pos_venda || "",
      filters.telefone || "",
      filters.cnpj || "",
      filters.razao_social || "",
      filters.id || "",
      filters.page || 1,
      filters.limit || 100,
      filters.data_de || undefined,
      filters.data_ate || undefined,
      filters.sort || "data_criacao",
      filters.order || "desc",
    ],
    queryFn: async (): Promise<IPurchaseResponse> => {
      const response = await purchaseService.allPurchasesFilterd({
        equipe: filters.equipe || "",
        status: filters.status || "",
        status_pos_venda: filters.status_pos_venda || "",
        id: filters.id || "",
        telefone: filters.telefone || "",
        razao_social: filters.razao_social || "",
        cnpj: filters.cnpj || "",
        page: filters.page || 1,
        limit: filters.limit || 100,
        data_de: filters.data_de || undefined,
        data_ate: filters.data_ate || undefined,
        sort: filters.sort || "data_criacao",
        order:
          filters.order === "asc" || filters.order === "desc"
            ? filters.order
            : "desc",
      });
      return response;
    },
  });

  // Adição de um novo produto no carrinho
  const { mutate: addItemInChart, isPending: isAddItemInChartFetching } =
    useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: string | undefined;
        data: IAddItemInChartData;
      }) => purchaseService.addProductInChart(id, data),
      onMutate: async () =>
        await queryClient.cancelQueries({ queryKey: ["purchases"] }),
      onSuccess: () => {
        toast.success("Carrinho alterado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["purchases"] });
      },
      onError: (error: any) => {
        if (error?.response?.data?.erro) {
          toast.error(error.response.data.erro);
        } else {
          toast.error("Houve um erro ao alterar o carrinho. Tente novamente");
        }

        console.error(error.message);
      },
    });

  const handleAddItemInChart = (idProduto: IAddItemInChartFunction) => {
    addItemInChart({ id: idProduto.idProduto, data: idProduto.produto });
  };

  // Remoção de um item do carrinho
  const { mutate: removeItem, isPending: isRemoveItemFetching } = useMutation({
    mutationFn: async ({ id, item_id }: { id: number; item_id: number }) =>
      purchaseService.removeItemFromOrder(id, item_id),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["purchases"] }),
    onError: (error) => {
      toast.error("Houve um erro ao remover o item. Tente novamente");
      console.error(error.message);
    },
    onSuccess: () => {
      toast.success("Item removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });

  const { mutate: removeInsurance, isPending: isRemoveInsuranceLoading } =
    useMutation({
      mutationFn: async ({ id, itemId }: { id: number; itemId: number }) =>
        purchaseService.removeInsuranceFromProduct(id, itemId),
      onMutate: async () =>
        await queryClient.cancelQueries({ queryKey: ["purchases"] }),
      onError: (error) => {
        toast.error("Houve um erro ao remover o seguro. Tente novamente");
        console.error(error.message);
      },
      onSuccess: () => {
        toast.success("Seguro removido com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["purchases"] });
      },
    });

  // Remoção de pedido completo
  const { mutate: removeOrder, isPending: isRemoveOrderFetching } = useMutation(
    {
      mutationFn: async ({ id }: { id: number }) =>
        purchaseService.removeOrder(id),
      onMutate: async () =>
        await queryClient.cancelQueries({ queryKey: ["purchases"] }),
      onError: (error) => {
        toast.error("Houve um erro ao remover o pedido. Tente novamente");
        console.error(error.message);
      },
      onSuccess: () => {
        toast.success("Pedido removido com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["purchases"] });
      },
    },
  );

  // Atualização de um item do carrinho
  const { mutate: updatePurchase, isPending: isUpdatePurchaseFetching } =
    useMutation({
      mutationFn: async ({ data }: { data: IPayloadUpdateData }) =>
        purchaseService.updatePurchase(data),
      onMutate: async () =>
        await queryClient.cancelQueries({ queryKey: ["purchases"] }),
      onSuccess: () => {
        toast.success("Carrinho alterado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["purchases"] });
      },
      onError: (error) => {
        toast.error("Houve um erro ao alterar o carrinho. Tente novamente");
        console.error(error.message);
      },
    });

  const updateData = (
    pedido_id: string | undefined,
    formValues: IPayloadUpdateDataFormValues,
  ) => {
    const dadosGerais = {
      observacao: formValues.observacao,
      pedido_id: pedido_id ?? "0",
      forma_pagamento: formValues.forma_pagamento,
      parcelamento: formValues.parcelamento,
      complemento: formValues.complemento,
      observacao_endereco: formValues.observacao_endereco,
      email_alterado: formValues.email_alterado,
      telefone_alterado: formValues.telefone_alterado,
      nome: formValues.nome,
      telefone_comprador: formValues.telefone_comprador,
      consultor_responsavel: formValues.consultor_responsavel,
      id_vivo_corp: formValues.id_vivo_corp,
      id_crm: formValues.id_crm,
      endereco_sfa: formValues.endereco_sfa,
      bairro: formValues.bairro,
      numero_fachada: formValues.numero_fachada,
      cidade: formValues.cidade,
      uf: formValues.uf,
      cep: formValues.cep,
    };

    let payloadDataBuild: Partial<IPayloadUpdateData> = [dadosGerais];

    if (Array.isArray(formValues.itens)) {
      const itens = formValues?.itens?.map((item: IPayloadUpdateDataItems) => ({
        pedido_id: pedido_id ?? "0",
        item_id: item.id,
        quantidade: item.quantidade,
        cor: item.cor,
      }));
      payloadDataBuild = [dadosGerais, ...itens];
    }

    updatePurchase({
      data: payloadDataBuild as IPayloadUpdateData,
    });
  };

  const updateDataIdVivoAndConsultorResponsavel = (
    pedido_id: string | undefined,
    values: any,
  ) => {
    const dadosGerais = {
      pedido_id,
      consultor_responsavel: values.consultor_responsavel,
      id_vivo_corp: values.id_vivo_corp,
      id_crm: values.id_crm,
    };

    updatePurchase({
      data: [dadosGerais] as IPayloadUpdateData,
    });
  };

  // Alterar Status do Pedido
  const { mutate: changeStatus } = useMutation({
    mutationFn: async ({ id, data }: IChangeStatusData) =>
      purchaseService.changePurchaseStatus(id, data),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["purchases"] }),
    onSuccess: (response: any) => {
      if (response?.erro) {
        toast.error(response.erro);
      } else {
        toast.success("Status do pedido alterado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["purchases"] });
      }
    },
    onError: (error: any) => {
      if (error?.response?.data?.erro) {
        toast.error(error.response.data.erro);
      } else {
        toast.error(
          "Houve um erro ao alterar o status do pedido. Tente novamente",
        );
      }
      console.error(error.message);
    },
  });

  const { mutate: changePurchaseChartStatus } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { status: string };
    }) => purchaseService.changeCartStatus(id, data),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["purchases"] }),
    onSuccess: () => {
      toast.success("Status do carrinho alterado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
    onError: (error) => {
      toast.error("Houve um erro ao alterar o status do carrinho.");
      console.error(error.message);
    },
  });

  const saveSelectedSeguro = (
    pedido_id: string,
    item_id: number,
    seguro_tipo: string,
  ) => {
    if (!productsFilteredQuery) return;
    updatePurchase({
      data: [
        {
          pedido_id,
          item_id: item_id,
          seguro_tipo,
        },
      ] as IPayloadUpdateData,
    });
  };

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // status_pos_venda_enum pode ser um array de enums retornados pela API
  const statusPosVendaEnum = productsFilteredQuery?.status_pos_venda_enum ?? [];

  const dataSource: DataType[] =
    productsFilteredQuery?.pedidos
      ?.filter((item: IPurchase) => item.status !== "prospect")
      .map((item: IPurchase) => ({
        consultor_responsavel: item.consultor_responsavel ?? "",
        equipe: item.equipe ?? "",
        observacao: item.observacao ?? "",
        cliente_gold: item.cliente_gold ?? 1,
        demanda: item.demanda ?? "",
        email_foi_editado: item.email_foi_editado ?? 0,
        telefone_foi_editado: item.telefone_foi_editado ?? 0,
        observacao_foi_editado: item.observacao_foi_editado ?? 0,
        complemento_foi_editado: item.complemento_foi_editado ?? 0,
        quantidade_aparelhos: item.quantidade_aparelhos ?? 0,
        id_vivo_corp: item.id_vivo_corp ?? "",
        id_crm: item.id_crm ?? 0,
        credito_disponivel:
          item.credito_cliente?.credito != null
            ? `R$ ${Number(item.credito_cliente?.credito).toLocaleString(
                "pt-BR",
                {
                  minimumFractionDigits: 2,
                },
              )}`
            : "R$ 0,00",
        nome: item.nome ?? "",

        email_alterado: item.email_alterado ?? "",
        possivel_prospect_nova_linha: item.possivel_prospect_nova_linha ?? 0,
        possivel_prospect_seguro: item.possivel_prospect_seguro ?? 0,
        possivel_prospect_iphone_17: item.possivel_prospect_iphone_17 ?? 0,
        telefone_alterado: item.telefone_alterado ?? "",
        email: item.email ?? "",
        telefone_comprador: formatPhoneNumber(item.telefone_comprador) ?? "",
        credito_cliente: {
          cnpj: item.empresa?.nr_cnpj ?? "",
          aparelho_atual: item.credito_cliente?.aparelho_atual ?? "",
          credito: item.credito_cliente?.credito ?? 0,
          credito_equipamentos:
            item.credito_cliente?.credito_equipamentos ?? "",
          data_atualizacao: item.credito_cliente?.data_atualizacao ?? "",
          email: item.credito_cliente?.email ?? "",
          endereco: item.endereco_sfa ?? "",
          razao_social: item.empresa?.nm_cliente ?? "",

          telefones: Array.isArray(item.credito_cliente?.telefones)
            ? item.credito_cliente?.telefones.map((tel: any) => ({
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
        razao_social: item.empresa?.nm_cliente ?? "",
        data_criacao: item.data_criacao
          ? new Date(item.data_criacao).toLocaleString("pt-BR", {
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
                item.valor_parcela_total,
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
                : (item.status ?? ""),

        status_pos_venda:
          item.status_pos_venda &&
          statusPosVendaEnum.includes(item.status_pos_venda)
            ? item.status_pos_venda
            : "-",

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
              seguro_tipo: it.seguro_tipo ?? "",
              seguro_valor: it.seguro_valor ?? 0,
            }))
          : [],
      })) ?? [];

  return {
    productsQuery,
    devices: devicesQuery.data,
    isModalOpen,
    showModal,
    closeModal,
    productsFilteredQuery,
    handleAddItemInChart,
    removeItem,
    changeStatus,
    updateData,
    removeInsurance,
    changePurchaseChartStatus,
    isRemoveInsuranceLoading,
    updateDataIdVivoAndConsultorResponsavel,
    isDataLoading:
      isproductsFilteredFetching ||
      isAddItemInChartFetching ||
      isRemoveItemFetching ||
      isUpdatePurchaseFetching,
    isAllProductsFilteredLoading: isproductsFilteredFetching,
    dataSource,
    saveSelectedSeguro,
    removeOrder,
    isRemoveOrderFetching,
  };
}
