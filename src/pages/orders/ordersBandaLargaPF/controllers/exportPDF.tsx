import { OrderBandaLargaPF } from "@/interfaces/bandaLargaPF";
import { formatBRL } from "@/utils/formatBRL";
import { formatCEP } from "@/utils/formatCEP";
import { formatCPF } from "@/utils/formatCPF";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

(pdfMake as any).vfs = pdfFonts.vfs;

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

export const generatePDF = async (order: OrderBandaLargaPF | undefined) => {
  if (!order) return;

  const logoVivo = await getBase64FromImageUrl("/assets/logovivopdf.png");
  const logoGold = await getBase64FromImageUrl("/assets/goldpdf.png");

  const docDefinition = {
    pageMargins: [20, 40, 20, 40],
    content: [
      // Cabeçalho com logos
      {
        columns: [
          {
            image: logoVivo,
            width: 100,
            alignment: "left",
            margin: [0, 10, 0, 0],
          },
          { text: "", width: "*" },
          {
            image: logoGold,
            width: 100,
            alignment: "right",
            margin: [0, 25, 0, 0],
          },
        ],
        margin: [0, 5, 0, 10] as [number, number, number, number],
      },

      // Título do pedido
      {
        columns: [
          {
            text: `Pedido Banda Larga PF Nº${order.ordernumber || order.id}`,
            style: "title",
          },
        ],
      },

      // Plano Contratado
      { text: "Plano Contratado", style: "sectionHeader" },
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", 80],
          body: [
            [
              { text: "Plano", style: "tableHeader" },
              { text: "Velocidade", style: "tableHeader" },
              { text: "Valor Mensal", style: "tableHeader" },
            ],
            [
              { text: order.plan?.name || "-", style: "tableBody" },
              { text: order.plan?.speed || "-", style: "tableBody" },
              {
                text: formatBRL(order.plan?.price) || 0,
                style: "tableBody",
              },
            ],
          ],
        },
        layout: "lightHorizontalLines",
        style: "productTable",
      },

      {
        type: "circle",
        ul: [
          `Possui Disponibilidade?  ${
            order.availability
              ? "Sim"
              : order.availability === null
              ? "-"
              : "Não"
          }`,
        ],
        style: "content",
      },
      // Informações Pessoais
      { text: "Informações Pessoais", style: "sectionHeader" },
      {
        type: "circle",
        ul: [
          `Nome Completo: ${order.fullname || "-"}`,
          `CPF: ${formatCPF(order.cpf) || "-"}`,
          `Email: ${order.email || "-"}`,
          `Telefone: ${formatPhoneNumber(order.phone) || "-"}`,
          `Telefone Adicional: ${
            formatPhoneNumber(order.phoneAdditional || "") || "-"
          }`,

          `Data de Nascimento: ${order.birthdate}`,
          `Nome da Mãe: ${order.motherfullname || "-"}`,
        ],
        style: "content",
      },

      // Endereço
      { text: "Informações de Endereço", style: "sectionHeader" },
      {
        type: "circle",
        ul: [
          `CEP: ${formatCEP(order.cep) || "-"}`,
          `Endereço: ${order.address || "-"}`,
          `Número: ${order.addressnumber || "-"}`,
          `Complemento: ${order.addresscomplement || "-"}`,
          `Lote: ${order.addresslot || "-"}`,
          `Quadra: ${order.addressblock || "-"}`,
          `Andar: ${order.addressFloor || "-"}`,
          `Tipo: ${order.buildingorhouse === 1 ? "Prédio" : "Casa"}`,
          `Bairro: ${order.district || "-"}`,
          `Ponto de Referência: ${order.addressreferencepoint || "-"}`,
          `Cidade: ${order.city || "-"}`,
          `Estado: ${order.state || "-"}`,
        ],
        style: "content",
      },

      // Preferências de Instalação
      { text: "Preferências de Instalação", style: "sectionHeader" },
      {
        type: "circle",
        ul: [
          `Data Preferida 1: ${order.installation_preferred_date_one}`,
          `Período Preferido 1: ${
            order.installation_preferred_period_one || "-"
          }`,
          `Data Preferida 2: ${order.installation_preferred_date_two}`,
          `Período Preferido 2: ${
            order.installation_preferred_period_two || "-"
          }`,
          `Dia de Vencimento: ${order.dueday || "-"}`,
        ],
        style: "content",
      },

      // Resumo Financeiro
      { text: "Resumo Financeiro", style: "sectionHeader" },
      {
        columns: [
          { text: "Valor Mensal do Plano", style: "content" },
          {
            text: formatBRL(order.plan?.price) || 0,
            style: "content",
            alignment: "right",
          },
        ],
      },

      // Rodapé
      {
        text: "50.040.822/0001-74 - Gsc Solucoes Corporativas",
        style: "footer",
        margin: [0, 30, 0, 0] as [number, number, number, number],
      },
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "#222",
        fillColor: "#f3f3f3",
        margin: [0, 4, 0, 4],
      },
      tableBody: {
        fontSize: 9,
        color: "#444",
        margin: [0, 2, 0, 2],
      },
      productTable: {
        margin: [0, 5, 0, 15],
      },
      title: {
        fontSize: 18,
        bold: true,
        color: "#333",
        marginBottom: 12,
        alignment: "center" as const,
      },
      sectionHeader: {
        fontSize: 14,
        bold: true,
        color: "#444",
        margin: [0, 15, 0, 8] as [number, number, number, number],
      },
      content: {
        fontSize: 11,
        color: "#555",
        marginBottom: 3,
        lineHeight: 1.3,
      },
      footer: {
        alignment: "center" as const,
        italics: true,
        fontSize: 12,
        color: "#333",
      },
    },
  };

  pdfMake
    .createPdf(docDefinition as any)
    .download(`pedido-banda-larga-pf-${order.ordernumber || order.id}.pdf`);
};
