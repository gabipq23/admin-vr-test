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
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const perPage = Number.isNaN(limitParam) || limitParam < 1 ? 20 : limitParam;

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ["vrOrders", "BENEFICIOS", page, perPage],
    queryFn: () =>
      vrOrdersService.getOrders({
        page,
        per_page: perPage,
        order_type: "BENEFICIOS",
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
