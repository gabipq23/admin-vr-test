import { Thermometer } from "@/components/chat/common/thermometer";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { TableColumnsType, Tooltip } from "antd";
import { getFiltersFromURL } from "../controllers/filterController";
import { useNavigate } from "react-router-dom";
import { formatCPF } from "@/utils/formatCPF";
import { AlertCircle, CheckCircle2, DollarSign, Mars, Monitor, Smartphone, Tablet, Venus, XCircle } from "lucide-react";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { convertData } from "@/utils/convertData";
import { formatBrowserDisplay, formatOSDisplay } from "@/utils/formatClientEnvironment";

export const useRHTableColumns = (): TableColumnsType<any> => {
    const filters = getFiltersFromURL();
    const navigate = useNavigate();
    return [
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
    ]
}