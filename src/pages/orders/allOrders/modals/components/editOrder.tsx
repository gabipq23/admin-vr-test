import { Form, Input, Select, Button, ConfigProvider, Tooltip } from "antd";
import { useEffect } from "react";
import React from "react";

import {
  IPurchaseResponse,
  IPayloadUpdateDataFormValues,
  IPurchase,
  IPurchaseItens,
  IPayloadUpdateDataItems,
  RemoveItemParams,
  IAddItemInChartFunction,
} from "src/interfaces/purchase";
import { DataType } from "src/interfaces/orderModal";
import { X } from "lucide-react";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { formatCNPJ } from "@/utils/formatCNPJ";
import { AllSelectsToAddProducts } from "./addNewDevice/addNewDevice";
import { IProduct } from "@/interfaces/product";

import type { MenuProps } from "antd";
import { Dropdown } from "antd";

import { Checkbox } from "antd";

const App: React.FC<{
  product?: IProduct | null;
  itemId: number;
  item: IPurchaseItens;
  removeInsurance: any;
  purchaseById: any;
  saveSelectedSeguro: (
    pedidoId: string,
    itemId: number,
    seguroTipo: string,
  ) => void;
}> = ({
  purchaseById,
  removeInsurance,
  product,
  itemId,
  saveSelectedSeguro,
  item,
}) => {
  const seguro1 = product?.valor_roubo_furto_simples_qualificado ?? 0;
  const seguro2 = product?.valor_roubo_furto_simples_qualificado_danos ?? 0;

  const getInitialSeguro = () => {
    if (item?.seguro_tipo === "roubo_furto_simples_qualificado") return seguro1;
    if (item?.seguro_tipo === "roubo_furto_simples_qualificado_danos")
      return seguro2;
    return null;
  };
  const [selectedSeguro, setSelectedSeguro] = React.useState<number | null>(
    getInitialSeguro(),
  );

  useEffect(() => {
    setSelectedSeguro(getInitialSeguro());
  }, [item?.seguro_tipo, seguro1, seguro2]);

  const handleChange = (key: number) => (e: any) => {
    if (e.target.checked) {
      setSelectedSeguro(key === 0 ? seguro1 : seguro2);
      const seguroTipo =
        key === 0
          ? "roubo_furto_simples_qualificado"
          : "roubo_furto_simples_qualificado_danos";
      saveSelectedSeguro(purchaseById?.id, itemId, seguroTipo);
    } else {
      setSelectedSeguro(null);
      saveSelectedSeguro(purchaseById?.id, itemId, "");
    }
  };

  const handleRemoveSeguro = () => {
    if (purchaseById?.id && itemId) {
      removeInsurance({
        id: Number(purchaseById?.id),
        itemId: itemId,
      });
    }
  };
  const items: MenuProps["items"] = [
    {
      type: "group",
      label: (
        <div className="px-2 py-1 text-xs text-gray-500">
          Deseja escolher um seguro para esse produto?
        </div>
      ),
      children: [
        {
          label: (
            <span className="flex items-center gap-2">
              <ConfigProvider
                theme={{
                  components: {
                    Checkbox: {
                      colorPrimary: "#660099",
                      colorPrimaryHover: "#660099",
                      borderRadius: 4,
                      controlInteractiveSize: 18,
                      lineWidth: 2,
                    },
                  },
                }}
              >
                <Checkbox
                  onChange={handleChange(0)}
                  checked={
                    item?.seguro_tipo === "roubo_furto_simples_qualificado"
                  }
                ></Checkbox>{" "}
              </ConfigProvider>
              Roubo, Furto, Simples e Qualificado: R$
              {seguro1.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              /mês
            </span>
          ),
          key: "0",
        },
        {
          label: (
            <span className="flex items-center gap-2">
              <ConfigProvider
                theme={{
                  components: {
                    Checkbox: {
                      colorPrimary: "#660099",
                      colorPrimaryHover: "#660099",
                      borderRadius: 4,
                      controlInteractiveSize: 18,
                      lineWidth: 2,
                    },
                  },
                }}
              >
                <Checkbox
                  onChange={handleChange(1)}
                  checked={
                    item?.seguro_tipo ===
                    "roubo_furto_simples_qualificado_danos"
                  }
                ></Checkbox>{" "}
              </ConfigProvider>
              Roubo, Furto, Simples, Qualificado e Danos: R$
              {seguro2.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              /mês
            </span>
          ),
          key: "1",
        },
        {
          label: (
            <span className="flex items-center gap-2">
              <ConfigProvider
                theme={{
                  components: { Checkbox: { colorPrimary: "#660099" } },
                }}
              >
                <Checkbox
                  checked={!item?.seguro_tipo}
                  onChange={handleRemoveSeguro}
                >
                  Sem seguro
                </Checkbox>
              </ConfigProvider>
            </span>
          ),
          key: "none",
        },
      ],
    },
  ];
  const tooltipMessage =
    selectedSeguro !== null ? "Mudar seguro" : "Adicionar seguro";
  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <a onClick={(e) => e.preventDefault()}>
        <Tooltip
          title={tooltipMessage}
          placement="top"
          styles={{ body: { fontSize: "11px" } }}
        >
          <Button color="purple" variant="link" className="w-13">
            {item?.seguro_valor !== null ? (
              <span style={{ fontWeight: 600, color: "#660099" }}>
                R${" "}
                {item?.seguro_valor?.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                /mês
              </span>
            ) : (
              <img src="/assets/seguro-favicon.png" alt="Seguro" />
            )}
          </Button>
        </Tooltip>
      </a>
    </Dropdown>
  );
};

export default function EditOrder({
  dataSource,
  selectedId,
  updateData,

  devices,
  addItemInChart,
  setShowEditOrderLayout,
  removeItem,
  removeInsurance,
  saveSelectedSeguro,
}: {
  dataSource: IPurchaseResponse | undefined;
  selectedId: DataType | null;
  removeItem?: (params: RemoveItemParams) => void;
  updateData: (
    pedido_id: string | undefined,
    formValues: IPayloadUpdateDataFormValues,
  ) => void;
  addItemInChart: (idProduto: IAddItemInChartFunction) => void;
  devices: IProduct[] | undefined;
  isDataLoading: boolean;
  setShowEditOrderLayout: (show: boolean) => void;
  removeInsurance: any;
  saveSelectedSeguro: any;
}) {
  const [form] = Form.useForm();

  const selectedItem = dataSource?.pedidos?.find(
    (item: IPurchase) => item?.id === selectedId?.id,
  );

  useEffect(() => {
    if (selectedItem) {
      form.setFieldsValue({
        forma_pagamento: selectedItem.forma_pagamento,
        parcelamento: selectedItem.parcelamento,
        complemento: selectedItem.complemento,
        telefone_alterado: selectedItem.telefone_alterado,
        email_alterado: selectedItem.email_alterado,
        nome: selectedItem.nome,
        telefone_comprador: selectedItem.telefone_comprador,
        observacao_endereco: selectedItem.observacao_endereco,
        endereco_sfa: selectedItem.endereco_sfa || "",
        bairro: selectedItem.bairro || "",
        numero_fachada: selectedItem.numero_fachada || "",
        cidade: selectedItem.cidade || "",
        uf: selectedItem.uf || "",
        cep: selectedItem.cep || "",
        itens: selectedItem.itens.map((item: IPurchaseItens) => ({
          id: item.id,
          cor: item.cor_escolhida,
          quantidade: item.quantidade,
        })),
      });
    }
  }, [selectedItem, form]);

  const OnSubmit = async () => {
    const values = await form.validateFields();

    const { itens: itensEditados, ...outrosCampos } = values;

    const pedido_id = selectedItem?.id;

    const itensComPedidoId = itensEditados?.map(
      (item: IPayloadUpdateDataItems) => ({
        pedido_id,
        id: item.id,
        cor: item.cor,
        quantidade: item.quantidade,
      }),
    );

    updateData(selectedId?.id, {
      ...outrosCampos,
      itens: itensComPedidoId,
    });
    setShowEditOrderLayout(false);
  };

  const inputGenerator = (
    title: string,
    formItemName: string,
    formItemValue: string,
    placeholder: string,
  ) => {
    return (
      <div className="flex h-9 gap-4 text-[14px] w-full text-neutral-700">
        <div className=" flex ">
          {" "}
          <p>
            <strong>{title}</strong>
          </p>
        </div>
        <div className="flex">
          <Form.Item
            className="flextext-[16px] font-light text-[#353535]"
            name={formItemName}
          >
            <Input
              size="small"
              maxLength={50}
              value={formItemValue}
              className="p-2 text-[16px] min-w-[300px] font-light text-[#353535]"
              placeholder={placeholder}
            />
          </Form.Item>
        </div>
      </div>
    );
  };

  if (!selectedItem) return null;
  return (
    <div className="text-[#666666] min-w-[320px] max-w-[1120px] h-[460px] flex flex-col gap-6 ">
      <ConfigProvider
        theme={{
          components: {
            Input: {
              hoverBorderColor: "#660099",
              activeBorderColor: "#660099",
              activeShadow: "none",
            },
            Select: {
              hoverBorderColor: "#660099",
              activeBorderColor: "#660099",
              activeOutlineColor: "none",
              colorBorder: "#a2a2a2",
              colorTextPlaceholder: "#a2a2a2",
            },
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          className="flex flex-col h-[460px] gap-4"
          onFinish={OnSubmit}
        >
          <div className="flex flex-col w-full gap-2 ">
            <div className="flex flex-col w-ful flex-wrap bg-neutral-100 mb-3 mt-3 rounded-[4px] p-3 pb-2 gap-2 ">
              <p className="text-[12px] text-neutral-600 ">Editor de pedido</p>

              <div className="flex justify-between lg:flex-nowrap md:flex-wrap ">
                <AllSelectsToAddProducts
                  addItemInChart={addItemInChart}
                  products={devices}
                  selectedId={selectedId?.id}
                />

                <ConfigProvider
                  theme={{
                    components: {
                      Select: {
                        hoverBorderColor: "#cb1ef5",
                        activeBorderColor: "#cb1ef5",
                        activeOutlineColor: "none",
                        colorBorder: "#660099",

                        colorTextPlaceholder: "#660099",
                      },
                    },
                  }}
                >
                  <div className="flex flex-col gap-4">
                    <Form.Item
                      name="parcelamento"
                      className="mb-0 flex justify-center items-center h-10 rounded"
                      style={{ marginBottom: 0 }}
                    >
                      <Select
                        className="min-w-30 w-full max-w-36"
                        showSearch
                        placeholder="Parcelamento"
                        options={[
                          { value: 1, label: "Preço à vista" },
                          { value: 2, label: "em 2x" },
                          { value: 3, label: "em 3x" },
                          { value: 4, label: "em 4x" },
                          { value: 5, label: "em 5x" },
                          { value: 6, label: "em 6x" },
                          { value: 7, label: "em 7x" },
                          { value: 8, label: "em 8x" },
                          { value: 9, label: "em 9x" },
                          { value: 10, label: "em 10x" },
                          { value: 24, label: "em 24x" },
                        ]}
                      />
                    </Form.Item>
                  </div>
                </ConfigProvider>
              </div>
            </div>

            <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3 w-full ">
              <div className="hidden md:block  text-neutral-700">
                {/* Header das informações */}
                <div className="flex items-center justify-between font-semibold text-[#666666] text-[14px]">
                  <p className="w-36 text-center ">Código</p>
                  <p className="w-36 text-center ">Tipo</p>
                  <p className="w-30 text-center ">Marca</p>
                  <p className="w-58 text-center ">Modelo</p>
                  <p className="w-36  text-center  flex items-center cursor-pointer gap-1 justify-center">
                    Cor{" "}
                  </p>
                  <p className="w-38  text-center ">Quantidade</p>
                  <p className="w-38 text-center ">Parcela (R$) </p>
                  {/* <p className="w-36 text-center  flex items-center cursor-pointer gap-1 justify-center">
                    Parcelamento
                  </p> */}
                  <p className="w-30 text-center ">Seguro </p>

                  <p className="w-12 text-center "> </p>
                </div>
                <hr className="border-t border-neutral-300 mx-2" />

                {/* Renderização dinâmica dos produtos em ordem decrescente */}
                {[...(selectedItem?.itens ?? [])]
                  .slice()
                  .reverse()
                  .map((product: IPurchaseItens, index: number) => {
                    return (
                      <React.Fragment key={product.id}>
                        <div className="flex items-center justify-between py-4 text-[14px]">
                          <p className="text-[14px]  font-semibold w-36 text-center">
                            {product.cod_sap}
                          </p>
                          <p className="text-[14px]  font-semibold w-36 text-center">
                            {product.tipo}
                          </p>
                          <p className="text-[14px]  font-semibold w-30 text-center">
                            {product.marca}
                          </p>
                          <p className="text-[14px]  font-semibold w-58 text-center">
                            {product.modelo || "-"}
                          </p>
                          <div className="text-[14px]   font-semibold w-36 flex justify-center items-center text-center">
                            <Form.Item
                              style={{ marginBottom: 0 }}
                              className="flex mb-0 w-3/5 self-start h-full items-center font-light text-[#353535]"
                              name={["itens", index, "cor"]}
                            >
                              <Select
                                className="min-w-[100px] font-light text-[#353535]"
                                showSearch
                                options={product.cores?.map((cor: string) => ({
                                  value: cor,
                                  label: cor,
                                }))}
                              />
                            </Form.Item>
                          </div>
                          <div className="w-38  flex justify-center items-center  text-center">
                            <Form.Item
                              style={{ marginBottom: 0 }}
                              className="flex w-[50px]  self-start h-full text-[14px] items-center font-light text-[#353535]"
                              name={["itens", index, "quantidade"]}
                            >
                              <Input
                                value={product.quantidade}
                                className=" p-2 w-3/5 text-[14px] min-w-[50px] font-light text-[#353535]"
                                placeholder="quantidade"
                              ></Input>
                            </Form.Item>
                          </div>
                          <p className="text-[14px]  text-neutral-700 font-semibold w-38 text-center">
                            R${" "}
                            {(
                              Number(product?.valor_parcelado) /
                              Number(selectedItem?.parcelamento || 1)
                            ).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          {/* <p className="text-[14px]  text-neutral-700 font-semibold w-36 text-center">
                            {selectedItem?.parcelamento === 1
                              ? "à vista"
                              : `${selectedItem?.parcelamento}x`}
                          </p> */}

                          <span className="w-26 text-center ">
                            <App
                              product={devices?.find(
                                (p) => p.id === product.aparelho_id,
                              )}
                              itemId={product.id}
                              saveSelectedSeguro={saveSelectedSeguro}
                              item={product}
                              removeInsurance={removeInsurance}
                              purchaseById={selectedId}
                            />
                          </span>

                          <Tooltip
                            title="Remover item"
                            placement="top"
                            styles={{ body: { fontSize: "11px" } }}
                          >
                            <Button
                              color="purple"
                              variant="link"
                              className="w-12"
                              onClick={() =>
                                removeItem?.({
                                  id: Number(selectedItem?.id),
                                  item_id: product?.id,
                                })
                              }
                            >
                              <X
                                size={20}
                                className="transition-transform duration-300 hover:rotate-180"
                              />
                            </Button>
                          </Tooltip>
                        </div>
                        <hr className="border-t border-neutral-300 mx-2" />
                      </React.Fragment>
                    );
                  })}
              </div>
            </div>

            <div className="flex flex-col  gap-2 bg-neutral-100 mb-3 rounded-[4px] p-3  w-full">
              <div className=" flex items-center">
                <h2 className="text-[14px] text-[#666666]">
                  {" "}
                  Informações do comprador
                </h2>
              </div>
              <div className="flex flex-col  text-neutral-800 gap-2 rounded-lg min-h-[320px] p-4">
                <div className="  gap-4 text-[14px] w-full text-neutral-700">
                  <p className=" ">
                    <strong>Razão Social:</strong>{" "}
                    {selectedItem?.empresa?.nm_cliente || "-"}
                  </p>
                </div>

                {/* Mobile: CNPJ e Razão Social eem coluna */}
                <div className="flex flex-col gap-2  text-[14px] w-full text-neutral-700">
                  <p>
                    <strong>CNPJ:</strong>{" "}
                    {formatCNPJ(selectedItem?.cnpj ?? "") || "-"}
                  </p>
                  <p>
                    <strong>Gestor da conta:</strong>{" "}
                    {selectedItem?.gestor_sfa || "-"}
                  </p>
                </div>

                {/* Mobile: Telefone e Email em coluna */}
                <div className="flex flex-col gap-2  text-[14px] w-full text-neutral-700">
                  <p>
                    <strong>Telefone :</strong>{" "}
                    {formatPhoneNumber(selectedItem?.telefone ?? "") || "-"}
                  </p>
                  <p>
                    <strong>Email :</strong> {selectedItem?.email || "-"}
                  </p>
                </div>
                <div className=" flex flex-col h-17 text-[14px] w-full  text-neutral-600">
                  <ConfigProvider
                    theme={{
                      components: {
                        Input: {
                          hoverBorderColor: "#660099",
                          activeBorderColor: "#660099",
                          activeShadow: "none",
                          colorBorder: "#bfbfbf",
                          colorTextPlaceholder: "#666666",
                        },
                        Button: {
                          colorBorder: "#660099",
                          colorText: "#660099",
                          colorPrimary: "#660099",
                          colorPrimaryHover: "#883fa2",
                        },
                      },
                    }}
                  >
                    <Form
                      onFinish={OnSubmit}
                      form={form}
                      layout="vertical"
                      className=" gap-4 h-[140px]"
                    >
                      <div className="flex gap-4 text-[14px] h-9 w-full text-neutral-700">
                        <p className="">
                          <strong>Novo Email:</strong>
                        </p>
                        <div className="flex gap-2">
                          <Form.Item
                            className="flex text-[16px] font-light text-[#353535]"
                            name="email_alterado"
                          >
                            <Input
                              size="small"
                              maxLength={50}
                              value={selectedItem?.email_alterado ?? ""}
                              className="p-2 text-[16px] min-w-[300px] font-light text-[#353535] "
                              placeholder="Email"
                            />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="flex gap-4 text-[14px] w-full h-8 text-neutral-700">
                        <p>
                          <strong>Novo Telefone: </strong>
                        </p>
                        <div className="flex gap-2">
                          <Form.Item
                            className="flex  text-[16px] font-light text-[#353535]"
                            name="telefone_alterado"
                          >
                            <Input
                              size="small"
                              value={selectedItem?.telefone_alterado ?? ""}
                              className="p-2  text-[16px] min-w-[120px] font-light text-[#353535]"
                              placeholder="Telefone"
                            ></Input>
                          </Form.Item>
                        </div>
                      </div>
                      <div className="flex gap-4 text-[14px] w-full h-8 text-neutral-700">
                        <p>
                          <strong>Nome (Comprador) :</strong>{" "}
                        </p>
                        <div className="flex gap-2">
                          <Form.Item
                            className="flex  text-[16px] font-light text-[#353535]"
                            name="nome"
                          >
                            <Input
                              size="small"
                              value={selectedItem?.nome ?? ""}
                              className="p-2  text-[16px] min-w-[120px] font-light text-[#353535]"
                              placeholder="Telefone"
                            ></Input>
                          </Form.Item>
                        </div>
                      </div>
                      <div className="flex gap-4 text-[14px] w-full h-8 text-neutral-700">
                        <p className="w-[200px]">
                          <strong>Telefone (Comprador) :</strong>{" "}
                        </p>
                        <div className="flex gap-4 text-[14px] w-full h-8 text-neutral-700">
                          <Form.Item
                            className="flex  text-[16px] font-light text-[#353535]"
                            name="telefone_comprador"
                          >
                            <Input
                              size="small"
                              value={selectedItem?.telefone_comprador ?? ""}
                              className="p-2  text-[16px] min-w-[120px] font-light text-[#353535]"
                              placeholder="Telefone"
                            ></Input>
                          </Form.Item>
                        </div>
                      </div>
                    </Form>
                  </ConfigProvider>
                </div>
              </div>
            </div>

            <div className="flex flex-col text-[14px] py-3  bg-neutral-100 mb-3 rounded-[4px] p-3  gap-2 w-full">
              <div className=" flex items-center">
                <h2 className="text-[14px] text-[#666666]">
                  Informações de entrega
                </h2>
              </div>

              <div className="flex flex-col  text-neutral-800 gap-2  min-h-[120px] p-4">
                <ConfigProvider
                  theme={{
                    components: {
                      Input: {
                        hoverBorderColor: "#660099",
                        activeBorderColor: "#660099",
                        activeShadow: "none",
                        colorBorder: "#bfbfbf",
                        colorTextPlaceholder: "#666666",
                      },
                      Button: {
                        colorBorder: "#660099",
                        colorText: "#660099",

                        colorPrimary: "#660099",

                        colorPrimaryHover: "#883fa2",
                      },
                    },
                  }}
                >
                  <Form
                    form={form}
                    layout="vertical"
                    className=" "
                    onFinish={OnSubmit}
                  >
                    {inputGenerator(
                      "Endereço:",
                      "endereco_sfa",
                      selectedItem?.endereco_sfa || "",
                      "Endereço",
                    )}
                    {inputGenerator(
                      "Número:",
                      "numero_fachada",
                      selectedItem?.numero_fachada || "",
                      "Número",
                    )}
                    {inputGenerator(
                      "Bairro:",
                      "bairro",
                      selectedItem?.bairro || "",
                      "Bairro",
                    )}

                    {inputGenerator(
                      "Cidade:",
                      "cidade",
                      selectedItem?.cidade || "",
                      "Cidade",
                    )}
                    {inputGenerator("UF:", "uf", selectedItem?.uf || "", "UF")}
                    {inputGenerator(
                      "CEP:",
                      "cep",
                      selectedItem?.cep || "",
                      "CEP",
                    )}
                    {inputGenerator(
                      "Complemento:",
                      "complemento",
                      selectedItem?.complemento || "",
                      "Complemento",
                    )}
                    <div className="flex h-16  mb-2 gap-4 text-[14px] w-full text-neutral-700">
                      <p>
                        <strong>Observação: </strong>
                      </p>
                      <div className="flex-1 min-w-[200px]  max-w-[400px]">
                        {" "}
                        <Form.Item
                          className="w-full"
                          name="observacao_endereco"
                        >
                          <Input.TextArea
                            autoSize={{ minRows: 3, maxRows: 3 }}
                            value={selectedItem?.observacao_endereco ?? ""}
                            className="p-2 text-[16px] font-light text-[#353535] w-full"
                            placeholder="Observação"
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </Form>
                </ConfigProvider>
              </div>
            </div>
          </div>

          <div
            className="flex justify-end gap-4 z-10"
            style={{
              position: "sticky",
              bottom: -1,
              left: 0,
              right: 0,
              paddingTop: "8px",
              paddingBottom: "8px",
              background: "#ffffff",
            }}
          >
            <Button
              onClick={() => setShowEditOrderLayout(false)}
              color="purple"
              variant="outlined"
              style={{
                color: "#660099",
                fontSize: "14px",
              }}
            >
              Cancelar
            </Button>
            <Button
              color="purple"
              variant="outlined"
              style={{
                color: "#660099",
                fontSize: "14px",
              }}
              htmlType="submit"
            >
              Salvar
            </Button>
          </div>
        </Form>
      </ConfigProvider>
    </div>
  );
}
