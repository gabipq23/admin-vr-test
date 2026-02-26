import { apiUberich } from "@/configs/api";
export enum Status {
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  APPROVED = "APPROVED",
}

interface IFetchAllFiles {
  clientId?: string;
  currentPage?: number;
  itemsPerPage?: number;
  filters?: {
    status?: keyof typeof Status;
    name?: string;
    externalId?: string;
    from?: string;
    to?: string;
  };
}
export class FilesService {
  async fetchAllFiles({
    clientId,
    currentPage,
    itemsPerPage,
    filters,
  }: IFetchAllFiles) {
    const response = await apiUberich.get(`files/${clientId}`, {
      params: {
        page: currentPage,
        number: itemsPerPage,
        ...filters,
      },
    });

    if (!response.data) {
      return null;
    }

    return { files: response.data.files, total: response.data.total };
  }

  async changeObservation(id: number, observation: string) {
    await apiUberich.patch(`/files/observation/${id}`, {
      observation: observation,
    });
  }

  async changeStatus(id: number, status: string) {
    await apiUberich.patch(`/files/status/${id}`, {
      status: status,
    });
  }

  async remove(id: number) {
    await apiUberich.delete(`/files/${id}`);
  }
}
