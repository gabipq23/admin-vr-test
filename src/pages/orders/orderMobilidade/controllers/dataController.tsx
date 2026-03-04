import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  VROrdersService,
  VROrderStatus,
} from "@/services/vrOrders";
import { toast } from "sonner";


export function useMobilidadeOrdersController() {
  const vrOrdersService = new VROrdersService();
  const queryClient = useQueryClient();

  const params = new URLSearchParams(window.location.search);
  const pageParam = Number(params.get("page") || "1");
  const limitParam = Number(params.get("limit") || "20");
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const perPage = Number.isNaN(limitParam) || limitParam < 1 ? 20 : limitParam;

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ["vrOrders", "MOBILIDADE", page, perPage],
    queryFn: () =>
      vrOrdersService.getOrders({
        page,
        per_page: perPage,
        order_type: "MOBILIDADE",
      }),
    refetchOnWindowFocus: false,
  });

  const ordersMobilidade = ordersResponse?.orders ?? [];
  const totalItems = ordersResponse?.total ?? 0;

  const { mutate: removeOrder, isPending: isRemoveOrderFetching } = useMutation({
    mutationFn: async ({ id }: { id: number }) =>
      vrOrdersService.deleteOrder(id),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["vrOrders", "MOBILIDADE"] }),
    onSuccess: async () => {
      toast.success("Pedido removido com sucesso!");
      await queryClient.invalidateQueries({ queryKey: ["vrOrders", "MOBILIDADE"] });
    },
    onError: (error) => {
      toast.error("Houve um erro ao remover o pedido. Tente novamente");
      console.error(error);
    },
  });

  const { mutate: changeOrderStatus, isPending: isChangeOrderStatusFetching } =
    useMutation({
      mutationFn: async ({
        id,
        data,
      }: {
        id: number;
        data: { status: VROrderStatus };
      }) => vrOrdersService.updateOrderStatus(id, data),
      onMutate: async () =>
        await queryClient.cancelQueries({ queryKey: ["vrOrders", "MOBILIDADE"] }),
      onSuccess: async () => {
        toast.success("Status do pedido alterado com sucesso!");
        await queryClient.invalidateQueries({
          queryKey: ["vrOrders", "MOBILIDADE"],
        });
      },
      onError: (error) => {
        toast.error("Houve um erro ao alterar o status do pedido.");
        console.error(error);
      },
    });

  //   const bandaLargaService = new BandaLargaService();
  //   const queryClient = useQueryClient();
  //   const params = new URLSearchParams(window.location.search);
  //   const filters = Object.fromEntries(params.entries());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const removeOrderData = (id: number) => {
    removeOrder({ id });
  };

  const changeOrderStatusData = (id: number, status: VROrderStatus) => {
    changeOrderStatus({
      id,
      data: { status },
    });
  };
  //   // Modal
  //   const [isModalOpen, setIsModalOpen] = useState(false);
  //   const showModal = () => setIsModalOpen(true);
  //   const closeModal = () => setIsModalOpen(false);

  //   const { data: ordersBandaLarga, isLoading } =
  //     useQuery<OrderBandaLargaPFResponse>({
  //       refetchOnWindowFocus: false,
  //       queryKey: [
  //         "ordersRH",
  //         filters.availability || true,
  //         filters.plan || "",
  //         filters.status_pos_venda || "",
  //         filters.fullname || "",
  //         filters.phone || "",
  //         filters.cpf || "",
  //         filters.cnpj || "",
  //         filters.razaosocial || "",
  //         filters.ordernumber || "",
  //         filters.page || 1,
  //         filters.limit || 200,
  //         filters.data_de || undefined,
  //         filters.data_ate || undefined,
  //         filters.sort || "data_criacao",
  //         filters.status || "",
  //         filters.order || "desc",
  //         filters.consulta || undefined,
  //         filters.pedido || undefined,
  //         filters.initial_status || "",
  //       ],
  //       queryFn: async (): Promise<OrderBandaLargaPFResponse> => {
  //         const response = await bandaLargaService.allBandaLargaFiltered({
  //           availability:
  //             filters.availability === "true"
  //               ? true
  //               : filters.availability === "false"
  //                 ? false
  //                 : undefined,
  //           consulta:
  //             filters.consulta === "true"
  //               ? true
  //               : filters.consulta === "false"
  //                 ? false
  //                 : undefined,
  //           pedido:
  //             filters.pedido === "true"
  //               ? true
  //               : filters.pedido === "false"
  //                 ? false
  //                 : undefined,
  //           plan: filters.plan || "",
  //           status_pos_venda: filters.status_pos_venda || "",
  //           fullname: filters.fullname || "",
  //           phone: filters.phone || "",
  //           cpf: filters.cpf || "",
  //           cnpj: filters.cnpj || "",
  //           razaosocial: filters.razaosocial || "",
  //           ordernumber: filters.ordernumber || "",
  //           page: filters.page || 1,
  //           limit: filters.limit || 200,
  //           data_de: filters.data_de || undefined,
  //           data_ate: filters.data_ate || undefined,
  //           status: filters.status || "",
  //           sort: filters.sort || "data_criacao",
  //           order:
  //             filters.order === "asc" || filters.order === "desc"
  //               ? filters.order
  //               : "desc",
  //           initial_status: filters.initial_status || "",
  //         });

  //         return response;
  //       },
  //     });
  //   const { mutate: updateBandaLargaOrder, isPending: isUpdatePurchaseFetching } =
  //     useMutation({
  //       mutationFn: async ({ id, data }: { id: number; data: any }) =>
  //         bandaLargaService.updateBandaLargaOrderInfo(id, data),
  //       onMutate: async () =>
  //         await queryClient.cancelQueries({ queryKey: ["ordersRH"] }),
  //       onSuccess: () => {
  //         toast.success("Pedido alterado com sucesso!");
  //         queryClient.invalidateQueries({ queryKey: ["ordersRH"] });
  //       },
  //       onError: (error) => {
  //         toast.error("Houve um erro ao alterar o pedido. Tente novamente");
  //         console.error(error.message);
  //       },
  //     });

  //   const {
  //     mutate: removeBandaLargaOrder,
  //     isPending: isRemoveBandaLargaOrderFetching,
  //   } = useMutation({
  //     mutationFn: async ({ id }: { id: number }) =>
  //       bandaLargaService.removeBandaLargaOrder(id),
  //     onMutate: async () =>
  //       await queryClient.cancelQueries({ queryKey: ["ordersRH"] }),
  //     onError: (error) => {
  //       toast.error("Houve um erro ao remover o pedido. Tente novamente");
  //       console.error(error.message);
  //     },
  //     onSuccess: () => {
  //       toast.success("Pedido removido com sucesso!");
  //       queryClient.invalidateQueries({ queryKey: ["ordersRH"] });
  //     },
  //   });

  //   const { mutate: changeBandaLargaOrderStatus } = useMutation({
  //     mutationFn: async ({
  //       id,
  //       data,
  //     }: {
  //       id: number;
  //       data: { status: string };
  //     }) => bandaLargaService.changeBandaLargaOrderStatus(id, data),
  //     onMutate: async () =>
  //       await queryClient.cancelQueries({ queryKey: ["ordersRH"] }),
  //     onSuccess: () => {
  //       toast.success("Status do pedido alterado com sucesso!");
  //       queryClient.invalidateQueries({ queryKey: ["ordersRH"] });
  //     },
  //     onError: (error) => {
  //       toast.error("Houve um erro ao alterar o status do pedido.");
  //       console.error(error.message);
  //     },
  //   });

  //   const updateDataIdVivoAndConsultorResponsavel = (
  //     id: string | undefined,
  //     values: any,
  //   ) => {
  //     if (!id) {
  //       toast.error("ID do pedido inválido.");
  //       return;
  //     }

  //     const dadosGerais = {
  //       pedido: {
  //         consultor_responsavel: values.consultor_responsavel,
  //         id_vivo_corp: values.id_vivo_corp,
  //         id_crm: values.id_crm,
  //         credito: values.credito,
  //       },
  //     };

  //     updateBandaLargaOrder({
  //       id: Number(id),
  //       data: dadosGerais,
  //     });
  //   };

  //   const orderBandaLargaPF = ordersBandaLarga?.pedidos.filter(
  //     (order: any) =>
  //       order.typeclient === "PF" &&
  //       order.phone !== null &&
  //       order.phone !== "" &&
  //       order.phone !== undefined,
  //   );

  return {
    ordersMobilidade,
    isLoading,
    totalItems,
    removeOrderData,
    changeOrderStatusData,
    isRemoveOrderFetching,
    isChangeOrderStatusFetching,
    // ordersBandaLarga,
    showModal,
    closeModal,
    isModalOpen,
    // orderBandaLargaPF,
    // isLoading,
    // updateBandaLargaOrder,
    // isUpdatePurchaseFetching,
    // removeBandaLargaOrder,
    // isRemoveBandaLargaOrderFetching,
    // updateDataIdVivoAndConsultorResponsavel,
    // changeBandaLargaOrderStatus,
  };
}
