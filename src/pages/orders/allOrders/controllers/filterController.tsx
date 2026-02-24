import { useState } from "react";
import {
  StatusType,
  IFilters,
  IPurchaseResponse,
} from "src/interfaces/purchase";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DataType } from "@/interfaces/orderModal";
import { TableColumnsType, Tooltip } from "antd";
import { createStyles } from "antd-style";
import { ExclamationCircleOutlined } from "@ant-design/icons";

function getFiltersFromURL(): {
  status: StatusType | null;
  telefone: string | null;
  cnpj: string | null;
  razao_social?: string | null;
  id?: string | null;
  page: number;
  limit: number;
  data_ate: string | null;
  data_de?: string | null;
  status_pos_venda?: string | null;
  order?: "asc" | "desc" | null;
  sort?: string | null;
  equipe?: string | null;
} {
  const params = new URLSearchParams(window.location.search);

  const rawStatus = params.get("status");
  const allowedStatus: StatusType[] = ["aberto", "fechado", "cancelado"];
  const status = allowedStatus.includes(rawStatus as StatusType)
    ? (rawStatus as StatusType)
    : null;
  const razao_social = params.get("razao_social") || null;
  const id = params.get("id") || null;
  const telefone = params.get("telefone");

  const cnpj = params.get("cnpj");
  const data_ate: string | null = params.get("data_ate");
  const data_de: string | null = params.get("data_de");
  const page = parseInt(params.get("page") || "1", 10);
  const limit = parseInt(params.get("limit") || "100", 10);
  const status_pos_venda = params.get("status_pos_venda") || null;
  const order = params.get("order") as "asc" | "desc" | null;
  const sort = params.get("sort") || null;
  const equipe = params.get("equipe") || null;

  return {
    data_ate,
    data_de,
    status,
    id,
    telefone,
    razao_social,
    cnpj,
    page,
    limit,
    status_pos_venda,
    order: order === "asc" || order === "desc" ? order : null,
    sort: sort || null,
    equipe,
  };
}

interface IAllOrdersFilterControllerProps {
  productsFilteredQuery: IPurchaseResponse | undefined;
  showModal: () => void;
}

const useStyle = createStyles(({ css }) => {
  return {
    customTable: css`
      .ant-table-container .ant-table-body,
      .ant-table-container .ant-table-content {
        scrollbar-width: thin;
        scrollbar-color: #eaeaea transparent;
        scrollbar-gutter: stable;
      }
      /* Diminui fonte do header */
      .ant-table-thead > tr > th {
        font-size: 12px !important;
      }
      /* Diminui fonte do body */
      .ant-table-tbody > tr > td {
        font-size: 12px !important;
      }
      /* Cor de fundo do header */
      .ant-table-thead > tr > th {
        background: #e9e9e9 !important;
      }
      .ant-table-tbody > tr {
        background: #fff !important;
      }
      /* Cor de fundo do body */
      .ant-table-tbody > td {
        background: #fff !important;
      }
      /* Cor de fundo do body */
      .ant-table-row-green > td {
        background-color: #e6ffed !important;
      }
      .ant-table-row-yellow > td {
        background-color: #fff6c7 !important;
      }
      .ant-table-row-red > td {
        background-color: #ffeaea !important;
      }
      .ant-table-row-purple > td {
        background-color: #f5e6ff !important;
      }
      /* Destaca a linha ao passar o mouse (mantém o efeito padrão do Ant Design) */
      .ant-table-tbody > tr.ant-table-row:hover > td {
        background: #e9e9e9 !important;
      }
      .ant-table-pagination {
        display: flex;
        justify-content: center;
        margin-top: 16px; /* opcional: dá um espaçamento
        colorText: "#029d23",
        colorTextActive: "#550088", */
      }
    `,
  };
});

export function useAllOrdersFilterController({
  productsFilteredQuery,
}: IAllOrdersFilterControllerProps) {
  const navigate = useNavigate();
  const filters = getFiltersFromURL();

  const [selectedOrder, setSelectedOrder] = useState<DataType | null>(null);

  const currentPage = filters.page;
  const pageSize = filters.limit;
  const totalItems = productsFilteredQuery?.total || 0;

  const { handleSubmit, reset, control } = useForm<IFilters>({
    defaultValues: filters,
  });
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const onSubmit = (data: IFilters) => {
    const params = new URLSearchParams();
    if (data.status) params.set("status", data.status);
    if (data.telefone) params.set("telefone", data.telefone);
    if (data.cnpj) {
      const cnpjSemMascara = data.cnpj.replace(/\D/g, "");
      params.set("cnpj", cnpjSemMascara);
    }
    if (data.razao_social) params.set("razao_social", data.razao_social);
    if (data.id) params.set("id", data.id);
    if (data.data_de) params.set("data_de", data.data_de);
    if (data.data_ate) params.set("data_ate", data.data_ate);
    if (data.status_pos_venda)
      params.set("status_pos_venda", data.status_pos_venda);
    params.set("page", "1");
    params.set("limit", "100");
    if (data.order) params.set("order", data.order);
    if (data.sort) params.set("sort", data.sort);
    if (data.equipe) params.set("equipe", data.equipe);

    navigate(`?${params.toString()}`);
    setIsFiltered(true);
  };
  const capitalizeWords = (text: string) => {
    return text?.toLowerCase().replace(/\b\w/g, (char) => char?.toUpperCase());
  };
  const clearFilters = () => {
    reset({
      status: null,
      telefone: "",
      cnpj: "",
      razao_social: "",
      id: "",
      equipe: "",
      data_ate: "",
      data_de: "",
      status_pos_venda: "",
      order: null,
      sort: null,
    });
    navigate("");
    setIsFiltered(false);
  };

  const { styles } = useStyle();

  const columns: TableColumnsType<DataType> = [
    {
      title: "",
      dataIndex: "observacao",
      width: 30,
      render: (observacao) => (
        <Tooltip
          placement="top"
          title={observacao || "Sem observações"}
          styles={{ body: { fontSize: "12px" } }}
        >
          {observacao ? <ExclamationCircleOutlined /> : "-"}
        </Tooltip>
      ),
    },
    {
      title: "",
      dataIndex: ["whatsapp", "avatar"],
      width: 80,
      render: (avatar) => {
        return (
          <img
            src={avatar || "/assets/anonymous_avatar.png"}
            className="h-9 w-9 rounded-full"
          />
        );
      },
    },
    {
      title: "Abertura",
      dataIndex: "data_criacao",
      width: 110,
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
      title: "Equipe",
      dataIndex: "equipe",
      width: 80,
      render: (equipe) => (equipe ? equipe : "-"),
    },
    {
      title: "Pedido",
      dataIndex: "status",
      width: 100,
    },

    {
      title: "Tramitação",
      ellipsis: {
        showTitle: false,
      },
      dataIndex: "status_pos_venda",
      width: 155,
      sorter: true,
      sortOrder:
        filters.sort === "status_pos_venda"
          ? filters.order === "asc"
            ? "ascend"
            : filters.order === "desc"
              ? "descend"
              : undefined
          : undefined,
      onHeaderCell: () => ({
        onClick: () => {
          const newOrder =
            filters.sort === "status_pos_venda" && filters.order === "asc"
              ? "desc"
              : "asc";
          const params = new URLSearchParams(window.location.search);
          params.set("sort", "status_pos_venda");
          params.set("order", newOrder);
          params.set("page", "1");
          navigate(`?${params.toString()}`);
        },
        style: { cursor: "pointer" },
      }),
      render: (status_pos_venda) => (
        <Tooltip
          placement="topLeft"
          title={status_pos_venda}
          styles={{ body: { fontSize: "12px" } }}
        >
          {status_pos_venda}
        </Tooltip>
      ),
    },
    {
      title: "Recadastro",
      dataIndex: ["second_call", "number_attempts"],
      width: 110,
      render: (number_attempts) => number_attempts || "-",
    },
    {
      title: "Total",
      dataIndex: "total",
      width: 110,
      render: (total) => (total ? total : "-"),
    },

    {
      title: "Crédito",
      dataIndex: "credito_disponivel",
      width: 120,
      render: (credito_disponivel) =>
        credito_disponivel ? credito_disponivel : "-",
    },

    {
      title: "CNPJ",
      dataIndex: "cnpj",
      width: 145,
    },
    {
      title: "Razão Social",
      dataIndex: "razao_social",
      width: 110,
      ellipsis: {
        showTitle: false,
      },
      render: (razao_social) => (
        <Tooltip
          placement="topLeft"
          title={capitalizeWords(razao_social)}
          styles={{ body: { fontSize: "12px" } }}
        >
          {capitalizeWords(razao_social)}
        </Tooltip>
      ),
    },
    {
      title: "Nome (Comprador)",
      dataIndex: "nome",
      ellipsis: {
        showTitle: false,
      },
      render: (nome) => (
        <Tooltip
          placement="topLeft"
          title={capitalizeWords(nome)}
          styles={{ body: { fontSize: "12px" } }}
        >
          {capitalizeWords(nome)}
        </Tooltip>
      ),
      width: 150,
    },
    {
      title: "Telefone (Comprador)",
      dataIndex: "telefone_comprador",

      width: 160,
      render: (telefone_comprador) =>
        telefone_comprador ? telefone_comprador : "-",
    },

    {
      title: "Gestor",
      dataIndex: "gestor_sfa",
      ellipsis: {
        showTitle: false,
      },
      render: (gestor_sfa) => (
        <Tooltip
          placement="topLeft"
          title={capitalizeWords(gestor_sfa)}
          styles={{ body: { fontSize: "12px" } }}
        >
          {capitalizeWords(gestor_sfa)}
        </Tooltip>
      ),
      width: 110,
    },
    {
      title: "Telefone",
      dataIndex: "telefone",
      width: 120,
      render: (telefone) => (telefone ? telefone : "-"),
    },
    {
      title: "E-mail",
      dataIndex: "email",
      width: 130,
      ellipsis: {
        showTitle: false,
      },
      render: (email) => (
        <Tooltip
          placement="topLeft"
          title={email}
          styles={{ body: { fontSize: "12px" } }}
        >
          {email || "-"}
        </Tooltip>
      ),
    },

    {
      title: "Quant.",
      key: "quantidade_itens",
      width: 80,
      render: (_, record) => {
        const total = Array.isArray(record?.itens)
          ? record.itens.reduce(
            (acc: number, it: any) => acc + Number(it?.quantidade ?? 0),
            0,
          )
          : 0;
        return total || "-";
      },
    },
    {
      title: "Seguro",
      dataIndex: "possivel_prospect_seguro",
      width: 140,
      render: (possivel_prospect_seguro) =>
        possivel_prospect_seguro ? "Sim" : "Não",
    },
    {
      title: "Parcelamento",
      dataIndex: "valor_parcela_total",
      width: 140,
      render: (valor_parcela_total) =>
        valor_parcela_total ? valor_parcela_total : "-",
    },

    {
      title: "ID Vivo",
      dataIndex: "id_vivo_corp",
      width: 120,
      render: (id_vivo_corp) => (id_vivo_corp ? id_vivo_corp : "-"),
    },
    {
      title: "ID CRM",
      dataIndex: "id_crm",
      width: 120,
      render: (id_crm) => (id_crm ? id_crm : "-"),
    },
    {
      title: "Consultor",
      dataIndex: "consultor_responsavel",
      width: 120,
      render: (consultor_responsavel) =>
        consultor_responsavel ? consultor_responsavel : "-",
    },

    {
      title: "ID do Pedido",
      dataIndex: "id",
      width: 120,
      render: (id) => (id ? id : "-"),
    },
    {
      title: "Fechamento",
      dataIndex: "data_fechamento",
      width: 130,
      sorter: true,
      sortOrder:
        filters.sort === "data_fechamento"
          ? filters.order === "asc"
            ? "ascend"
            : filters.order === "desc"
              ? "descend"
              : undefined
          : undefined,
      onHeaderCell: () => ({
        onClick: () => {
          const newOrder =
            filters.sort === "data_fechamento" && filters.order === "asc"
              ? "desc"
              : "asc";
          const params = new URLSearchParams(window.location.search);
          params.set("sort", "data_fechamento");
          params.set("order", newOrder);
          params.set("page", "1");
          navigate(`?${params.toString()}`);
        },
        style: { cursor: "pointer" },
      }),
    },
  ];

  return {
    isFiltered,
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedOrder,
    setSelectedOrder,
    currentPage,
    pageSize,
    totalItems,
    columns,
    styles: { customTable: styles.customTable },
  };
}
