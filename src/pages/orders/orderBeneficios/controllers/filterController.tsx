import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useStyle } from "@/style/tableStyle";
import { useRHTableColumns } from "../components/tableColumns";

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
  const allowedStatus: any[] = ["aberto", "fechado", "cancelado"];
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
  const ordernumber = params.get("ordernumber") || undefined;
  const data_ate = params.get("data_ate") || undefined;
  const data_de = params.get("data_de") || undefined;
  const page = parseInt(params.get("page") || "1", 10);
  const limit = parseInt(params.get("limit") || "200", 10);
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
    ordernumber,
    data_ate,
    data_de,
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
      ordernumber: "",
      data_ate: "",
      data_de: "",
      order: undefined,
      sort: "",
      status: null,
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
    if (data.ordernumber) params.set("ordernumber", data.ordernumber);
    if (data.data_de) params.set("data_de", data.data_de);
    if (data.data_ate) params.set("data_ate", data.data_ate);
    if (data.status) params.set("status", data.status);
    if (data.initial_status) params.set("initial_status", data.initial_status);

    params.set("page", "1");
    params.set("limit", "200");
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
  const allTableColumns = useRHTableColumns();

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
