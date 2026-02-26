import { useMemo, useState } from "react";
import { IFiles } from "@/interfaces/files";
import { FilesService } from "@/services/files";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertMessage } from "@/components/chat/common/alert-message";


export function useFilesController() {
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const selectedClientId = import.meta.env.VITE_CLIENT_ID;
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const filesService = new FilesService();
  const queryClient = useQueryClient();


  const toggleSortOrder = (field: any) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const filesQuery = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["files", selectedClientId],
    queryFn: async (): Promise<IFiles[]> => {
      if (!selectedClientId) return [];

      const params = new URLSearchParams(window.location.search);
      const filters = Object.fromEntries(params.entries());

      const response = await filesService.fetchAllFiles({
        clientId: selectedClientId,
        currentPage,
        itemsPerPage,
        filters,
      });

      setTotalPages(Math.ceil(response?.total / itemsPerPage));

      return response ? response.files : [];
    },
  });

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  const changeItemsPerPage = (items: number) => {
    setItemsPerPage(items);
  };

  const { mutate: changeFileStatus } = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return filesService.changeStatus(id, status);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["files"] });
    },
    onError: () => {
      AlertMessage("Erro ao alterar o status do arquivo.", "error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      AlertMessage("Status do arquivo alterado com sucesso.", "success");
    },
  });

  const { mutate: changeFileObservation } = useMutation({
    mutationFn: async ({
      id,
      observation,
    }: {
      id: number;
      observation: string;
    }) => filesService.changeObservation(id, observation),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["files"] });
    },
    onError: () => {
      AlertMessage("Erro ao alterar a observação do arquivo.", "error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      AlertMessage("Observação do arquivo alterada com sucesso.", "success");
    },
  });

  const { mutate: removeFile } = useMutation({
    mutationFn: async (id: number) => filesService.remove(id),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["files"] }),
    onError: () => {
      AlertMessage("Erro ao remover o arquivo.", "error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      AlertMessage("Arquivo deletado com sucesso.", "success");
    },
  });

  const sortedData = useMemo(() => {
    if (!filesQuery.data) return [];

    const sorted = [...filesQuery.data].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "prospect":
          comparison = (a.prospect?.platformData?.name || "").localeCompare(
            b.prospect?.platformData?.name || ""
          );
          break;
        // case "user":
        //   comparison = (a.prospect?.platformData?.name || "").localeCompare(
        //     b.prospect?.platformData?.name || ""
        //   );
        //   break;
        default:
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [filesQuery.data, sortBy, sortOrder]);

  const files = useMemo(() => {
    if (!filesQuery.data) return [];

    return filesQuery.data.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [filesQuery.data]);

  return {
    filesQuery,
    files,
    sortedData,
    toggleSortOrder,
    sortOrder,
    sortBy,
    itemsPerPage,
    currentPage,
    totalPages,
    changePage,
    changeItemsPerPage,
    changeFileStatus,
    changeFileObservation,
    removeFile,
  };
}
