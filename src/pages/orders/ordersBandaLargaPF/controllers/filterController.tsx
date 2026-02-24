import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TableColumnsType, Tooltip, Button } from "antd";
import { createStyles } from "antd-style";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { formatCPF } from "@/utils/formatCPF";
import {
  formatBrowserDisplay,
  formatOSDisplay,
} from "@/utils/formatClientEnvironment";
import { StatusType } from "@/interfaces/purchase";
import { BandaLargaFilters } from "@/interfaces/bandaLargaPF";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Smartphone,
  Monitor,
  Tablet,
  DollarSign,
  MapIcon,
  MapPinned,
  Venus,
  Mars,
} from "lucide-react";
import { convertData } from "@/utils/convertData";
import { Thermometer } from "@/components/chat/common/thermometer";

function getFiltersFromURL(): BandaLargaFilters {
  const params = new URLSearchParams(window.location.search);
  const rawStatus = params.get("status");
  const rawInitialStatus = params.get("initial_status");
  const initial_status =
    rawInitialStatus === "consulta"
      ? "consulta"
      : rawInitialStatus === "pedido"
        ? "pedido"
        : "";
  const allowedStatus: StatusType[] = ["aberto", "fechado", "cancelado"];
  const status = allowedStatus.includes(rawStatus as StatusType)
    ? (rawStatus as StatusType)
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
        colorText: "#660099",
        colorTextActive: "#550088", */
      }
    `,
  };
});

export function useAllOrdersFilterController() {
  const navigate = useNavigate();
  const filters = getFiltersFromURL();

  const [selectedBLOrder, setSelectedBLOrder] = useState<any | null>(null);

  const currentPage = filters.page;
  const pageSize = filters.limit;

  const { handleSubmit, reset, control } = useForm<BandaLargaFilters>({
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

  const onSubmit = (data: BandaLargaFilters) => {
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

  // --- Seleção de colunas ---
  const allTableColumns: TableColumnsType<any> = [
    {
      title: "",
      dataIndex: "observacao_consultor",
      width: 30,
      render: (observacao_consultor) => (
        <Tooltip
          placement="top"
          title={observacao_consultor || "Sem observações"}
          styles={{ body: { fontSize: "12px" } }}
        >
          {observacao_consultor && <ExclamationCircleOutlined />}
        </Tooltip>
      ),
    },
    {
      title: "",
      dataIndex: ["whatsapp", "avatar"],
      width: 80,
      render: (avatar, record) => {
        if (record.temperatura_pf === 10) {
          return (
            <div className="flex bg-[#d63535] rounded-full w-9 h-9 items-center justify-center relative">
              <img
                src={avatar || "/assets/anonymous_avatar.png"}
                className="rounded-full w-9 h-9"
              />
              <div className="text-sm absolute -top-1 -right-1 flex items-center justify-center">
                🔥
              </div>
            </div>
          );
        }
        return (
          <img
            src={avatar || "/assets/anonymous_avatar.png"}
            className="h-9 w-9 rounded-full"
          />
        );
      },
    },
    {
      title: "Temperatura",
      dataIndex: "temperatura_pf",
      width: 140,
      render: (temperatura_pf) => (
        <div className="flex w-[120px] h-2 items-center gap-1 mr-4">
          {" "}
          <Thermometer min={0} max={10} value={temperatura_pf || 0} />
        </div>
      ),
    },
    {
      title: "ID do Pedido",
      dataIndex: "ordernumber",
      width: 110,
      render: (ordernumber, record) =>
        ordernumber ? ordernumber : record.id || "-",
    },

    {
      title: "Abertura",
      dataIndex: "created_at",
      width: 110,
      sorter: true,
      sortOrder:
        filters.sort === "created_at"
          ? filters.order === "asc"
            ? "ascend"
            : filters.order === "desc"
              ? "descend"
              : undefined
          : undefined,
      onHeaderCell: () => ({
        onClick: () => {
          const newOrder =
            filters.sort === "created_at" && filters.order === "asc"
              ? "desc"
              : "asc";
          const params = new URLSearchParams(window.location.search);
          params.set("sort", "created_at");
          params.set("order", newOrder);
          params.set("page", "1");
          navigate(`?${params.toString()}`);
        },
        style: { cursor: "pointer" },
      }),
    },
    {
      title: "Pedido",
      dataIndex: "status",
      render: (status: string) =>
        status === "aberto"
          ? "Aberto"
          : status === "fechado"
            ? "Fechado"
            : status === "cancelado"
              ? "Cancelado"
              : "-",
      width: 80,
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
          {status_pos_venda || "-"}
        </Tooltip>
      ),
    },
    {
      title: "Disponibilidade",
      dataIndex: "availability",
      width: 120,
      render: (availability, record) =>
        availability ? (
          record.encontrado_via_range ? (
            <div className="flex items-center justify-center ">
              <Tooltip
                title="Disponível (via range numérico)"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
              </Tooltip>
            </div>
          ) : (
            <div className="flex items-center justify-center ">
              <Tooltip
                title="Disponível"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              </Tooltip>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center ">
            <Tooltip
              title="Indisponível"
              placement="top"
              styles={{ body: { fontSize: "12px" } }}
            >
              <div className="h-2 w-2 bg-red-500 rounded-full"></div>{" "}
            </Tooltip>
          </div>
        ),
    },

    {
      title: "Recadastro",
      dataIndex: ["second_call", ["number_attempts"]],
      width: 110,
      render: (number_attempts) => number_attempts || "-",
    },
    {
      title: "CPF",
      dataIndex: "cpf",
      width: 120,
      render: (cpf) => (cpf ? formatCPF(cpf) : "-"),
      filters: [
        {
          text: "Preenchido",
          value: "preenchido",
        },
        {
          text: "Vazio",
          value: "vazio",
        },
      ],

      onFilter: (value, record) => {
        if (value === "preenchido") {
          return (
            record.cpf !== null && record.cpf !== undefined && record.cpf !== ""
          );
        }
        if (value === "vazio") {
          return (
            record.cpf === null || record.cpf === undefined || record.cpf === ""
          );
        }
        return true;
      },
    },
    {
      title: "Nome",
      dataIndex: "fullname",
      ellipsis: {
        showTitle: false,
      },
      render: (fullname, record) => {
        const compareNames = (name1: string, name2: string) => {
          if (!name1 || !name2) return null;

          const normalizeText = (text: string) => {
            return text
              .toLowerCase()
              .trim()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");
          };

          return normalizeText(name1) === normalizeText(name2);
        };

        const isNamesMatch = compareNames(fullname, record.nome_receita);

        return (
          <>
            {fullname ? (
              <span className="flex items-center gap-1">
                {fullname}
                {isNamesMatch === true ? (
                  <Tooltip
                    title="Nome confere com RFB"
                    placement="top"
                    styles={{ body: { fontSize: "12px" } }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </Tooltip>
                ) : isNamesMatch === false ? (
                  <Tooltip
                    title="Nome diferente da RFB"
                    placement="top"
                    styles={{ body: { fontSize: "12px" } }}
                  >
                    <XCircle className="h-4 w-4 text-red-500" />
                  </Tooltip>
                ) : null}
              </span>
            ) : (
              "-"
            )}
          </>
        );
      },
      width: 240,
    },
    {
      title: "Nome (RFB)",
      dataIndex: "nome_receita",

      ellipsis: {
        showTitle: false,
      },
      render: (nome_receita) => (
        <Tooltip
          placement="topLeft"
          title={nome_receita || "-"}
          styles={{ body: { fontSize: "12px" } }}
        >
          {nome_receita || "-"}
        </Tooltip>
      ),
      width: 150,
    },
    {
      title: "Gênero",
      dataIndex: "genero_receita",
      width: 80,
      render: (genero_receita) =>
        genero_receita === "M" ? (
          <div className="flex items-center justify-center">
            <Mars color="blue" size={17} />
          </div>
        ) : genero_receita === "F" ? (
          <div className="flex items-center justify-center">
            <Venus color="magenta" size={18} />
          </div>
        ) : (
          <div className="flex items-center justify-center">-</div>
        ),
    },
    {
      title: "Data de Nascimento",
      dataIndex: "birthdate",
      width: 150,
      render: (birthdate, record) => {
        const compareDates = (date1: string, date2: string) => {
          if (!date1 || !date2) return null;
          return date1.trim() === date2.trim();
        };

        const isDatesMatch =
          birthdate && birthdate !== "00/00/0000"
            ? compareDates(birthdate, record.data_de_nascimento_receita)
            : null;

        return (
          <span className="flex items-center gap-1">
            {birthdate && birthdate !== "00/00/0000" ? birthdate : "-"}
            {isDatesMatch === true ? (
              <Tooltip
                title="Data de nascimento confere com RFB"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </Tooltip>
            ) : isDatesMatch === false ? (
              <Tooltip
                title="Data de nascimento diferente da RFB"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <XCircle className="h-4 w-4 text-red-500" />
              </Tooltip>
            ) : null}
          </span>
        );
      },
    },
    {
      title: "Data de Nascimento (RFB)",
      dataIndex: "data_de_nascimento_receita",
      width: 180,
      render: (data_de_nascimento_receita) => data_de_nascimento_receita || "-",
    },
    {
      title: "Nome da Mãe",
      dataIndex: "motherfullname",
      ellipsis: {
        showTitle: false,
      },
      render: (motherfullname, record) => {
        const compareNames = (name1: string, name2: string) => {
          if (!name1 || !name2) return null;

          const normalizeText = (text: string) => {
            return text
              .toLowerCase()
              .trim()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");
          };

          return normalizeText(name1) === normalizeText(name2);
        };

        const isNamesMatch = compareNames(
          motherfullname,
          record.nome_da_mae_receita,
        );

        return (
          <>
            {motherfullname ? (
              <span className="flex items-center gap-1">
                {motherfullname}
                {isNamesMatch === true ? (
                  <Tooltip
                    title="Nome da mãe confere com RFB"
                    placement="top"
                    styles={{ body: { fontSize: "12px" } }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </Tooltip>
                ) : isNamesMatch === false ? (
                  <Tooltip
                    title="Nome da mãe diferente da RFB"
                    placement="top"
                    styles={{ body: { fontSize: "12px" } }}
                  >
                    <XCircle className="h-4 w-4 text-red-500" />
                  </Tooltip>
                ) : null}
              </span>
            ) : (
              "-"
            )}
          </>
        );
      },
      width: 220,
    },
    {
      title: "Nome da Mãe (RFB)",
      dataIndex: "nome_da_mae_receita",

      ellipsis: {
        showTitle: false,
      },
      render: (nome_da_mae_receita) => (
        <Tooltip
          placement="topLeft"
          title={nome_da_mae_receita}
          styles={{ body: { fontSize: "12px" } }}
        >
          {nome_da_mae_receita || "-"}
        </Tooltip>
      ),
      width: 150,
    },

    {
      title: "MEI",
      dataIndex: "is_mei",
      width: 70,
      render: (is_mei) =>
        is_mei ? "Sim" : is_mei === undefined || is_mei === null ? "-" : "Não",
    },
    {
      title: "Sócio",
      dataIndex: "is_socio",
      width: 70,
      render: (is_socio) =>
        is_socio
          ? "Sim"
          : is_socio === undefined || is_socio === null
            ? "-"
            : "Não",
    },
    {
      title: "Empresas",
      dataIndex: "socios_empresas",
      width: 210,
      ellipsis: {
        showTitle: false,
      },
      render: (socios_empresas) => {
        if (!socios_empresas || socios_empresas.length === 0) {
          return "-";
        }

        const empresasFormatadas = socios_empresas
          .map(
            (empresa: { cnpj: string; nome: string; porte: string }) =>
              `${empresa.cnpj}, ${empresa.nome}, ${empresa.porte}`,
          )
          .join("; \n");

        return (
          <Tooltip
            placement="topLeft"
            title={
              <div style={{ whiteSpace: "pre-line" }}>{empresasFormatadas}</div>
            }
            styles={{ body: { fontSize: "12px" } }}
          >
            {empresasFormatadas}
          </Tooltip>
        );
      },
    },
    {
      title: "Telefone",
      dataIndex: "phone",
      width: 150,
      render: (_, record) => {
        if (!record.phone) return "-";

        const isValid = record.numero_valido;

        return (
          <span className="flex items-center gap-1">
            {formatPhoneNumber(record.phone)}
            {isValid === 1 ? (
              <Tooltip
                title="Válido na ANATEL"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </Tooltip>
            ) : isValid === 0 ? (
              <Tooltip
                title="Inválido na ANATEL"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <XCircle className="h-4 w-4 text-red-500" />
              </Tooltip>
            ) : null}
          </span>
        );
      },
      filters: [
        {
          text: "Preenchido",
          value: "preenchido",
        },
        {
          text: "Vazio",
          value: "vazio",
        },
      ],

      onFilter: (value, record) => {
        if (value === "preenchido") {
          return (
            record.phone !== null &&
            record.phone !== undefined &&
            record.phone !== ""
          );
        }
        if (value === "vazio") {
          return (
            record.phone === null ||
            record.phone === undefined ||
            record.phone === ""
          );
        }
        return true;
      },
    },
    {
      title: "Operadora",
      dataIndex: "operadora",
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => (
        <Tooltip
          placement="topLeft"
          title={record.operadora}
          styles={{ body: { fontSize: "12px" } }}
        >
          {record.operadora || "-"}
        </Tooltip>
      ),
    },
    {
      title: "Portado",
      dataIndex: "portabilidade",
      width: 90,
      render: (portabilidade) => portabilidade || "-",
    },
    {
      title: "Data da Portabilidade",
      dataIndex: "data_portabilidade",
      width: 160,
      render: (_, record) =>
        record.data_portabilidade
          ? convertData(record.data_portabilidade)
          : "-",
    },

    // {
    //   title: "Titular",
    //   dataIndex: "titular_pf_pj",
    //   width: 120,
    //   render: (titular_pf_pj) => (titular_pf_pj ? titular_pf_pj : "-"),
    // },
    // {
    //   title: "Titularidade",
    //   dataIndex: "titularidade",
    //   width: 120,
    //   render: (titularidade) => (titularidade ? titularidade : "-"),
    // },
    // {
    //   title: "Título WA",
    //   dataIndex: "nome_whatsapp",
    //   width: 120,
    //   render: (nome_whatsapp) => (nome_whatsapp ? nome_whatsapp : "-"),
    // },
    {
      title: "Whatsapp",
      dataIndex: ["whatsapp", "is_comercial"],
      width: 90,
      render: (is_comercial, record) => {
        const whatsappData = record?.whatsapp;

        // Cenário 1: Telefone inválido
        if (
          whatsappData?.erro === "Telefone inválido" ||
          whatsappData?.sucesso === false
        ) {
          return <div className="flex items-center justify-center">Não</div>;
        }

        // Cenário 2: existe_no_whatsapp é false
        if (whatsappData?.existe_no_whatsapp === false) {
          return <div className="flex items-center justify-center">Não</div>;
        }

        // Casos normais com WhatsApp válido
        return (
          <div className="flex items-center justify-center">
            {is_comercial === true ? (
              <Tooltip
                title="Business"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <img
                  src="/assets/whatsapp-business.png"
                  alt="Business"
                  className="h-6 w-6"
                />
              </Tooltip>
            ) : is_comercial === false ? (
              <Tooltip
                title="Messenger"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <img
                  src="/assets/whatsapp-messenger.png"
                  alt="Messenger"
                  className="h-6 w-6"
                />
              </Tooltip>
            ) : (
              "-"
            )}
          </div>
        );
      },
    },
    {
      title: "Telefone Adicional",
      dataIndex: "phoneAdditional",
      width: 180,
      render: (_, record) => {
        if (!record.phoneAdditional) return "-";

        const isValid = record.numero_adicional_valido;

        return (
          <span className="flex items-center gap-1">
            {formatPhoneNumber(record.phoneAdditional)}
            {isValid === 1 ? (
              <Tooltip
                title="Válido na ANATEL"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </Tooltip>
            ) : isValid === 0 ? (
              <Tooltip
                title="Inválido na ANATEL"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <XCircle className="h-4 w-4 text-red-500" />
              </Tooltip>
            ) : null}
          </span>
        );
      },
      filters: [
        {
          text: "Preenchido",
          value: "preenchido",
        },
        {
          text: "Vazio",
          value: "vazio",
        },
      ],

      onFilter: (value, record) => {
        if (value === "preenchido") {
          return (
            record.phone !== null &&
            record.phone !== undefined &&
            record.phone !== ""
          );
        }
        if (value === "vazio") {
          return (
            record.phone === null ||
            record.phone === undefined ||
            record.phone === ""
          );
        }
        return true;
      },
    },
    // {
    //   title: "Status",
    //   dataIndex: ["whatsapp", "recado"],
    //   ellipsis: {
    //     showTitle: false,
    //   },
    //   render: (recado) => (
    //     <Tooltip
    //       placement="topLeft"
    //       title={recado}
    //       styles={{ body: { fontSize: "12px" } }}
    //     >
    //       {recado || "-"}
    //     </Tooltip>
    //   ),
    //   width: 140,
    // },
    {
      title: "Email",
      dataIndex: "email",
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => (
        <span className="flex items-center gap-1">
          <Tooltip
            placement="topLeft"
            title={record.email || "-"}
            styles={{ body: { fontSize: "12px" } }}
          >
            <span
              style={{
                maxWidth: 180,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "inline-block",
                verticalAlign: "middle",
              }}
            >
              {record.email || "-"}
            </span>
          </Tooltip>
          {record.is_email_valid === 1 ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : record.is_email_valid === 0 ? (
            <XCircle className="h-4 w-4 text-red-500" />
          ) : null}
        </span>
      ),
      width: 240,
    },

    {
      title: "Plano",
      dataIndex: ["plan", "name"],
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => (
        <Tooltip
          placement="topLeft"
          title={record.plan?.name}
          styles={{ body: { fontSize: "12px" } }}
        >
          {record.plan?.name
            ? record.plan?.name + " - " + record.plan?.speed
            : "-"}
        </Tooltip>
      ),
      width: 180,
    },
    {
      title: "Valor do Plano",
      dataIndex: ["plan", "price"],
      width: 120,
      render: (_, record) =>
        record.plan?.price ? `R$ ${record.plan.price}` : "-",
    },
    {
      title: "Vencimento",
      dataIndex: "dueday",
      width: 120,
    },
    // {
    //   title: "TV",
    //   dataIndex: "tv",
    //   width: 70,
    //   render: (tv) => (tv ? "Sim" : tv === undefined ? "-" : "Não"),
    // },
    // {
    //   title: "Pacote TV",
    //   dataIndex: "tv_package",
    //   width: 120,
    //   render: (tv_package) => (tv_package ? tv_package : "-"),
    // },
    // {
    //   title: "APP",
    //   dataIndex: "app",
    //   width: 70,
    //   render: (app) => (app ? "Sim" : app === undefined ? "-" : "Não"),
    // },
    // {
    //   title: "Pacote APP",
    //   dataIndex: "app_package",
    //   width: 120,
    //   render: (app_package) => (app_package ? app_package : "-"),
    // },
    // {
    //   title: "Voz Fixa",
    //   dataIndex: "voz_fixa",
    //   width: 120,
    //   render: (voz_fixa) => (voz_fixa ? voz_fixa : "-"),
    // },
    // {
    //   title: "IP Fixo",
    //   dataIndex: "ip_fixo",
    //   width: 70,
    //   render: (ip_fixo) =>
    //     ip_fixo ? "Sim" : ip_fixo === undefined ? "-" : "Não",
    // },

    {
      title: "CEP",
      dataIndex: "cep",
      width: 130,
      render: (_, record) => {
        if (!record.cep) return "-";

        const isValidCep =
          record.address && record.district && record.city && record.state;
        const isCepUnico = record.cep_unico;

        return (
          <span className="flex items-center gap-1">
            {record.cep}
            {isCepUnico ? (
              <Tooltip
                title="CEP único para localidade. Dados inseridos manualmente pelo usuário. Sujeito a erro de digitação."
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </Tooltip>
            ) : isValidCep ? (
              <Tooltip
                title="CEP válido com endereço completo"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </Tooltip>
            ) : (
              <Tooltip
                title="CEP inválido ou incompleto"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <XCircle className="h-4 w-4 text-red-500" />
              </Tooltip>
            )}
          </span>
        );
      },
    },
    {
      title: "Endereço",
      dataIndex: "address",
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip
          placement="topLeft"
          title={address}
          styles={{ body: { fontSize: "12px" } }}
        >
          {address || "-"}
        </Tooltip>
      ),
      width: 140,
    },
    {
      title: "Número",
      dataIndex: "addressnumber",
      width: 80,
      render: (addressnumber) => (addressnumber ? addressnumber : "-"),
    },
    {
      title: "Complemento",
      dataIndex: "address_complement",
      width: 120,
      render: (address_complement) =>
        address_complement ? address_complement : "-",
    },

    {
      title: "Bairro",
      dataIndex: "district",
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (district) => (
        <Tooltip
          placement="topLeft"
          title={district}
          styles={{ body: { fontSize: "12px" } }}
        >
          {district || "-"}
        </Tooltip>
      ),
    },

    {
      title: "Cidade",
      dataIndex: "city",
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (city) => (
        <Tooltip
          placement="topLeft"
          title={city}
          styles={{ body: { fontSize: "12px" } }}
        >
          {city || "-"}
        </Tooltip>
      ),
    },
    {
      title: "UF",
      dataIndex: "state",
      width: 60,
    },
    {
      title: "Coordenadas",
      dataIndex: "geolocalizacao",
      width: 180,
      render: (geolocalizacao) => {
        if (
          !geolocalizacao ||
          !geolocalizacao.latitude ||
          !geolocalizacao.longitude
        ) {
          return "-";
        }
        const coordenadas = `Lat: ${geolocalizacao.latitude}\nLong: ${geolocalizacao.longitude}`;
        return (
          <Tooltip
            placement="topLeft"
            title={coordenadas}
            styles={{ body: { fontSize: "12px" } }}
          >
            <div style={{ whiteSpace: "nowrap" }}>
              <div>Lat: {geolocalizacao.latitude}</div>
              <div>Long: {geolocalizacao.longitude}</div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Maps",
      dataIndex: ["geolocalizacao", "link_maps"],
      width: 80,
      ellipsis: {
        showTitle: false,
      },
      render: (link_maps) =>
        link_maps ? (
          <div className="flex items-center justify-center">
            <Tooltip
              placement="topLeft"
              title={link_maps}
              styles={{ body: { fontSize: "12px" } }}
            >
              <Button
                style={{
                  width: 32,
                  height: 32,
                  padding: 0,
                }}
                type="default"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(link_maps, "_blank");
                }}
                tabIndex={0}
              >
                <MapIcon size={17} />
              </Button>
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span>-</span>
          </div>
        ),
    },
    {
      title: "Street View",
      dataIndex: ["geolocalizacao", "link_street_view"],
      width: 110,
      ellipsis: {
        showTitle: false,
      },
      render: (link_street_view) =>
        link_street_view ? (
          <div className="flex items-center justify-center">
            <Tooltip
              placement="topLeft"
              title={link_street_view}
              styles={{ body: { fontSize: "12px" } }}
            >
              <Button
                style={{
                  width: 32,
                  height: 32,
                  padding: 0,
                }}
                type="default"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(link_street_view, "_blank");
                }}
                tabIndex={0}
              >
                <MapPinned size={17} />
              </Button>
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span>-</span>
          </div>
        ),
    },
    {
      title: "URL",
      dataIndex: "url",
      width: 140,
      ellipsis: {
        showTitle: false,
      },
      render: (url) => (
        <Tooltip
          placement="topLeft"
          title={url}
          styles={{ body: { fontSize: "12px" } }}
        >
          {url || "-"}
        </Tooltip>
      ),
    },
    {
      title: "IP do Cliente",
      dataIndex: "client_ip",
      width: 120,
      render: (client_ip) => (client_ip ? client_ip : "-"),
    },
    {
      title: "Provedor",
      dataIndex: "ip_isp",
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (ip_isp) => (
        <Tooltip
          placement="topLeft"
          title={ip_isp}
          styles={{ body: { fontSize: "12px" } }}
        >
          {ip_isp}
        </Tooltip>
      ),
    },
    {
      title: "Tipo de acesso",
      dataIndex: "ip_tipo_acesso",
      width: 120,
      render: (ip_tipo_acesso) =>
        ip_tipo_acesso === "movel"
          ? "Móvel"
          : ip_tipo_acesso === "fixo"
            ? "Fixo"
            : ip_tipo_acesso === "hosting"
              ? "Hosting"
              : ip_tipo_acesso === "proxy"
                ? "Proxy"
                : ip_tipo_acesso === "local"
                  ? "Local"
                  : ip_tipo_acesso === "desconhecido"
                    ? "Desconhecido"
                    : "-",
    },
    {
      title: "Dispositivo",
      dataIndex: ["finger_print", "device"],
      width: 100,
      render: (device) => (
        <div className="flex items-center justify-center">
          {device === "mobile" ? (
            <Tooltip
              title="Mobile"
              placement="top"
              styles={{ body: { fontSize: "12px" } }}
            >
              <Smartphone className="h-4 w-4 text-gray-600" />
            </Tooltip>
          ) : device === "desktop" ? (
            <Tooltip
              title="Desktop"
              placement="top"
              styles={{ body: { fontSize: "12px" } }}
            >
              <Monitor className="h-4 w-4 text-gray-600" />
            </Tooltip>
          ) : device === "tablet" ? (
            <Tooltip
              title="Tablet"
              placement="top"
              styles={{ body: { fontSize: "12px" } }}
            >
              <Tablet className="h-4 w-4 text-gray-600" />
            </Tooltip>
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      title: "Plataforma",
      dataIndex: ["finger_print", "os"],
      width: 140,
      render: (os) => formatOSDisplay(os),
    },
    {
      title: "Browser",
      dataIndex: ["finger_print", "browser"],
      width: 120,
      render: (browser) => formatBrowserDisplay(browser),
    },
    {
      title: "TimeZone",
      dataIndex: ["finger_print", "timezone"],
      width: 120,
      render: (timezone) => timezone || "-",
    },
    {
      title: "Resolução",
      dataIndex: ["finger_print", "resolution"],
      width: 120,
      render: (resolution) => {
        if (resolution && resolution.width && resolution.height) {
          return `${resolution.width} x ${resolution.height}`;
        }
        return "-";
      },
    },
    {
      title: "ID Fingerprint",
      dataIndex: "fingerprintId",
      width: 120,
      render: (fingerprintId) => fingerprintId || "-",
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
    // colocar p baixo
    {
      title: "PAP",
      dataIndex: "availability_pap",
      width: 80,
      render: (availability, record) =>
        availability ? (
          record.encontrado_via_range ? (
            <div className="flex items-center justify-center ">
              <Tooltip
                title="Disponível (via range numérico)"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
              </Tooltip>
            </div>
          ) : (
            <div className="flex items-center justify-center ">
              <Tooltip
                title="Disponível"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              </Tooltip>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center ">
            <Tooltip
              title="Indisponível"
              placement="top"
              styles={{ body: { fontSize: "12px" } }}
            >
              <div className="h-2 w-2 rounded-full">-</div>{" "}
            </Tooltip>
          </div>
        ),
    },
    {
      title: "Atendimento",
      dataIndex: "atendimento",
      width: 110,
      render: (atendimento) => atendimento || "-",
    },
    {
      title: "Instalação",
      dataIndex: "instalacao",
      width: 110,
      render: (instalacao) => instalacao || "-",
    },
    {
      title: "Crédito",
      dataIndex: "credito",
      width: 80,
      render: (credito) => {
        if (credito === null || credito === undefined) {
          return "-";
        }

        return credito ? (
          <div className="flex items-center justify-center ">
            <Tooltip
              placement="top"
              styles={{ body: { fontSize: "12px" } }}
              title="Possui crédito"
            >
              <div className="bg-green-500 h-5 w-5 rounded-full text-white font-bold text-[16px] flex items-center justify-center">
                <DollarSign size={15} />
              </div>
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center justify-center ">
            <Tooltip
              placement="top"
              styles={{ body: { fontSize: "12px" } }}
              title="Não possui crédito"
            >
              <div className="bg-red-500 h-5 w-5 rounded-full text-white font-bold text-[16px] flex items-center justify-center">
                <DollarSign size={15} />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
    //
  ];

  const alwaysVisibleKeys = ["observacao_consultor", "whatsapp,avatar"];

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
