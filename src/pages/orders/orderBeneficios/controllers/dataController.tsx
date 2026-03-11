import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  VROrdersService,
  VROrderStatus,
} from "@/services/vrOrders";
import { toast } from "sonner";


export function useBeneficiosOrdersController() {
  const vrOrdersService = new VROrdersService();
  const queryClient = useQueryClient();

  const params = new URLSearchParams(window.location.search);
  const pageParam = Number(params.get("page") || "1");
  const limitParam = Number(params.get("limit") || "20");
  const idParam = Number(params.get("order_number"));
  const statusParam = params.get("status");
  const dateFromParam = params.get("date_from");
  const dateToParam = params.get("date_to");
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const perPage =
    Number.isNaN(limitParam) || limitParam < 1
      ? 20
      : Math.min(limitParam, 100);
  const allowedStatus: VROrderStatus[] = ["ABERTO", "FECHADO", "CANCELADO"];
  const order_number = Number.isNaN(idParam) || idParam < 1 ? undefined : idParam;
  const status = allowedStatus.includes(statusParam as VROrderStatus)
    ? (statusParam as VROrderStatus)
    : undefined;
  const date_from = dateFromParam || undefined;
  const date_to = dateToParam || undefined;

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ["vrOrders", "BENEFICIOS", page, perPage, order_number, status, date_from, date_to],
    queryFn: () =>
      vrOrdersService.getOrders({
        page,
        per_page: perPage,
        order_type: "BENEFICIOS",
        order_number,
        status,
        date_from,
        date_to,
      }),
    refetchOnWindowFocus: false,
  });

  const ordersBeneficios = ordersResponse?.orders ?? [];
  const totalItems = ordersResponse?.total ?? 0;

  const { mutate: removeOrder, isPending: isRemoveOrderFetching } = useMutation({
    mutationFn: async ({ id }: { id: number }) =>
      vrOrdersService.deleteOrder(id),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["vrOrders", "BENEFICIOS"] }),
    onSuccess: async () => {
      toast.success("Pedido removido com sucesso!");
      await queryClient.invalidateQueries({ queryKey: ["vrOrders", "BENEFICIOS"] });
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
        await queryClient.cancelQueries({ queryKey: ["vrOrders", "BENEFICIOS"] }),
      onSuccess: async () => {
        toast.success("Status do pedido alterado com sucesso!");
        await queryClient.invalidateQueries({
          queryKey: ["vrOrders", "BENEFICIOS"],
        });
      },
      onError: (error) => {
        toast.error("Houve um erro ao alterar o status do pedido.");
        console.error(error);
      },
    });

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

  return {
    ordersBeneficios,
    isLoading,
    totalItems,
    removeOrderData,
    changeOrderStatusData,
    isRemoveOrderFetching,
    isChangeOrderStatusFetching,
    showModal,
    closeModal,
    isModalOpen,
  };
}
