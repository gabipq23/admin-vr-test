import { formatBRL } from "@/utils/formatBRL";
import { VROrder } from "@/interfaces/VROrder";
import * as XLSX from "xlsx";

export type ColumnConfig = {
  key: string;
  label: string;
};

export type VROrderExportType = "BENEFICIOS" | "RH" | "MOBILIDADE";

export const COMMON_COLUMNS: ColumnConfig[] = [
  { key: "id", label: "ID" },
  { key: "order_number", label: "Número do Pedido" },
  { key: "order_type", label: "Tipo do Pedido" },
  { key: "status", label: "Status" },
  { key: "after_sales_status", label: "Tramitação" },
  { key: "created_at", label: "Data de Criação" },
  { key: "updated_at", label: "Última Atualização" },
  { key: "company_name", label: "Razão Social" },
  { key: "cnpj", label: "CNPJ" },
  { key: "responsible_name", label: "Responsável" },
  { key: "full_name", label: "Nome Completo" },
  { key: "cpf", label: "CPF" },
  { key: "email", label: "E-mail" },
  { key: "phone", label: "Telefone" },
  { key: "phone_valid", label: "Telefone Válido" },
  { key: "operator", label: "Operadora" },
  { key: "phone_ported", label: "Portabilidade" },
  { key: "phone_porting_date", label: "Data Portabilidade" },
  { key: "additional_phone", label: "Telefone Adicional" },
  { key: "additional_phone_valid", label: "Telefone Adicional Válido" },
  { key: "additional_operator", label: "Operadora Adicional" },
  { key: "additional_phone_ported", label: "Portabilidade Adicional" },
  {
    key: "additional_phone_porting_date",
    label: "Data Portabilidade Adicional",
  },
  { key: "is_email_valid", label: "E-mail Válido" },
  { key: "is_mei", label: "É MEI" },
  { key: "is_socio", label: "É Sócio" },
  { key: "rfb_name", label: "Nome Receita" },
  { key: "rfb_birth_date", label: "Nascimento Receita" },
  { key: "rfb_gender", label: "Gênero Receita" },
  { key: "rfb_status", label: "Status Receita" },
  { key: "address_info.zip_code", label: "CEP" },
  { key: "address_info.address", label: "Endereço" },
  { key: "address_info.number", label: "Número" },
  { key: "address_info.complement", label: "Complemento" },
  { key: "address_info.block", label: "Quadra" },
  { key: "address_info.lot", label: "Lote" },
  { key: "address_info.floor", label: "Andar" },
  { key: "address_info.building_or_house", label: "Prédio/Casa" },
  { key: "address_info.district", label: "Bairro" },
  { key: "address_info.city", label: "Cidade" },
  { key: "address_info.state", label: "Estado" },
  { key: "address_info.reference_point", label: "Ponto de Referência" },
  { key: "address_info.single_zip_code", label: "CEP Único" },
  { key: "temperature", label: "Temperatura" },
  { key: "obs", label: "Observação" },
  { key: "socios_empresas", label: "Sócios/Empresas" },
  { key: "url", label: "URL" },
  { key: "client_ip", label: "IP Cliente" },
  { key: "ip_access_type", label: "Tipo de Acesso IP" },
  { key: "ip_isp", label: "IP ISP" },
  { key: "ip_org", label: "IP Organização" },
  { key: "whatsapp.number", label: "WhatsApp" },
  { key: "whatsapp.exists_on_whatsapp", label: "Existe no WhatsApp" },
  { key: "whatsapp.is_commercial", label: "WhatsApp Comercial" },
  { key: "whatsapp.status_message", label: "Recado WhatsApp" },
  { key: "whatsapp.verified_at", label: "WhatsApp Verificado em" },
  { key: "geolocation.formatted_address", label: "Geolocalização Endereço" },
  { key: "geolocation.latitude", label: "Geolocalização Latitude" },
  { key: "geolocation.longitude", label: "Geolocalização Longitude" },
  { key: "geolocation.precision", label: "Precisão Geolocalização" },
  { key: "geolocation.success", label: "Geolocalização Sucesso" },
  { key: "fingerprint.device", label: "Dispositivo" },
  { key: "fingerprint.os.name", label: "SO" },
  { key: "fingerprint.os.version", label: "Versão SO" },
  { key: "fingerprint.browser.name", label: "Navegador" },
  { key: "fingerprint.browser.version", label: "Versão Navegador" },
  { key: "fingerprint.timezone", label: "Timezone" },
  { key: "fingerprint.resolution.width", label: "Resolução Largura" },
  { key: "fingerprint.resolution.height", label: "Resolução Altura" },
  { key: "fingerprint_id", label: "Fingerprint ID" },
];

export const COMMON_BOOLEAN_FIELDS = [
  "phone_valid",
  "additional_phone_valid",
  "is_email_valid",
  "is_mei",
  "is_socio",
  "whatsapp.exists_on_whatsapp",
  "whatsapp.is_commercial",
  "geolocation.success",
];

const BENEFICIOS_COLUMNS: ColumnConfig[] = [
  {
    key: "vr_order.already_has_another_benefit",
    label: "Já possui outro benefício",
  },
  { key: "vr_order.benefit_name", label: "Qual benefício" },
  { key: "vr_order.number_of_beneficiaries", label: "Qtd Beneficiários" },
  { key: "vr_order.whats_va", label: "Tem VA" },
  {
    key: "vr_order.average_value_per_employee_va",
    label: "Média por colaborador (VA)",
  },
  { key: "vr_order.whats_vr", label: "Tem VR" },
  {
    key: "vr_order.average_value_per_employee_vr",
    label: "Média por colaborador (VR)",
  },
  { key: "vr_order.whats_vale_auto", label: "Tem Vale Auto" },
  {
    key: "vr_order.average_value_per_employee_vale_auto",
    label: "Média por colaborador (Vale Auto)",
  },
  { key: "vr_order.company_size_range", label: "Faixa de colaboradores" },
  { key: "vr_order.contact_objective", label: "Objetivo do contato" },
  { key: "vr_order.landing_page", label: "Landing Page" },
];

const RH_COLUMNS: ColumnConfig[] = [
  { key: "vr_order.already_has_point_solution", label: "Já possui solução" },
  {
    key: "vr_order.point_solution_name",
    label: "Nome da solução atual",
  },
  {
    key: "vr_order.number_of_employees_home",
    label: "Qtd colaboradores home office",
  },
  {
    key: "vr_order.number_of_employees_office",
    label: "Qtd colaboradores presencial",
  },
  { key: "vr_order.whats_rh_digital", label: "Tem RH Digital" },
  { key: "vr_order.company_size_range", label: "Faixa de colaboradores" },
  { key: "vr_order.contact_objective", label: "Objetivo do contato" },
  { key: "vr_order.landing_page", label: "Landing Page" },
];

const MOBILIDADE_COLUMNS: ColumnConfig[] = [
  { key: "vr_order.whats_vt", label: "Tem VT" },
  {
    key: "vr_order.already_has_another_solution",
    label: "Já possui outra solução",
  },
  {
    key: "vr_order.point_solution_name",
    label: "Nome da solução atual",
  },
  { key: "vr_order.number_of_users", label: "Qtd de usuários" },
  {
    key: "vr_order.average_value_per_employee",
    label: "Média por colaborador",
  },
  { key: "vr_order.company_size_range", label: "Faixa de colaboradores" },
  { key: "vr_order.contact_objective", label: "Objetivo do contato" },
  { key: "vr_order.landing_page", label: "Landing Page" },
];

const EXPORT_CONFIG: Record<
  VROrderExportType,
  {
    columns: ColumnConfig[];
    monetaryFields: string[];
    booleanFields: string[];
    sheetName: string;
    fileName: string;
  }
> = {
  BENEFICIOS: {
    columns: [...COMMON_COLUMNS, ...BENEFICIOS_COLUMNS],
    monetaryFields: [
      "vr_order.average_value_per_employee_va",
      "vr_order.average_value_per_employee_vr",
      "vr_order.average_value_per_employee_vale_auto",
    ],
    booleanFields: [
      ...COMMON_BOOLEAN_FIELDS,
      "vr_order.already_has_another_benefit",
      "vr_order.whats_va",
      "vr_order.whats_vr",
      "vr_order.whats_vale_auto",
    ],
    sheetName: "Pedidos VR Benefícios",
    fileName: "pedidos-vr-beneficios-selecionados.xlsx",
  },
  RH: {
    columns: [...COMMON_COLUMNS, ...RH_COLUMNS],
    monetaryFields: [],
    booleanFields: [
      ...COMMON_BOOLEAN_FIELDS,
      "vr_order.already_has_point_solution",
      "vr_order.whats_rh_digital",
    ],
    sheetName: "Pedidos VR RH",
    fileName: "pedidos-vr-rh-selecionados.xlsx",
  },
  MOBILIDADE: {
    columns: [...COMMON_COLUMNS, ...MOBILIDADE_COLUMNS],
    monetaryFields: ["vr_order.average_value_per_employee"],
    booleanFields: [
      ...COMMON_BOOLEAN_FIELDS,
      "vr_order.whats_vt",
      "vr_order.already_has_another_solution",
    ],
    sheetName: "Pedidos VR Mobilidade",
    fileName: "pedidos-vr-mobilidade-selecionados.xlsx",
  },
};

const getNestedValue = (obj: Record<string, unknown>, path: string) =>
  path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc !== null && acc !== undefined
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      obj,
    );

const formatValue = (
  key: string,
  value: unknown,
  monetaryFields: Set<string>,
  booleanFields: Set<string>,
): string | number => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  if (monetaryFields.has(key)) {
    return formatBRL(value);
  }

  if (booleanFields.has(key)) {
    return value === true || value === 1 ? "Sim" : "Não";
  }

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "object" && item !== null
          ? Object.values(item as Record<string, unknown>).join(" - ")
          : String(item),
      )
      .join(" | ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return value as string | number;
};

export const exportVROrdersToXLSX = ({
  data,
  selectedRowKeys,
  columns,
  monetaryFields = [],
  booleanFields = [],
  sheetName,
  fileName,
}: {
  data: VROrder[];
  selectedRowKeys: Array<number | string>;
  columns: ColumnConfig[];
  monetaryFields?: string[];
  booleanFields?: string[];
  sheetName: string;
  fileName: string;
}) => {
  if (!data || !selectedRowKeys || selectedRowKeys.length === 0) {
    return;
  }

  const selectedIds = new Set(selectedRowKeys.map((key) => String(key)));
  const pedidosSelecionados = data.filter((item) =>
    selectedIds.has(String(item.id)),
  );

  if (pedidosSelecionados.length === 0) {
    return;
  }

  const monetarySet = new Set(monetaryFields);
  const booleanSet = new Set(booleanFields);

  const pedidosFormatados = pedidosSelecionados.map((pedido) => {
    const row: Record<string, string | number> = {};

    columns.forEach(({ key, label }) => {
      const value = getNestedValue(
        pedido as unknown as Record<string, unknown>,
        key,
      );
      row[label] = formatValue(key, value, monetarySet, booleanSet);
    });

    return row;
  });

  const pedidoSheet = XLSX.utils.json_to_sheet(pedidosFormatados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, pedidoSheet, sheetName);
  XLSX.writeFile(workbook, fileName);
};

export const handleExportVROrdersXLSX = ({
  type,
  data,
  selectedRowKeys,
}: {
  type: VROrderExportType;
  data: VROrder[];
  selectedRowKeys: Array<number | string>;
}) => {
  const config = EXPORT_CONFIG[type];

  exportVROrdersToXLSX({
    data,
    selectedRowKeys,
    columns: config.columns,
    monetaryFields: config.monetaryFields,
    booleanFields: config.booleanFields,
    sheetName: config.sheetName,
    fileName: config.fileName,
  });
};
