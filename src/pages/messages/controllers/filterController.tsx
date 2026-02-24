import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TableColumnsType, Tooltip } from "antd";
import { IContact, IFilters } from "@/interfaces/contacts";
import { formatCNPJ } from "@/utils/formatCNPJ";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { useStyle } from "@/style/tableStyle";

function getFiltersFromURL(): {
  nome: string | null;
  email: string | null;
  cnpj: string | null;
  data_ate: string | null;
  data_de?: string | null;
  status_mensagem?: string | null;
  assunto?: string | null;
  page: number;
  limit: number;
  sort?: string | null;
  order?: "asc" | "desc" | null;
} {
  const params = new URLSearchParams(window.location.search);

  const nome = params.get("nome") || null;
  const email = params.get("email") || null;
  const cnpj = params.get("cnpj") || null;
  const data_ate: string | null = params.get("data_ate");
  const data_de: string | null = params.get("data_de");
  const status_mensagem = params.get("status_mensagem") || null;
  const assunto = params.get("assunto") || null;
  const page = parseInt(params.get("page") || "1", 10);
  const limit = parseInt(params.get("limit") || "100", 10);
  const sort = params.get("sort") || null;
  const order = params.get("order") as "asc" | "desc" | null;
  return {
    data_ate,
    data_de,
    nome,
    email,
    cnpj,
    status_mensagem,
    assunto,
    page,
    limit,
    sort,
    order,
  };
}

interface IContactControllerProps {
  totalContacts: number;
}

export function useContactFilterController({
  totalContacts,
}: IContactControllerProps) {
  const navigate = useNavigate();
  const filters = getFiltersFromURL();

  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);

  const currentPage = filters.page;
  const pageSize = filters.limit;
  const totalItems = totalContacts || 0;

  const { handleSubmit, reset, control } = useForm<IFilters>({
    defaultValues: {
      nome: "",
      email: "",
      cnpj: "",
      data_de: "",
      data_ate: "",
      status_mensagem: "",
      assunto: "",
      sort: "",
      order: undefined,
    },
    values: filters,
  });
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const onSubmit = (data: IFilters) => {
    const params = new URLSearchParams();
    if (data.nome) params.set("nome", data.nome);
    if (data.email) params.set("email", data.email);
    if (data.cnpj) {
      const cnpjSemMascara = data.cnpj.replace(/\D/g, "");
      params.set("cnpj", cnpjSemMascara);
    }
    if (data.data_de) params.set("data_de", data.data_de);
    if (data.data_ate) params.set("data_ate", data.data_ate);
    if (data.status_mensagem)
      params.set("status_mensagem", data.status_mensagem);
    if (data.assunto) params.set("assunto", data.assunto);
    params.set("page", "1");
    params.set("limit", "100");
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

  const tableColumns: TableColumnsType<IContact> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
    },
    {
      title: "Nome",
      dataIndex: "nome",
      width: 130,
      ellipsis: {
        showTitle: false,
      },
      render: (nome) => (
        <Tooltip
          placement="topLeft"
          title={nome}
          styles={{ body: { fontSize: "12px" } }}
        >
          {nome}
        </Tooltip>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 140,
    },
    {
      title: "Telefone",
      dataIndex: "telefone",
      width: 100,
      render: (value) => formatPhoneNumber(value),
    },
    {
      title: "CNPJ",
      dataIndex: "cnpj",
      width: 120,
      render: (value) => formatCNPJ(value),
    },
    {
      title: "Assunto",
      dataIndex: "assunto",
      width: 160,
      ellipsis: {
        showTitle: false,
      },
      render: (assunto) => (
        <Tooltip
          placement="topLeft"
          title={assunto}
          styles={{ body: { fontSize: "12px" } }}
        >
          {assunto}
        </Tooltip>
      ),
    },
    {
      title: "Data de Envio",
      dataIndex: "data_criacao",
      width: 120,
      sorter: true,
      sortOrder:
        filters.sort === "data_criacao"
          ? filters.order === "asc"
            ? "ascend"
            : filters.order === "desc"
              ? "descend"
              : undefined
          : undefined,
      onHeaderCell: () => ({
        onClick: () => {
          const newOrder =
            filters.sort === "data_criacao" && filters.order === "asc"
              ? "desc"
              : "asc";
          const params = new URLSearchParams(window.location.search);
          params.set("sort", "data_criacao");
          params.set("order", newOrder);
          params.set("page", "1");
          navigate(`?${params.toString()}`);
        },
        style: { cursor: "pointer" },
      }),
    },
    {
      title: "Status",
      dataIndex: "status_mensagem",
      width: 110,
      render: (_value, record) => getStatus(record.status_mensagem),
    },
  ];

  const getStatus = (status: string) => {
    if (status === "Nova Mensagem") {
      return (
        <span className="flex items-center gap-2">
          Nova Mensagem{" "}
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </span>
      );
    } else {
      return <span className="flex items-center gap-2">{status}</span>;
    }
  };

  return {
    isFiltered,
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedContact,
    setSelectedContact,
    currentPage,
    pageSize,
    totalItems,
    tableColumns,
    styles: { customTable: styles.customTable },
  };
}
