import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useStyle } from "@/style/tableStyle";
import { useMobilidadeTableColumns } from "../components/tableColumns";

export function getFiltersFromURL(): any {
  const params = new URLSearchParams(window.location.search);
  const rawStatus = params.get("status");
  const rawInitialStatus = params.get("initial_status");
  const initial_status =
    rawInitialStatus === "consulta"
      ? "consulta"
      : rawInitialStatus === "pedido"
        ? "pedido"
        : "";
  const allowedStatus: any[] = ["ABERTO", "FECHADO", "CANCELADO"];
  const status = allowedStatus.includes(rawStatus as any)
    ? (rawStatus as any)
    : null;
  const availability = params.get("availability");
  let availabilityBool: boolean | undefined = undefined;
  if (availability === "true") availabilityBool = true;
  if (availability === "false") availabilityBool = false;
  const plan = params.get("plan") || undefined;
  const fullname = params.get("fullname") || undefined;
  const phone = params.get("phone") || undefined;
  const cpf = params.get("cpf") || undefined;
  const cnpj = params.get("cnpj") || undefined;
  const razaosocial = params.get("razaosocial") || undefined;
  const id = params.get("id") || params.get("ordernumber") || undefined;
  const date_from = params.get("date_from") || params.get("data_de") || undefined;
  const date_to = params.get("date_to") || params.get("data_ate") || undefined;
  const page = parseInt(params.get("page") || "1", 10);
  const limitRaw = parseInt(params.get("limit") || "100", 10);
  const limit = Number.isNaN(limitRaw) || limitRaw < 1 ? 100 : Math.min(limitRaw, 100);
  const order = params.get("order") as "asc" | "desc" | null;
  const sort = params.get("sort") || undefined;
  const status_pos_venda = params.get("status_pos_venda") || null;

  return {
    availability: availabilityBool,
    plan,
    fullname,
    phone,
    cpf,
    cnpj,
    razaosocial,
    id,
    date_from,
    date_to,
    page,
    limit,
    order: order === "asc" || order === "desc" ? order : undefined,
    status,
    sort,
    status_pos_venda,
    initial_status,
  };
}


export function useAllOrdersFilterController() {
  const navigate = useNavigate();
  const filters = getFiltersFromURL();

  const [selectedBLOrder, setSelectedBLOrder] = useState<any | null>(null);

  const currentPage = filters.page;
  const pageSize = filters.limit;

  const { handleSubmit, reset, control } = useForm<any>({
    defaultValues: {
      availability: undefined,
      plan: "",
      fullname: "",
      phone: "",
      cpf: "",
      cnpj: "",
      razaosocial: "",
      id: filters.id || "",
      date_from: filters.date_from || "",
      date_to: filters.date_to || "",
      order: undefined,
      sort: "",
      status: filters.status || null,
      status_pos_venda: "",
      initial_status: filters.initial_status || "",
    },
  });

  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  const onSubmit = (data: any) => {
    const params = new URLSearchParams();

    if (data.availability !== undefined)
      params.set("availability", String(data.availability));
    if (data.plan) params.set("plan", data.plan);
    if (data.fullname) params.set("fullname", data.fullname);
    if (data.phone) {
      const phoneSemMascara = data.phone.replace(/\D/g, "");
      params.set("phone", phoneSemMascara);
    }
    if (data.status_pos_venda)
      params.set("status_pos_venda", data.status_pos_venda);
    if (data.cpf) {
      const cpfSemMascara = data.cpf.replace(/\D/g, "");
      params.set("cpf", cpfSemMascara);
    }
    if (data.cnpj) {
      const cnpjSemMascara = data.cnpj.replace(/\D/g, "");
      params.set("cnpj", cnpjSemMascara);
    }
    if (data.razaosocial) params.set("razaosocial", data.razaosocial);
    if (data.id) params.set("id", String(data.id));
    if (data.date_from) params.set("date_from", data.date_from);
    if (data.date_to) params.set("date_to", data.date_to);
    if (data.status) params.set("status", data.status);
    if (data.initial_status) params.set("initial_status", data.initial_status);

    params.set("page", "1");
    params.set("limit", "100");
    if (data.order) params.set("order", data.order);
    if (data.sort) params.set("sort", data.sort);

    navigate(`?${params.toString()}`);
    setIsFiltered(true);
  };

  const clearFilters = () => {
    reset();
    navigate("");
    setIsFiltered(false);
  };

  const { styles } = useStyle();

  const alwaysVisibleKeys = ["obs", "whatsapp,avatar"];
  const allTableColumns = useMobilidadeTableColumns();

  const allColumnOptions = allTableColumns
    .filter(
      (col) =>
        "dataIndex" in col &&
        !alwaysVisibleKeys.includes(String(col.dataIndex)),
    )
    .map((col) => ({
      label:
        typeof col.title === "function"
          ? String(col.key || ("dataIndex" in col ? col.dataIndex : ""))
          : String(col.title),
      value: String(col.key || ("dataIndex" in col ? col.dataIndex : "")),
    }));

  const selectableKeys = allTableColumns
    .filter(
      (col) =>
        "dataIndex" in col &&
        !alwaysVisibleKeys.includes(String(col.dataIndex)),
    )
    .map((col) => String(col.key || ("dataIndex" in col ? col.dataIndex : "")));

  const [visibleColumns, setVisibleColumns] =
    useState<string[]>(selectableKeys);
  const handleColumnsChange = (checkedValues: string[]) => {
    setVisibleColumns(checkedValues);
  };

  const columns = [
    ...allTableColumns.filter(
      (col) =>
        "dataIndex" in col && alwaysVisibleKeys.includes(String(col.dataIndex)),
    ),
    ...allTableColumns.filter(
      (col) =>
        "dataIndex" in col &&
        !alwaysVisibleKeys.includes(String(col.dataIndex)) &&
        visibleColumns.includes(
          String(col.key || ("dataIndex" in col ? col.dataIndex : "")),
        ),
    ),
  ];

  return {
    isFiltered,
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedBLOrder,
    setSelectedBLOrder,
    currentPage,
    pageSize,
    columns,
    styles: { customTable: styles.customTable },
    allColumnOptions,
    visibleColumns,
    handleColumnsChange,
  };
}
