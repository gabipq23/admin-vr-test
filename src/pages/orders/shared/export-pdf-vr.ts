import { VROrder } from "@/interfaces/VROrder";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { formatBRL } from "@/utils/formatBRL";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Content, TDocumentDefinitions } from "pdfmake/interfaces";

(pdfMake as unknown as { vfs: unknown }).vfs = (
  pdfFonts as { vfs: unknown }
).vfs;

const getBase64FromImageUrl = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Erro ao criar contexto do canvas");

      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = () => reject("Erro ao carregar imagem");
    img.src = url;
  });
};

const formatLabel = (key: string) => {
  const labels: Record<string, string> = {
    already_has_another_benefit: "Já possui outro benefício",
    benefit_name: "Qual benefício",
    number_of_beneficiaries: "Qtd beneficiários",
    whats_va: "Tem VA",
    average_value_per_employee_va: "Média por colaborador (VA)",
    whats_vr: "Tem VR",
    average_value_per_employee_vr: "Média por colaborador (VR)",
    whats_vale_auto: "Tem Vale Auto",
    average_value_per_employee_vale_auto: "Média por colaborador (Vale Auto)",
    already_has_point_solution: "Já possui solução",
    number_of_employees_home: "Qtd colaboradores home office",
    number_of_employees_office: "Qtd colaboradores presencial",
    point_solution_name: "Nome da solução",
    whats_rh_digital: "Tem RH Digital",
    whats_vt: "Tem VT",
    already_has_another_solution: "Já possui outra solução",
    number_of_users: "Qtd usuários",
    average_value_per_employee: "Média por colaborador",
    company_size_range: "Faixa de colaboradores",
    contact_objective: "Objetivo do contato",
    landing_page: "Landing Page",
  };

  return labels[key] || key;
};

const formatVRValue = (key: string, value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";

  if (typeof value === "boolean") return value ? "Sim" : "Não";

  const monetaryKeys = [
    "average_value_per_employee_va",
    "average_value_per_employee_vr",
    "average_value_per_employee_vale_auto",
    "average_value_per_employee",
  ];

  if (
    monetaryKeys.includes(key) &&
    (typeof value === "number" || !isNaN(Number(value)))
  ) {
    return formatBRL(value);
  }

  return String(value);
};

const getEmployeesCount = (order: VROrder): string => {
  const vrOrder = order.vr_order as Record<string, unknown>;

  const home = Number(vrOrder.number_of_employees_home ?? 0);
  const office = Number(vrOrder.number_of_employees_office ?? 0);
  if (home > 0 || office > 0) return String(home + office);

  const beneficiaries = Number(vrOrder.number_of_beneficiaries ?? 0);
  if (beneficiaries > 0) return String(beneficiaries);

  const users = Number(vrOrder.number_of_users ?? 0);
  if (users > 0) return String(users);

  return "-";
};

export const generateVRPDF = async (order: VROrder | null | undefined) => {
  if (!order) return;

  let logoVR = "";
  try {
    logoVR = await getBase64FromImageUrl("/assets/logo-vr.png");
  } catch {
    logoVR = "";
  }

  const vrOrder = (order.vr_order || {}) as Record<string, unknown>;

  const vrItems = Object.entries(vrOrder).map(([key, value]) => {
    return `${formatLabel(key)}: ${formatVRValue(key, value)}`;
  });

  const content: Content[] = [];

  if (logoVR) {
    content.push({
      image: logoVR,
      width: 0,
      alignment: "center",
      margin: [0, 0, 0, 12] as [number, number, number, number],
    });
  }

  content.push(
    {
      text: `Pedido VR Nº ${order.order_number || order.id}`,
      style: "title",
    },
    { text: "Contato", style: "sectionHeader" },
    {
      ul: [
        `Nome: ${order.full_name || order.responsible_name || "-"}`,
        `Telefone: ${formatPhoneNumber(order.phone || "") || "-"}`,
      ],
      style: "content",
    },
    { text: "Informações principais", style: "sectionHeader" },
    {
      ul: [
        `Landing Page: ${String(vrOrder.landing_page || "-")}`,
        `Objetivo do contato: ${String(vrOrder.contact_objective || "-")}`,
        `Número de funcionários: ${getEmployeesCount(order)}`,
      ],
      style: "content",
    },
    { text: "Dados do VR Order", style: "sectionHeader" },
    {
      ul: vrItems.length ? vrItems : ["-"],
      style: "content",
    },
  );

  const docDefinition: TDocumentDefinitions = {
    pageMargins: [20, 30, 20, 30],
    content,
    styles: {
      title: {
        fontSize: 18,
        bold: true,
        color: "#333",
        margin: [0, 0, 0, 12] as [number, number, number, number],
        alignment: "center" as const,
      },
      sectionHeader: {
        fontSize: 13,
        bold: true,
        color: "#444",
        margin: [0, 10, 0, 6] as [number, number, number, number],
      },
      content: {
        fontSize: 11,
        color: "#555",
        margin: [0, 0, 0, 6] as [number, number, number, number],
      },
    },
  };

  pdfMake
    .createPdf(docDefinition)
    .download(`pedido-vr-${order.order_number || order.id}.pdf`);
};
