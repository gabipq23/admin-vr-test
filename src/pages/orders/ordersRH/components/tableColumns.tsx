import { Thermometer } from "@/components/chat/common/thermometer";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, TableColumnsType, Tooltip } from "antd";
import { getFiltersFromURL } from "../controllers/filterController";
import { useNavigate } from "react-router-dom";
import { formatCPF } from "@/utils/formatCPF";
import { AlertCircle, CheckCircle2, MapIcon, MapPinned, Mars, Monitor, Smartphone, Tablet, Venus, XCircle } from "lucide-react";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { convertData } from "@/utils/convertData";
import { formatBrowserDisplay, formatOSDisplay } from "@/utils/formatClientEnvironment";
import { formatCNPJ } from "@/utils/formatCNPJ";
import { capitalizeWords } from "@/utils/capitaliWords";
import { VROrder } from "@/interfaces/VROrder";

export const useRHTableColumns = (): TableColumnsType<VROrder> => {
    const filters = getFiltersFromURL();
    const navigate = useNavigate();
    return [
        {
            title: "",
            dataIndex: "obs",
            width: 30,
            render: (obs) => (
                <Tooltip
                    placement="top"
                    title={obs || "Sem observações"}
                    styles={{ body: { fontSize: "12px" } }}
                >
                    {obs && <ExclamationCircleOutlined />}
                </Tooltip>
            ),
        },
        {
            title: "",
            dataIndex: ["whatsapp", "avatar"],
            width: 80,
            render: (avatar, record) => {
                if (record.temperature === 10) {
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
            dataIndex: "temperature",
            width: 140,
            render: (temperature) => (
                <div className="flex w-[120px] h-2 items-center gap-1 mr-4">
                    {" "}
                    <Thermometer min={0} max={10} value={temperature || 0} />
                </div>
            ),
        },
        {
            title: "ID do Pedido",
            dataIndex: "order_number",
            width: 110,
            render: (order_number, record) =>
                order_number ? order_number : record.id || "-",
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
            dataIndex: "after_sales_status",
            width: 155,
            sorter: true,
            sortOrder:
                filters.sort === "after_sales_status"
                    ? filters.order === "asc"
                        ? "ascend"
                        : filters.order === "desc"
                            ? "descend"
                            : undefined
                    : undefined,
            onHeaderCell: () => ({
                onClick: () => {
                    const newOrder =
                        filters.sort === "after_sales_status" && filters.order === "asc"
                            ? "desc"
                            : "asc";
                    const params = new URLSearchParams(window.location.search);
                    params.set("sort", "after_sales_status");
                    params.set("order", newOrder);
                    params.set("page", "1");
                    navigate(`?${params.toString()}`);
                },
                style: { cursor: "pointer" },
            }),
            render: (after_sales_status) => (
                <Tooltip
                    placement="topLeft"
                    title={after_sales_status}
                    styles={{ body: { fontSize: "12px" } }}
                >
                    {after_sales_status || "-"}
                </Tooltip>
            ),
        },

        {
            title: "CNPJ",
            dataIndex: "cnpj",
            width: 140,
            render: (cnpj) => (cnpj ? formatCNPJ(cnpj) : "-"),
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
                        record.cnpj !== null &&
                        record.cnpj !== undefined &&
                        record.cnpj !== ""
                    );
                }
                if (value === "vazio") {
                    return (
                        record.cnpj === null ||
                        record.cnpj === undefined ||
                        record.cnpj === ""
                    );
                }
                return true;
            },
        },
        {
            title: "Razão Social ",
            dataIndex: "company_name",
            ellipsis: {
                showTitle: false,
            },
            render: (company_name) => (
                <Tooltip
                    placement="topLeft"
                    title={capitalizeWords(company_name)}
                    styles={{ body: { fontSize: "12px" } }}
                >
                    {capitalizeWords(company_name) || "-"}
                </Tooltip>
            ),
            width: 150,
        },
        {
            title: "Status Receita",
            dataIndex: "rfb_status",
            width: 110,
            render: (rfb_status) =>
                rfb_status
                    ? rfb_status
                    : "-"
        },
        {
            title: "MEI",
            dataIndex: "is_mei",
            width: 70,
            render: (is_mei) =>
                is_mei ? "Sim" : is_mei === undefined || is_mei === null ? "-" : "Não",
        },
        {
            title: "Capital Social",
            dataIndex: "capital_social",
            width: 110,
            render: (capital_social) =>
                capital_social
                    ? capital_social
                    : "-"
        },
        {
            title: "Porte",
            dataIndex: "company_size",
            width: 110,
            render: (company_size) =>
                company_size
                    ? company_size
                    : "-"
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
            title: "Sócios",
            dataIndex: "socios_empresas",
            width: 210,
            ellipsis: {
                showTitle: false,
            },
            render: (socios_empresas) => {
                if (!socios_empresas || socios_empresas.length === 0) {
                    return "-";
                }

                const sociosFormatados = socios_empresas
                    .map(
                        (socio: { cpf: string; is_admin: string; name: string }) => {
                            const isAdmin = ["1", "sim", "true", "yes"].includes(
                                String(socio.is_admin).toLowerCase(),
                            );

                            return `${formatCPF(socio.cpf)}, ${capitalizeWords(socio.name)}, ${isAdmin ? "Sócio Admin" : "Sócio"}`;
                        },
                    )
                    .join("; \n");

                return (
                    <Tooltip
                        placement="topLeft"
                        title={
                            <div style={{ whiteSpace: "pre-line" }}>{sociosFormatados}</div>
                        }
                        styles={{ body: { fontSize: "12px" } }}
                    >
                        {sociosFormatados}
                    </Tooltip>
                );
            },
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
            dataIndex: "full_name",
            ellipsis: {
                showTitle: false,
            },
            render: (full_name, record) => {
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

                const isNamesMatch = compareNames(full_name, record?.rfb_name);

                return (
                    <>
                        {full_name ? (
                            <span className="flex items-center gap-1">
                                {full_name}
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
            title: "Data de Nascimento",
            dataIndex: "rfb_birth_date",
            width: 150,
            render: (rfb_birth_date) => {
                return rfb_birth_date ? convertData(rfb_birth_date) : "-";
            },
        },
        {
            title: "Gênero",
            dataIndex: "rfb_gender",
            width: 80,
            render: (rfb_gender) =>
                rfb_gender === "M" ? (
                    <div className="flex items-center justify-center">
                        <Mars color="blue" size={17} />
                    </div>
                ) : rfb_gender === "F" ? (
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

                const isValid = record.phone_valid;
                const isValidTrue = isValid === true || isValid === 1;
                const isValidFalse = isValid === false || isValid === 0;

                return (
                    <span className="flex items-center gap-1">
                        {formatPhoneNumber(record.phone)}
                        {isValidTrue ? (
                            <Tooltip
                                title="Válido na ANATEL"
                                placement="top"
                                styles={{ body: { fontSize: "12px" } }}
                            >
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </Tooltip>
                        ) : isValidFalse ? (
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
            dataIndex: "operator",
            width: 120,
            ellipsis: {
                showTitle: false,
            },
            render: (_, record) => (
                <Tooltip
                    placement="topLeft"
                    title={record.operator}
                    styles={{ body: { fontSize: "12px" } }}
                >
                    {record.operator || "-"}
                </Tooltip>
            ),
        },
        {
            title: "Portado",
            dataIndex: "phone_ported",
            width: 90,
            render: (phone_ported) => phone_ported || "-",
        },
        {
            title: "Data da Portabilidade",
            dataIndex: "phone_porting_date",
            width: 160,
            render: (_, record) =>
                record.phone_porting_date
                    ? convertData(record.phone_porting_date)
                    : "-",
        },

        {
            title: "Whatsapp",
            dataIndex: ["whatsapp", "is_commercial"],
            width: 90,
            render: (is_commercial, record) => {
                const whatsappData = record?.whatsapp;

                if (!whatsappData || whatsappData.success === false) {
                    return <div className="flex items-center justify-center">Não</div>;
                }

                if (whatsappData.exists_on_whatsapp === false) {
                    return <div className="flex items-center justify-center">Não</div>;
                }

                return (
                    <div className="flex items-center justify-center">
                        {(is_commercial ?? whatsappData.is_commercial) === true ? (
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
                        ) : (is_commercial ?? whatsappData.is_commercial) === false ? (
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
            dataIndex: "additional_phone",
            width: 180,
            render: (_, record) => {
                if (!record.additional_phone) return "-";

                const isValid = record.additional_phone_valid;
                const isValidTrue = isValid === true || isValid === 1;
                const isValidFalse = isValid === false || isValid === 0;

                return (
                    <span className="flex items-center gap-1">
                        {formatPhoneNumber(record.additional_phone)}
                        {isValidTrue ? (
                            <Tooltip
                                title="Válido na ANATEL"
                                placement="top"
                                styles={{ body: { fontSize: "12px" } }}
                            >
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </Tooltip>
                        ) : isValidFalse ? (
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
            title: "Interesse RH Digital",
            dataIndex: ["vr_order", "whats_rh_digital"],
            width: 150,
            render: (whats_rh_digital) =>
                typeof whats_rh_digital === "boolean"
                    ? whats_rh_digital
                        ? "Sim"
                        : "Não"
                    : "-",
        },
        {
            title: "Nº Func Presencial",
            dataIndex: ["vr_order", "number_of_employees_office"],
            width: 170,
            render: (number_of_employees_office) =>
                number_of_employees_office ?? "-",
        },
        {
            title: "Nº Func Remoto",
            dataIndex: ["vr_order", "number_of_employees_home"],
            width: 170,
            render: (number_of_employees_home) =>
                number_of_employees_home ?? "-",
        },
        {
            title: "Utiliza Solução de Ponto",
            dataIndex: ["vr_order", "already_has_point_solution"],
            width: 200,
            render: (already_has_point_solution) =>
                typeof already_has_point_solution === "boolean"
                    ? already_has_point_solution
                        ? "Sim"
                        : "Não"
                    : "-",
        },
        {
            title: "Solução de Ponto",
            dataIndex: ["vr_order", "point_solution_name"],
            ellipsis: {
                showTitle: false,
            },
            width: 160,
            render: (point_solution_name) => (
                <Tooltip
                    placement="topLeft"
                    title={point_solution_name}
                    styles={{ body: { fontSize: "12px" } }}
                >
                    {point_solution_name || "-"}
                </Tooltip>
            ),
        },

        {
            title: "CEP",
            dataIndex: ["address_info", "zip_code"],
            width: 130,
            render: (_, record) => {
                const addressInfo = record.address_info;
                const zipCode = addressInfo?.zip_code;

                if (!zipCode) return "-";

                const isValidCep =
                    (addressInfo?.address) &&
                    (addressInfo?.district) &&
                    (addressInfo?.city) &&
                    (addressInfo?.state);
                const isCepUnico =
                    addressInfo?.single_zip_code

                return (
                    <span className="flex items-center gap-1">
                        {zipCode}
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
            dataIndex: ["address_info", "address"],
            ellipsis: {
                showTitle: false,
            },
            render: (_, record) => {
                return (
                    <Tooltip
                        placement="topLeft"
                        title={record.address_info?.address}
                        styles={{ body: { fontSize: "12px" } }}
                    >
                        {record.address_info?.address || "-"}
                    </Tooltip>
                );
            },
            width: 140,
        },
        {
            title: "Número",
            dataIndex: ["address_info", "number"],
            width: 80,
            render: (_, record) => {
                return record.address_info?.number ? record.address_info?.number : "-";
            },
        },
        {
            title: "Complemento",
            dataIndex: ["address_info", "complement"],
            width: 120,
            render: (_, record) => {
                return record.address_info?.complement ? record.address_info?.complement : "-";
            },
        },

        {
            title: "Bairro",
            dataIndex: ["address_info", "district"],
            width: 120,
            ellipsis: {
                showTitle: false,
            },
            render: (_, record) => {
                return (
                    <Tooltip
                        placement="topLeft"
                        title={record.address_info?.district}
                        styles={{ body: { fontSize: "12px" } }}
                    >
                        {record.address_info?.district || "-"}
                    </Tooltip>
                );
            },
        },

        {
            title: "Cidade",
            dataIndex: ["address_info", "city"],
            width: 120,
            ellipsis: {
                showTitle: false,
            },
            render: (_, record) => {
                return (
                    <Tooltip
                        placement="topLeft"
                        title={record.address_info?.city}
                        styles={{ body: { fontSize: "12px" } }}
                    >
                        {record.address_info?.city || "-"}
                    </Tooltip>
                );
            },
        },
        {
            title: "UF",
            dataIndex: ["address_info", "state"],
            width: 60,
            render: (_, record) => {
                return record.address_info?.state || "-";
            },
        },
        {
            title: "Maps",
            dataIndex: ["geolocation", "maps_link"],
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
            dataIndex: ["geolocation", "street_view_link"],
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
            dataIndex: "ip_access_type",
            width: 120,
            render: (ip_access_type) =>
                ip_access_type === "movel"
                    ? "Móvel"
                    : ip_access_type === "fixo"
                        ? "Fixo"
                        : ip_access_type === "hosting"
                            ? "Hosting"
                            : ip_access_type === "proxy"
                                ? "Proxy"
                                : ip_access_type === "local"
                                    ? "Local"
                                    : ip_access_type === "desconhecido"
                                        ? "Desconhecido"
                                        : "-",
        },
        {
            title: "Dispositivo",
            dataIndex: ["fingerprint", "device"],
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
            dataIndex: ["fingerprint", "os"],
            width: 140,
            render: (os) => formatOSDisplay(os),
        },
        {
            title: "Browser",
            dataIndex: ["fingerprint", "browser"],
            width: 120,
            render: (browser) => formatBrowserDisplay(browser),
        },
        {
            title: "TimeZone",
            dataIndex: ["fingerprint", "timezone"],
            width: 120,
            render: (timezone) => timezone || "-",
        },
        {
            title: "Resolução",
            dataIndex: ["fingerprint", "resolution"],
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
            dataIndex: "fingerprint_id",
            width: 120,
            render: (fingerprint_id) => fingerprint_id || "-",
        },


    ]
}