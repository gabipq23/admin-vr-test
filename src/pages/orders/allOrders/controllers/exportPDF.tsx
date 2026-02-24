import { IPurchase, IPurchaseItens } from "@/interfaces/purchase";
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

export const generatePDF = async (purchase: IPurchase | undefined) => {
  const logoVivo = await getBase64FromImageUrl("/assets/logovivopdf.png");
  const logoGold = await getBase64FromImageUrl("/assets/goldpdf.png");
  let typeOfPayment = "-";
  if (purchase?.forma_pagamento === "fatura vivo+cartao credito") {
    typeOfPayment = "Fatura Vivo + Cartão de Crédito";
  } else if (purchase?.forma_pagamento === "cartao credito") {
    typeOfPayment = "Cartão de Crédito";
  } else if (purchase?.forma_pagamento === "fatura vivo") {
    typeOfPayment = "Fatura Vivo";
  }

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
        columns: [{ text: `Orçamento Nº${purchase?.id}`, style: "title" }],
      },

      // Produtos em formato de tabela
      { text: "Detalhes", style: "sectionHeader" },
      {
        table: {
          headerRows: 1,
          widths: [65, 45, 40, 80, 30, 25, 50, 50, 40],
          body: [
            [
              { text: "Código", style: "tableHeader" },
              { text: "Tipo", style: "tableHeader" },
              { text: "Marca", style: "tableHeader" },
              { text: "Modelo", style: "tableHeader" },
              { text: "Cor", style: "tableHeader" },
              { text: "Quant.", style: "tableHeader" },
              { text: "Parcela (R$)", style: "tableHeader" },
              { text: "Parcelamento", style: "tableHeader" },
              { text: "Seguro", style: "tableHeader" },
            ],
            ...(purchase?.itens ?? []).map((item: IPurchaseItens) => [
              { text: item.cod_sap, style: "tableBody" },
              { text: item.tipo, style: "tableBody" },
              { text: item.marca, style: "tableBody" },
              { text: item.modelo, style: ["tableBody"] },
              { text: item.cor_escolhida, style: "tableBody" },
              { text: item.quantidade, style: "tableBody" },
              {
                text:
                  item.valor_parcelado !== undefined &&
                  item.valor_parcelado !== null
                    ? `${(
                        Number(item.valor_parcelado) /
                        (purchase?.parcelamento || 1)
                      ).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "-",
                style: "tableBody",
              },
              {
                text: `${
                  purchase?.parcelamento === 1
                    ? "à vista"
                    : `${purchase?.parcelamento}x`
                }`,
                style: "tableBody",
              },
              {
                text:
                  String(item.seguro_valor) === "0.00" ||
                  Number(item.seguro_valor) === 0
                    ? "-"
                    : item.seguro_valor !== undefined &&
                        item.seguro_valor !== null
                      ? `${Number(
                          item.quantidade * item.seguro_valor,
                        ).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}/mês`
                      : "-",
                style: "tableBody",
              },
            ]),
          ],
        },
        layout: "lightHorizontalLines",
        style: "productTable",
      },

      // Informações do comprador
      { text: "Informações do comprador", style: "sectionHeader" },
      {
        type: "circle",
        ul: [
          `Gestor da conta (SFA): ${purchase?.gestor_sfa || "-"}`,
          `CNPJ: ${purchase?.cnpj || "-"}`,
          `Razão Social: ${purchase?.razao_social || "-"}`,
          `Telefone: ${purchase?.telefone || "-"}`,
          `Email: ${purchase?.email || "-"}`,
          `Novo Telefone: ${purchase?.telefone_alterado || "-"}`,
          `Novo Email: ${purchase?.email_alterado || "-"}`,
          `Telefone (Comprador): ${purchase?.telefone_comprador || "-"}`,
          `Nome (Comprador): ${purchase?.nome || "-"}`,
        ],
        style: "content",
      },

      // Endereço
      { text: "Informações de entrega", style: "sectionHeader" },
      {
        type: "circle",
        ul: [
          `Endereço: ${purchase?.endereco_sfa || "-"}`,
          `Bairro: ${purchase?.bairro || purchase?.empresa?.bairro || "-"}`,
          `Número: ${
            purchase?.numero_fachada || purchase?.empresa?.numero_fachada || "-"
          }`,
          `Cidade: ${purchase?.cidade || "-"}`,
          `UF: ${purchase?.uf || "-"}`,
          `CEP: ${purchase?.cep || purchase?.empresa?.nr_cep || "-"}`,
          `Complemento: ${purchase?.complemento || "-"}`,
          `Observações: ${purchase?.observacao_endereco || "-"}`,
        ],
        style: "content",
      },
      // Pagamento
      { text: "Resumo do pedido", style: "sectionHeader" },
      { text: "Serviços:", style: "content", margin: [0, 4, 0, 2] },

      { text: "", margin: [0, 4, 0, 0] },

      ...(purchase && purchase.itens
        ? purchase.itens
            .filter((item: IPurchaseItens) => item.seguro_tipo !== null)
            .reverse()
            .map((item: IPurchaseItens, idx, arr) => [
              {
                columns: [
                  {
                    text: [
                      "Seguro de ",
                      item.seguro_tipo === "roubo_furto_simples_qualificado"
                        ? "Roubo, Furto Simples/Qualificado"
                        : "Roubo, Furto Simples/Qualificado e Danos",
                      " - ",
                      { text: item.modelo, fontSize: 8 },
                    ],
                    style: "content",
                  },
                  {
                    text:
                      "R$ " +
                      Number(
                        item?.quantidade * item?.seguro_valor,
                      ).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }),
                    style: "content",
                    alignment: "right",
                  },
                ],
                margin: [0, 0, 0, 0],
              },

              ...(idx < arr.length - 1
                ? [
                    {
                      canvas: [
                        {
                          type: "line",
                          x1: 0,
                          y1: 0,
                          x2: 555,
                          y2: 0,
                          lineWidth: 0.5,
                          lineColor: "#e5e5e5",
                        },
                      ],
                      margin: [0, 4, 0, 4],
                    },
                  ]
                : []),
            ])
            .flat()
        : []),
      [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 555,
              y2: 0,
              lineWidth: 0.5,
              lineColor: "#e5e5e5",
            },
          ],
          margin: [0, 4, 0, 4],
        },
      ],
      // Espaço visual entre Serviços e o restante
      { text: "", margin: [0, 8, 0, 0] },
      { text: "Produtos:", style: "content", margin: [0, 4, 0, 2] },

      { text: "", margin: [0, 4, 0, 0] },

      {
        columns: [
          { text: "Quantidade de itens", style: "content" },
          {
            text: `${purchase?.itens.reduce(
              (total: number, item: IPurchaseItens) =>
                total + Number(item.quantidade),
              0,
            )}`,
            style: "content",
            alignment: "right",
          },
        ],
      },
      { text: "", margin: [0, 10, 0, 0] },
      [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 555,
              y2: 0,
              lineWidth: 0.5,
              lineColor: "#e5e5e5",
            },
          ],
          margin: [0, 4, 0, 4],
        },
      ],
      { text: "", margin: [0, 2, 0, 0] },
      {
        columns: [
          { text: "Frete", style: "content" },
          { text: "Grátis", style: "content", alignment: "right" },
        ],
      },
      { text: "", margin: [0, 2, 0, 0] },
      [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 555,
              y2: 0,
              lineWidth: 0.5,
              lineColor: "#e5e5e5",
            },
          ],
          margin: [0, 4, 0, 4],
        },
      ],
      { text: "", margin: [0, 2, 0, 0] },
      {
        columns: [
          { text: "Forma de pagamento", style: "content" },
          { text: typeOfPayment, style: "content", alignment: "right" },
        ],
      },
      { text: "", margin: [0, 2, 0, 0] },
      [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 555,
              y2: 0,
              lineWidth: 0.5,
              lineColor: "#e5e5e5",
            },
          ],
          margin: [0, 4, 0, 4],
        },
      ],
      { text: "", margin: [0, 2, 0, 0] },

      {
        columns: [
          { text: "Parcelamento", style: "content" },
          {
            text: `${
              purchase?.parcelamento === 1
                ? "à vista"
                : `${purchase?.parcelamento}x`
            }`,
            style: "content",
            alignment: "right",
          },
        ],
      },
      { text: "", margin: [0, 2, 0, 0] },
      [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 555,
              y2: 0,
              lineWidth: 0.5,
              lineColor: "#e5e5e5",
            },
          ],
          margin: [0, 4, 0, 4],
        },
      ],
      { text: "", margin: [0, 8, 0, 0] },
      {
        columns: [
          { text: "Valor da parcela mensal (Produtos)", style: "content" },
          {
            text: `R$ ${Number(purchase?.valor_parcela_total).toLocaleString(
              "pt-BR",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}`,
            style: "content",
            alignment: "right",
          },
        ],
      },
      { text: "", margin: [0, 2, 0, 0] },
      [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 555,
              y2: 0,
              lineWidth: 0.5,
              lineColor: "#e5e5e5",
            },
          ],
          margin: [0, 4, 0, 4],
        },
      ],
      { text: "", margin: [0, 2, 0, 0] },
      {
        columns: [
          { text: "Valor da parcela mensal (Serviços)", style: "content" },
          {
            text: `R$ ${Number(
              purchase?.itens
                .filter((item) => item.seguro_valor)
                .reduce(
                  (total: number, item: IPurchaseItens) =>
                    total + Number(item?.quantidade * item?.seguro_valor),
                  0,
                ),
            ).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            style: "content",
            alignment: "right",
          },
        ],
      },
      { text: "", margin: [0, 2, 0, 0] },

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
        fontSize: 8,
        color: "#222",
        fillColor: "#f3f3f3",
        margin: [0, 2, 0, 2],
      },
      tableBody: {
        fontSize: 8,
        color: "#444",
      },
      modeloCell: {
        fontSize: 10,
      },
      productTable: {
        margin: [0, 5, 0, 15],
      },
      title: { fontSize: 16, bold: true, color: "#333", marginBottom: 8 },
      sectionHeader: {
        fontSize: 14,
        bold: true,
        color: "#444",
        margin: [0, 10, 0, 4] as [number, number, number, number],
      },
      content: { fontSize: 11, color: "#555", marginBottom: 2 },
      productRow: {
        margin: [0, 5, 0, 10] as [number, number, number, number],
        borderTop: [true, false, false, false],
        borderColor: "#ccc",
        paddingTop: 5,
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
    .download(`pedido-${purchase?.id}.pdf`);
};
