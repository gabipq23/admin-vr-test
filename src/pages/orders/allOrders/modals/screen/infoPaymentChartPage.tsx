import {
  IPayloadUpdateDataFormValues,
  IPurchase,
  IPurchaseItens,
} from "@/interfaces/purchase";

import { formatCNPJ } from "@/utils/formatCNPJ";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";

import { ItensListLargeScreen } from "./itensListLarge";
import { ItensListSmallScreen } from "./itensListSmall";

import { formatCEP } from "@/utils/formatCEP";
import { CopyOutlined, ExclamationOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";
import { Form, Input, ConfigProvider, Tooltip, Button } from "antd";
import { getTypeOfPayment } from "@/utils/getTypeOfPayment";

interface IInfoPaymentChartPage {
  dataSource?: IPurchase | null;
  updateData: (
    pedido_id: string | undefined,
    formValues: IPayloadUpdateDataFormValues
  ) => void;
}

export const InfoPaymentChartPage = ({
  dataSource,
  updateData,
}: IInfoPaymentChartPage) => {
  const [form] = Form.useForm();

  //função para retornar todos os cenários aplicáveis de cores de BG com as possíveis travas
  const getAlertScenarios = (
    gestor_sfa?: string,
    email?: string,
    telefone?: string,
    status?: string,
    empresa?: any,
    credito_disponivel?: string | number,
    total?: string | number,
    credito_cliente?: any,
    itens?: any,
    telefone_foi_editado?: boolean | number,
    email_foi_editado?: boolean | number,
    observacao_foi_editado?: boolean | number,
    complemento_foi_editado?: boolean | number
  ) => {
    const scenarios: { color: string; content: React.ReactNode }[] = [];
    const travaRFB = empresa?.situacao_cadastral;
    const valorTotal = Number(total) || 0;
    const credito = Number(credito_disponivel) || 0;
    const isCreditEnough = credito >= valorTotal;

    const quantityOfItemsAllowedToBuy = credito_cliente?.telefones?.reduce(
      (total: number, telefone: any) => total + (telefone.elegiveis ? 1 : 0),
      0
    );
    const quantityOfItemsAtChart = itens
      ?.filter(
        (item: IPurchaseItens) =>
          item.tipo === "Smartphone" || item.tipo === "Tablet"
      )
      .reduce(
        (total: number, item: IPurchaseItens) =>
          total + Number(item.quantidade),
        0
      );

    const isQuantityApproved =
      (quantityOfItemsAtChart ?? 0) <= (quantityOfItemsAllowedToBuy ?? 0);

    if (credito === 0) {
      scenarios.push({
        color: "#ffeaea",
        content: (
          <p>Esse cliente não possui crédito disponível para o pedido.</p>
        ),
      });
    }

    if (
      status === "fechado" &&
      (telefone_foi_editado ||
        email_foi_editado ||
        observacao_foi_editado ||
        complemento_foi_editado)
    ) {
      const camposEditados: string[] = [];
      if (telefone_foi_editado) camposEditados.push("telefone");
      if (email_foi_editado) camposEditados.push("email");
      if (observacao_foi_editado) camposEditados.push("observação");
      if (complemento_foi_editado) camposEditados.push("complemento");
      scenarios.push({
        color: "#fff6c7",
        content: (
          <p>
            Esse cliente editou a(s) informação(ões):{" "}
            <strong>{camposEditados.join(", ")}</strong>
          </p>
        ),
      });
    }

    if (
      status === "fechado" &&
      (travaRFB === "INAPTA" ||
        travaRFB === "BAIXADA" ||
        travaRFB === "SUSPENSA")
    ) {
      scenarios.push({
        color: "#ffeaea",
        content: (
          <p>
            Esse cliente está com status BAIXADA, SUSPENSA ou INAPTA na Receita
            Federal.
          </p>
        ),
      });
    }

    if (
      status === "fechado" &&
      travaRFB === "ATIVA" &&
      (!gestor_sfa || !email || !telefone)
    ) {
      scenarios.push({
        color: "#fff6c7",
        content: (
          <p>
            Essa empresa não possui a informação de{" "}
            {!gestor_sfa && <strong>Nome do gestor</strong>}
            {!gestor_sfa && (!email || !telefone) && " e "}
            {!email && <strong>Email</strong>}
            {!email && !telefone && " e "}
            {!telefone && <strong>Telefone</strong>}.
          </p>
        ),
      });
    }

    if (status === "fechado" && travaRFB === "ATIVA" && !isQuantityApproved) {
      scenarios.push({
        color: "#fff6c7",
        content: (
          <p>
            Esse cliente escolheu mais itens do que é permitido, pois{" "}
            {quantityOfItemsAllowedToBuy === 0 ||
              quantityOfItemsAllowedToBuy == null
              ? "não possui itens com MVivo elegível"
              : `possui ${quantityOfItemsAllowedToBuy} itens com MVivo elegível`}{" "}
            e adicionou {quantityOfItemsAtChart} itens no carrinho.
          </p>
        ),
      });
    }

    if (status === "fechado" && travaRFB === "ATIVA" && !isCreditEnough) {
      scenarios.push({
        color: "#fff6c7",
        content: (
          <>
            <p>Esse cliente não possui crédito suficiente para o pedido</p>
            <p>
              O valor total do pedido é R${" "}
              {Number(valorTotal).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p>
              O crédito disponível é de R${" "}
              {Number(credito).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </>
        ),
      });
    }

    if (
      status === "fechado" &&
      travaRFB === "ATIVA" &&
      isQuantityApproved &&
      isCreditEnough &&
      gestor_sfa &&
      email &&
      telefone
    ) {
      scenarios.push({
        color: "#e6ffed",
        content: <p>Esse cliente passou em todas as travas.</p>,
      });
    }

    if (status === "fechado" && !travaRFB) {
      scenarios.push({
        color: "#fff6c7",
        content: (
          <p>
            Não foi possível validar a situação cadastral deste cliente na
            Receita Federal.
          </p>
        ),
      });
    }

    return scenarios;
  };

  const [tooltipTitle, setTooltipTitle] = useState("Copiar");

  const handleCopy = (
    code: string,
    setTooltip: React.Dispatch<React.SetStateAction<string>>
  ) => {
    navigator.clipboard.writeText(code || "-");
    setTooltip("Copiado!");
    setTimeout(() => setTooltip("Copiar"), 2000);
  };

  const copyComponent = (text: string) => {
    return (
      <Tooltip
        styles={{ body: { fontSize: "11px" } }}
        title={tooltipTitle}
        trigger="hover"
        placement="top"
      >
        <div
          onClick={() => dataSource && handleCopy(text, setTooltipTitle)}
          className="text-[#666666] cursor-pointer"
        >
          <CopyOutlined style={{ fontSize: 16, color: "purple" }} />
        </div>
      </Tooltip>
    );
  };

  useEffect(() => {
    if (dataSource) {
      form.setFieldsValue({
        observacao: dataSource.observacao || "",
      });
    }
  }, [dataSource, form]);

  const handleSaveObservacao = async () => {
    const values = await form.validateFields();

    updateData(dataSource?.id, {
      pedido_id: dataSource?.id,
      observacao: values.observacao,
    });
  };

  return (
    <div className="flex flex-col min-h-[617px] ">
      <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] mt-3 p-3  w-full ">
        <div className=" ">
          {" "}
          <h2 className="text-[14px]">Detalhes</h2>
        </div>

        <ItensListLargeScreen purchaseById={dataSource} />

        {/* CARDS - VISÍVEL EM TELAS PEQUENAS */}
        <ItensListSmallScreen purchaseById={dataSource} />
      </div>

      <div className="flex flex-col gap-3 text-[14px] py-3 flex-wrap  w-full  ">
        {/* Informações do usuario */}
        <div className="flex flex-col  gap-2 bg-neutral-100 mb-3 rounded-[4px] p-3  w-full">
          <div className=" flex items-center">
            <h2 className=" text-[14px] font-semibold">
              {" "}
              Informações do comprador
            </h2>
          </div>

          <div className="flex flex-col  text-neutral-800 gap-2 rounded-lg min-h-[120px] p-4">
            <div className="text-[14px] w-full text-neutral-700">
              <p className="flex gap-2">
                <strong>Razão Social:</strong>{" "}
                {dataSource?.empresa?.nm_cliente || "-"}{" "}
                {copyComponent(dataSource?.empresa?.nm_cliente ?? "")}
              </p>
            </div>

            {/* Mobile: CNPJ e Razão Social eem coluna */}
            <div className="flex flex-col gap-2 text-[14px] w-full text-neutral-700">
              <p className="flex gap-2">
                <strong>CNPJ:</strong>{" "}
                {formatCNPJ(dataSource?.cnpj ?? "") || "-"}{" "}
                {copyComponent(dataSource?.cnpj ?? "")}
              </p>
              <p className="flex gap-2">
                <strong>Gestor da conta:</strong>{" "}
                {dataSource?.gestor_sfa || "-"}{" "}
                {copyComponent(dataSource?.gestor_sfa ?? "")}
              </p>
            </div>

            {/* Mobile: Telefone e Email em coluna */}
            <div className="flex flex-col gap-2  text-[14px] w-full text-neutral-700">
              <p className="flex gap-2">
                <strong>Telefone :</strong>{" "}
                {formatPhoneNumber(dataSource?.telefone ?? "") || "-"}{" "}
                {copyComponent(dataSource?.telefone ?? "")}
              </p>
              <p className="flex gap-2">
                <strong>Email :</strong> {dataSource?.email || "-"}{" "}
                {copyComponent(dataSource?.email ?? "")}
              </p>
            </div>
            <div className="flex flex-col gap-2 text-[14px] w-full text-neutral-700">
              {dataSource?.telefone_alterado !== null && (
                <p className="flex gap-2">
                  <strong>Novo Telefone:</strong>{" "}
                  {formatPhoneNumber(dataSource?.telefone_alterado ?? "") ||
                    "-"}{" "}
                  {copyComponent(dataSource?.telefone_alterado ?? "")}
                </p>
              )}
              {dataSource?.email_alterado !== null && (
                <p className="flex gap-2">
                  <strong>Novo Email:</strong>{" "}
                  {dataSource?.email_alterado || "-"}{" "}
                  {copyComponent(dataSource?.email_alterado ?? "")}
                </p>
              )}
            </div>
            {/* Mobile: Telefone e Email em coluna */}
            <div className="flex flex-col gap-2 text-[14px] w-full text-neutral-700">
              <p className="flex gap-2">
                <strong>Nome (Comprador) :</strong> {dataSource?.nome || "-"}{" "}
                {copyComponent(dataSource?.nome ?? "")}
              </p>
              <p className="flex gap-2">
                <strong>Telefone (Comprador) :</strong>{" "}
                {formatPhoneNumber(dataSource?.telefone_comprador ?? "") || "-"}{" "}
                {copyComponent(dataSource?.telefone_comprador ?? "")}
              </p>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="flex flex-col text-[14px] py-3 bg-neutral-100 mb-3 rounded-[4px] p-3  gap-2 w-full">
          <div className=" flex items-center">
            <h2 className="p-4 text-[14px] font-semibold">
              {" "}
              Informações de entrega
            </h2>
          </div>
          <div className="flex flex-col  text-neutral-800 gap-2 rounded-lg min-h-[120px] p-4">
            <div className="  gap-4 text-[14px] w-full text-neutral-700">
              <p className="flex gap-2">
                <strong>Endereço:</strong> {dataSource?.endereco_sfa || "-"}{" "}
                {copyComponent(dataSource?.endereco_sfa ?? "")}
              </p>
            </div>

            {/* Mobile: CNPJ e Razão Social em coluna */}
            <div className="flex flex-col gap-2  text-[14px] w-full text-neutral-700">
              <p className="flex gap-2">
                <strong>Número:</strong>{" "}
                {dataSource?.numero_fachada ||
                  dataSource?.empresa?.numero_fachada ||
                  "-"}{" "}
                {copyComponent(
                  dataSource?.numero_fachada ??
                  dataSource?.empresa?.numero_fachada ??
                  ""
                )}
              </p>
              <p className="flex gap-2">
                <strong>Bairro:</strong>{" "}
                {dataSource?.bairro || dataSource?.empresa?.bairro || "-"}{" "}
                {copyComponent(
                  dataSource?.bairro ?? dataSource?.empresa?.bairro ?? ""
                )}
              </p>
              <p className="flex gap-2">
                <strong>Cidade:</strong> {dataSource?.cidade || "-"}{" "}
                {copyComponent(dataSource?.cidade ?? "")}
              </p>
            </div>

            {/* Mobile: Telefone e Email em coluna */}
            <div className="flex flex-col gap-2  text-[14px] w-full text-neutral-700">
              <p className="flex gap-2">
                <strong>UF:</strong> {dataSource?.uf || "-"}{" "}
                {copyComponent(dataSource?.uf ?? "")}
              </p>
              <p className="flex gap-2">
                <strong>CEP:</strong>{" "}
                {formatCEP(
                  dataSource?.cep ?? dataSource?.empresa?.nr_cep ?? ""
                ) || "-"}{" "}
                {copyComponent(
                  dataSource?.cep ?? dataSource?.empresa?.nr_cep ?? ""
                )}
              </p>
            </div>

            {/* Mobile: Telefone e Email em coluna */}
            <div className="flex flex-col gap-2  text-[14px] w-full text-neutral-700">
              <p className="flex gap-2">
                <strong>Complemento:</strong> {dataSource?.complemento || "-"}{" "}
                {copyComponent(dataSource?.complemento ?? "")}
              </p>
              <p className="flex gap-2">
                <strong>Observação:</strong>{" "}
                {dataSource?.observacao_endereco || "-"}{" "}
                {copyComponent(dataSource?.observacao_endereco ?? "")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center  bg-neutral-100 min-h-[400px] max-h-[800px] text-[14px] rounded-[4px] mb-[29px] ">
        <div className="flex m-3 flex-col gap-4 ">
          <div className="px-2">
            {" "}
            <p className="text-[15px]"> Resumo do pedido</p>
          </div>

          {dataSource?.itens?.some(
            (item: IPurchaseItens) =>
              item.seguro_tipo !== null &&
              item.seguro_valor !== null &&
              item.seguro_valor !== 0
          ) && (
              <>
                <div className="px-2">
                  <p className="text-[15px] ">Serviços</p>
                </div>
              </>
            )}

          {dataSource?.itens
            .filter((item: IPurchaseItens) => item.seguro_tipo !== null)
            .map((item: IPurchaseItens, idx: number, arr) => (
              <div key={idx} className="w-full">
                <div className="flex w-full justify-between px-2">
                  <div className="flex items-center justify-center ">
                    {" "}
                    <p className="text-[14px] text-[#666666]">
                      Seguro de{" "}
                      {item.seguro_tipo === "roubo_furto_simples_qualificado"
                        ? "Roubo, Furto Simples/Qualificado"
                        : "Roubo, Furto Simples/Qualificado e Danos"}{" "}
                    </p>
                    <p className="text-[14px] text-[#868686]">
                      {" "}
                      - {item.modelo}
                    </p>
                  </div>
                  <p>
                    R${" "}
                    {Number(item.seguro_valor ?? 0).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                {idx < arr.length - 1 && (
                  <hr className="border-t border-neutral-300 mt-2 w-full" />
                )}
              </div>
            ))}
          <hr className="border-t border-neutral-300 mb-2 w-full" />
          <div className="px-2">
            <p className="text-[15px] ">Produtos</p>
          </div>

          <div className="flex w-full justify-between px-2">
            <p className="text-[14px] text-[#666666]">Quantidade de itens</p>
            <p>
              {dataSource?.itens.reduce(
                (total: number, item: IPurchaseItens) =>
                  total + Number(item.quantidade),
                0
              )}
            </p>
          </div>

          <hr className="border-t border-neutral-300 mb-2 w-full" />

          <div className="flex w-full justify-between px-2">
            <p className="text-[14px] text-[#666666]">Frete</p>
            <p className="text-[14px] text-[#32a04b]">Grátis</p>
          </div>

          <hr className="border-t border-neutral-300 mb-2  w-full" />

          <div className="flex w-full justify-between px-2">
            <p className="text-[14px] text-[#666666]">Forma de Pagamento</p>
            <p className="text-[14px]">
              {getTypeOfPayment(dataSource?.forma_pagamento)}
            </p>
          </div>

          <hr className="border-t border-neutral-300 mb-2  w-full" />

          <div className="flex w-full justify-between px-2">
            <p className="text-[14px] text-[#666666]">Parcelamento</p>
            <p className="text-[14px]">
              {" "}
              {dataSource?.parcelamento === 1
                ? "à vista"
                : `${dataSource?.parcelamento}x`}
            </p>
          </div>

          <hr className="border-t border-neutral-400 mb-2  w-full" />
        </div>
        <div className="flex flex-col items-start m-3 gap-2 ">
          <div className="flex w-full justify-between mb-4 px-2 text-[14px] font-bold">
            <p className="text-[#666666]">Valor da parcela mensal (Produtos)</p>
            <p>
              R${" "}
              {dataSource?.valor_parcela_total.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <hr className="border-t border-neutral-300 w-full" />

          {dataSource?.itens?.some(
            (item: IPurchaseItens) =>
              item.seguro_tipo !== null &&
              item.seguro_valor !== null &&
              item.seguro_valor !== 0
          ) && (
              <div className="flex w-full justify-between mb-4 px-2 text-[14px] font-bold">
                <p className="text-[#666666]">
                  Valor da parcela mensal (Serviços)
                </p>
                <p>
                  R${" "}
                  {dataSource?.itens
                    .filter((item: IPurchaseItens) => item.seguro_valor)
                    .reduce(
                      (total: number, item: IPurchaseItens) =>
                        total + Number(item.seguro_valor ?? 0),
                      0
                    )
                    .toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </p>
              </div>
            )}

          <div className="flex w-full justify-between mb-6 text-[14px] px-2 font-bold">
            <p className="text-[#666666]">Valor total do pedido</p>
            <p>
              R$
              {Number(dataSource?.total).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      {dataSource?.status === "fechado" &&
        getAlertScenarios(
          dataSource?.gestor_sfa,
          dataSource?.email,
          dataSource?.telefone,
          dataSource?.status,
          dataSource?.empresa,
          dataSource?.credito_cliente?.credito,
          dataSource?.total,
          dataSource?.credito_cliente,
          dataSource?.itens,
          dataSource?.telefone_foi_editado,
          dataSource?.email_foi_editado,
          dataSource?.observacao_foi_editado,
          dataSource?.complemento_foi_editado
        ).map((scenario, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 mb-3 rounded-[4px] p-3 w-full"
            style={{ backgroundColor: scenario.color }}
          >
            <div className="flex items-center">
              <h2 className="text-[14px] font-semibold">
                <ExclamationOutlined />
                <ExclamationOutlined /> ALERTA
                <ExclamationOutlined />
                <ExclamationOutlined />
              </h2>
            </div>
            <div className="flex flex-col text-neutral-800 gap-2 rounded-lg min-h-[50px] p-3">
              <div className="text-[14px] w-full text-neutral-700">
                {scenario.content}
              </div>
            </div>
          </div>
        ))}

      <ConfigProvider
        theme={{
          components: {
            Input: {
              hoverBorderColor: "#029d23",
              activeBorderColor: "#029d23",
              activeShadow: "none",
              colorBorder: "#bfbfbf",
              colorTextPlaceholder: "#666666",
            },
            Button: {
              colorBorder: "#029d23",
              colorText: "#029d23",

              colorPrimary: "#029d23",

              colorPrimaryHover: "#883fa2",
            },
          },
        }}
      >
        <div className="flex flex-col justify-center bg-neutral-100  text-[14px] rounded-[4px] ">
          <div className="p-4 pb-0">
            {" "}
            <p className="text-[15px]">Observação Consultor</p>
          </div>
          <Form form={form} layout="vertical">
            <div className="flex flex-col p-4 text-[14px] w-full text-neutral-700">
              <div className="min-w-[400px] max-w-full">
                {" "}
                <Form.Item
                  className="w-full "
                  name="observacao"
                  style={{ marginBottom: 8 }}
                >
                  <Input.TextArea
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    className=" text-[16px] font-light text-[#353535] w-full"
                    placeholder="Adicione aqui uma observação sobre esse pedido..."
                  />
                </Form.Item>
              </div>
              <Button
                className="self-end"
                style={{
                  fontSize: "12px",
                  height: "25px",
                }}
                onClick={handleSaveObservacao}
              >
                Salvar
              </Button>
            </div>
          </Form>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default InfoPaymentChartPage;