import { IPurchase, IPurchaseResponse } from "@/interfaces/purchase";
import { formatBRL } from "@/utils/formatBRL";
import { formatDateTimeBR } from "@/utils/formatDateTimeBR";
import * as XLSX from "xlsx";
export const handleExportXLSX = (
  data: IPurchaseResponse | undefined,
  selectedRowKeys: any,
) => {
  if (!data || !selectedRowKeys || selectedRowKeys.length === 0) return;

  const pedidosSelecionados = data.pedidos?.filter((item: IPurchase) =>
    selectedRowKeys.includes(item.id),
  );

  if (!pedidosSelecionados || pedidosSelecionados.length === 0) return;

  const maxItens = Math.max(
    ...pedidosSelecionados.map((pedido) =>
      Array.isArray(pedido.itens) ? pedido.itens.length : 0,
    ),
  );

  const camposMonetarios = [
    "total",
    "credito_utilizado",
    "valor_parcela_total",
    "credito_cliente.credito",
  ];
  const camposDataHora = ["data_criacao", "data_fechamento"];

  const colNames: Record<string, string> = {
    id: "Id do Pedido",
    cnpj: "CNPJ",
    razao_social: "Razão Social",
    total: "Total",
    status: "Status do Carrinho",
    credito_utilizado: "Crédito Utilizado",
    forma_pagamento: "Forma de Pagamento",
    email: "Email",
    email_alterado: "Email Alterado",
    data_criacao: "Abertura",
    data_fechamento: "Fechamento",
    telefone: "Telefone",
    endereco_sfa: "Endereço",
    gestor_sfa: "Gestor SFA",
    parcelamento: "Parcelamento",
    observacao_endereco: "Observação Endereço",
    nome: "Nome do Comprador",
    complemento: "Complemento",
    telefone_comprador: "Telefone do Comprador",
    telefone_alterado: "Telefone Alterado",
    id_vivo_corp: "ID Vivo",
    id_crm: "ID CRM",
    consultor_responsavel: "Consultor Responsável",
    status_pos_venda: "Status do Pedido",
    numero_fachada: "Número Fachada",
    cep: "CEP",
    cidade: "Cidade",
    uf: "UF",
    bairro: "Bairro",
    valor_parcela_total: "Valor Parcela Total",
    credito_disponivel: "Crédito Disponível",
    equipe: "Equipe",
  };

  const camposIgnorados = [
    "M",
    "id_gestor",
    "possivel_prospect_nova_linha",
    "possivel_prospect_seguro",
    "possivel_prospect_iphone_17",
    "credito_cliente",
    "empresa",
    "observacao_foi_editado",
    "complemento_foi_editado",
    "telefone_foi_editado",
    "email_foi_editado",
    "telefone_alterado",
    "email_alterado",
    "bairro_alterado",
    "modelo_reserva",
    "quantidade_aparelhos",
    "email_reserva",
    "cliente_gold",
    "itens",
    "observacao",
  ];

  const pedidosFormatados = pedidosSelecionados.map((pedido) => {
    const itens = Array.isArray(pedido.itens) ? pedido.itens : [];
    const linha: any = {};

    Object.keys(pedido).forEach((key) => {
      if (!camposIgnorados.includes(key)) {
        if (camposMonetarios.includes(key)) {
          linha[colNames[key] || key] = formatBRL((pedido as any)[key]);
        } else if (camposDataHora.includes(key)) {
          linha[colNames[key] || key] = formatDateTimeBR((pedido as any)[key]);
        } else {
          linha[colNames[key] || key] = (pedido as any)[key];
        }
      }
    });

    for (let i = 0; i < maxItens; i++) {
      const item = itens[i];
      linha[
        `Item ${
          i + 1
        } (Código SAP, Tipo Modelo, Marca, Quantidade, Valor da Parcela, Seguro )`
      ] = item
        ? [
            item.cod_sap || "",
            item.tipo || "",
            item.modelo || "",
            item.marca || "",
            item.quantidade || "",
            formatBRL(item.valor_parcela) || "",
            formatBRL(item.seguro_valor) || "",
          ].join(", ")
        : "";
    }
    return linha;
  });

  const pedidoSheet = XLSX.utils.json_to_sheet(pedidosFormatados);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, pedidoSheet, "Pedidos");

  XLSX.writeFile(workbook, `pedidos-selecionados.xlsx`);
};
