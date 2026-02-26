import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TableColumnsType, Tooltip } from "antd";
import { createStyles } from "antd-style";

function getFiltersFromURL(): {
  status: any | null;
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
} {
  const params = new URLSearchParams(window.location.search);

  const rawStatus = params.get("status");
  const allowedStatus: any[] = ["aberto", "fechado", "cancelado"];
  const status = allowedStatus.includes(rawStatus as any)
    ? (rawStatus as any)
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
  };
}

interface IAllOrdersFilterControllerProps {
  prospectsFilteredQuery: any[] | undefined;
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

      & .ant-table-row-yellow > td {
        background-color: #fffbe6 !important;
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
  prospectsFilteredQuery,
}: IAllOrdersFilterControllerProps) {
  const navigate = useNavigate();
  const filters = getFiltersFromURL();

  const [selectedProspect, setSelectedProspect] = useState<any | null>(
    null
  );

  const currentPage = filters.page;
  const pageSize = filters.limit;

  const totalItems = prospectsFilteredQuery?.length || 0;

  const { handleSubmit, reset, control } = useForm<any>({
    defaultValues: {
      status: null,
      telefone: "",
      cnpj: "",
      razao_social: "",
      id: "",
      data_ate: "",
      data_de: "",
      status_pos_venda: "",
      order: null,
      sort: "",
    },
  });
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const onSubmit = (data: any) => {
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

    // Adiciona os filtros de demanda na URL
    if (data.demanda === "nova_linha") {
      params.set("possivel_prospect_nova_linha", "1");
      params.set("possivel_prospect_seguro", "0");
      params.set("possivel_prospect_iphone_17", "0");
    } else if (data.demanda === "seguro") {
      params.set("possivel_prospect_nova_linha", "0");
      params.set("possivel_prospect_seguro", "1");
      params.set("possivel_prospect_iphone_17", "0");
    } else if (data.demanda === "ambos") {
      params.set("possivel_prospect_nova_linha", "1");
      params.set("possivel_prospect_seguro", "1");
      params.set("possivel_prospect_iphone_17", "1");
    } else if (data.demanda === "reserva_iphone_17") {
      params.set("possivel_prospect_nova_linha", "0");
      params.set("possivel_prospect_seguro", "0");
      params.set("possivel_prospect_iphone_17", "1");
    } else {
      params.set("possivel_prospect_nova_linha", "1");
      params.set("possivel_prospect_seguro", "1");
      params.set("possivel_prospect_iphone_17", "1");
    }

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
  const capitalizeWords = (text: string) => {
    return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };
  const columns: TableColumnsType<any> = [
    {
      title: "ID do Pedido",
      dataIndex: "id",
      width: 110,
    },
    {
      title: "Abertura",
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
      title: "CNPJ",
      dataIndex: "cnpj",
      width: 140,
    },
    {
      title: "Razão Social",
      dataIndex: ["empresa", "nm_cliente"],
      width: 110,
      ellipsis: {
        showTitle: false,
      },
      render: (_: any, record: any) => (
        <Tooltip
          placement="topLeft"
          title={capitalizeWords(record.empresa?.nm_cliente || "")}
          styles={{ body: { fontSize: "12px" } }}
        >
          {capitalizeWords(record.empresa?.nm_cliente || "")}
        </Tooltip>
      ),
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
      width: 100,
    },
    {
      title: "Telefone",
      dataIndex: "telefone",
      width: 120,
    },
    {
      title: "Email",
      dataIndex: "email",
      ellipsis: {
        showTitle: false,
      },
      render: (email) => (
        <Tooltip
          placement="topLeft"
          title={email}
          styles={{ body: { fontSize: "12px" } }}
        >
          {email}
        </Tooltip>
      ),
      width: 140,
    },
    {
      title: "Nome (Comprador)",
      dataIndex: "nome",
      width: 140,
    },
    {
      title: "Telefone (Comprador)",
      dataIndex: "telefone_comprador",
      width: 160,
    },
    {
      title: "Crédito",
      dataIndex: "credito_disponivel",
      width: 100,
    },
    {
      title: "Elegíveis",
      dataIndex: "credito_cliente",
      width: 90,
      render: (credito_cliente) => {
        if (
          !credito_cliente?.telefones ||
          !Array.isArray(credito_cliente.telefones)
        )
          return 0;
        return credito_cliente.telefones.filter((tel: any) => tel.elegiveis)
          .length;
      },
    },
    {
      title: "Demanda",
      dataIndex: "demanda",
      width: 130,
    },
  ];

  return {
    isFiltered,
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedProspect,
    setSelectedProspect,
    currentPage,
    pageSize,
    totalItems,
    columns,
    styles: { customTable: styles.customTable },
  };
}
