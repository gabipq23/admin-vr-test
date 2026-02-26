import { Button, ConfigProvider, Modal } from "antd";
import { formatCNPJ } from "@/utils/formatCNPJ";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { formatCEP } from "@/utils/formatCEP";
import React from "react";
import { getTypeOfPayment } from "@/utils/getTypeOfPayment";

export function OrderDetailsModal({
  isModalOpen,
  closeModal,
  dataSource,
  selectedId,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  dataSource: any | undefined;
  selectedId: any | null;
}) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            // contentBg: "#f3f4f6",
            // headerBg: "#fffff",
          },
        },
      }}
    >
      <Modal
        centered
        title={
          <div className="flex  flex-col md:flex-row lg:flex-row gap-4 mg:items-start lg:items-start justify-between">
            <span className="" style={{ color: "#252525" }}>
              Pedido Nº {selectedId?.id}
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={1200}
      >
        <div className="flex items-center justify-center gap-2 h-auto md:h-[460px] overflow-y-auto scrollbar-thin">
          <div className="text-[#666666] min-w-[320px] max-w-[1120px] h-[460px] ">
            {dataSource
              ?.filter((item: any) => item?.id === selectedId?.id)
              .map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col min-w-[320px] max-w-[1120px] gap-2 p-1 "
                >
                  <div className="flex flex-col min-h-[617px] ">
                    {item.status !== "prospect" ? (
                      <>
                        <div className="flex flex-col bg-neutral-100 rounded-[4px] p-3  w-[1100px] mt-2 mb-4 text-neutral-700">
                          <p>
                            {item.possivel_prospect_nova_linha === 1 && (
                              <>
                                Esse cliente demonstrou interesse em adquirir
                                <strong> nova linha.</strong>{" "}
                              </>
                            )}
                            {item?.possivel_prospect_seguro === 1 && (
                              <>
                                Esse cliente demonstrou interesse em adquirir
                                <strong> seguro.</strong>
                              </>
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] mt-3 p-3  w-full ">
                          <div className=" ">
                            {" "}
                            <h2 className="text-[14px]">Detalhes</h2>
                          </div>
                          <div className="hidden md:block mt-4 text-neutral-700">
                            <div className="flex items-center font-semibold text-[#666666] text-[14px]">
                              <p className="w-36 text-center">Código</p>
                              <p className="w-36 text-center">Tipo</p>
                              <p className="w-24 text-center">Marca</p>
                              <p className="w-100 text-center">Modelo</p>
                              <p className="w-40 text-center flex items-center cursor-pointer gap-1 justify-center">
                                Cor
                              </p>
                              <p className="w-40 text-center">Quantidade</p>
                              <p className="w-38 text-center">Parcela (R$)</p>
                              <p className="w-36 text-center flex items-center cursor-pointer gap-1 justify-center">
                                Parcelamento
                              </p>
                              <p className="w-32 text-center  ">Seguro </p>
                            </div>
                            <hr className="border-t border-neutral-300 mx-2" />

                            {[...(item?.itens ?? [])]
                              .slice()
                              .reverse()
                              .map((product: any) => {
                                return (
                                  <React.Fragment key={product.id}>
                                    <React.Fragment key={product.id}>
                                      <div className="flex items-center py-4 text-[14px] text-neutral-700">
                                        <p className="text-[14px]  font-semibold w-36 text-center">
                                          {product.cod_sap}
                                        </p>
                                        <p className="text-[14px] w-36 text-center">
                                          {product.tipo}
                                        </p>
                                        <p className="text-[14px] font-semibold w-24 text-center">
                                          {product.marca}
                                        </p>
                                        <p className="text-[14px] font-semibold w-100 text-center">
                                          {product.modelo || "-"}
                                        </p>
                                        <p className="text-[14px] font-semibold w-40 text-center">
                                          {product?.cor_escolhida || "-"}
                                        </p>
                                        <p className="text-[14px] font-semibold w-40 text-center">
                                          {product?.quantidade}
                                        </p>
                                        <p className="text-[14px] text-neutral-700 font-semibold w-38 text-center">
                                          R${" "}
                                          {(
                                            Number(product?.valor_parcelado) /
                                            Number(item?.parcelamento || 1)
                                          ).toLocaleString("pt-BR", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          })}
                                        </p>
                                        <p className="text-[14px] text-neutral-700 font-semibold w-36 text-center">
                                          {item?.parcelamento === 1
                                            ? "à vista"
                                            : `${item?.parcelamento}x`}
                                        </p>
                                        <p className="w-32 text-center ">
                                          {product?.seguro_valor !== null ? (
                                            <span>
                                              R${" "}
                                              {product?.seguro_valor?.toLocaleString(
                                                "pt-BR",
                                                {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                }
                                              )}
                                              /mês
                                            </span>
                                          ) : (
                                            "-"
                                          )}
                                        </p>
                                      </div>
                                      <hr className="border-t border-neutral-300 mx-2" />
                                    </React.Fragment>

                                    <hr className="border-t border-neutral-300 mx-2" />
                                  </React.Fragment>
                                );
                              })}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-[1100px] mt-2 text-neutral-700 flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3   ">
                        <p>
                          Reserva de{" "}
                          <strong>{item?.quantidade_aparelhos || "-"}</strong>{" "}
                          aparelho(s) do modelo{" "}
                          <strong>{item?.modelo_reserva}</strong>
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col gap-3 text-[14px] py-3 flex-wrap  w-full  ">
                      {/* Informações do usuario */}
                      <div className="flex flex-col  gap-2 bg-neutral-100 mb-3 rounded-[4px] p-3  w-full">
                        <div className=" flex items-center">
                          <h2 className=" text-[14px] font-semibold">
                            {" "}
                            Informações do comprador
                          </h2>
                          {/* {item?.cliente_gold === 1 ? (
                            <span className="ml-2 text-[12px] font-medium bg-[#029d23] text-neutral-100 px-2 py-1 rounded-full">
                              Cliente Gold
                            </span>
                          ) : (
                            <span className="ml-2 text-[12px] font-medium bg-yellow-300 text-neutral-700 px-2 py-1 rounded-full">
                              Não é cliente Gold
                            </span>
                          )} */}
                        </div>

                        <div className="flex flex-col  text-neutral-800 gap-2 rounded-lg min-h-[120px] p-4">
                          <div className="text-[14px] w-full text-neutral-700">
                            <p>
                              <strong>Razão Social:</strong>{" "}
                              {item?.empresa?.nm_cliente || "-"}
                            </p>
                          </div>

                          {/* Mobile: CNPJ e Razão Social eem coluna */}
                          <div className="flex flex-col gap-2 text-[14px] w-full text-neutral-700">
                            <p>
                              <strong>CNPJ:</strong>{" "}
                              {formatCNPJ(item?.cnpj ?? "") || "-"}
                            </p>
                            <p>
                              <strong>Gestor da conta:</strong>{" "}
                              {item?.gestor_sfa || "-"}
                            </p>
                          </div>

                          {/* Mobile: Telefone e Email em coluna */}
                          <div className="flex flex-col gap-2  text-[14px] w-full text-neutral-700">
                            <p>
                              <strong>Telefone :</strong>{" "}
                              {formatPhoneNumber(item?.telefone ?? "") || "-"}
                            </p>
                            <p>
                              <strong>Email :</strong> {item?.email || "-"}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 text-[14px] w-full text-neutral-700">
                            {item?.telefone_alterado !== null && (
                              <p>
                                <strong>Novo Telefone:</strong>{" "}
                                {formatPhoneNumber(
                                  item?.telefone_alterado ?? ""
                                ) || "-"}
                              </p>
                            )}
                            {item?.email_alterado !== null && (
                              <p>
                                <strong>Novo Email:</strong>{" "}
                                {item?.email_alterado || "-"}
                              </p>
                            )}
                          </div>
                          {/* Mobile: Telefone e Email em coluna */}
                          <div className="flex flex-col gap-2 text-[14px] w-full text-neutral-700">
                            <p>
                              <strong>Nome (Comprador) :</strong>{" "}
                              {item?.nome || "-"}
                            </p>
                            <p>
                              <strong>Telefone (Comprador) :</strong>{" "}
                              {formatPhoneNumber(
                                item?.telefone_comprador ?? ""
                              ) || "-"}
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
                            <p>
                              <strong>Endereço:</strong>{" "}
                              {item?.endereco_sfa || "-"}
                            </p>
                          </div>

                          {/* Mobile: CNPJ e Razão Social em coluna */}
                          <div className="flex flex-col gap-2  text-[14px] w-full text-neutral-700">
                            <p>
                              <strong>Número:</strong>{" "}
                              {item?.numero_fachada || "-"}
                            </p>
                            <p>
                              <strong>Bairro:</strong> {item?.bairro || "-"}
                            </p>
                            <p>
                              <strong>Cidade:</strong> {item?.cidade || "-"}
                            </p>
                          </div>

                          {/* Mobile: Telefone e Email em coluna */}
                          <div className="flex flex-col gap-2  text-[14px] w-full text-neutral-700">
                            <p>
                              <strong>UF:</strong> {item?.uf || "-"}
                            </p>
                            <p>
                              <strong>CEP:</strong>{" "}
                              {formatCEP(item?.cep ?? "") || "-"}
                            </p>
                          </div>

                          {/* Mobile: Telefone e Email em coluna */}
                          <div className="flex flex-col gap-2  text-[14px] w-full text-neutral-700">
                            <p>
                              <strong>Complemento:</strong>{" "}
                              {item?.complemento || "-"}
                            </p>
                            <p>
                              <strong>Observação:</strong>{" "}
                              {item?.observacao_endereco || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {item?.status !== "prospect" && (
                      <>
                        <div className="flex flex-col justify-center  bg-neutral-100 min-h-[400px] max-h-[800px] text-[14px] rounded-[4px] mb-[29px] ">
                          <div className="flex m-3 flex-col gap-4 ">
                            <div className="px-2">
                              {" "}
                              <p className="text-[15px]"> Resumo do pedido</p>
                            </div>
                            <hr className="border-t border-neutral-300 mb-2  w-full" />

                            <div className="px-2">
                              <p className="text-[15px] ">Serviços</p>
                            </div>
                            {item?.itens
                              .filter(
                                (item: any) =>
                                  item.seguro_tipo !== null
                              )
                              .map((item: any, idx: number, arr) => (
                                <div key={idx} className="w-full">
                                  <div className="flex w-full justify-between px-2">
                                    <p className="text-[14px] text-[#666666]">
                                      Seguro de{" "}
                                      {item.seguro_tipo ===
                                        "roubo_furto_simples_qualificado"
                                        ? "Roubo, Furto Simples/Qualificado"
                                        : "Roubo, Furto Simples/Qualificado e Danos"}
                                    </p>
                                    <p>
                                      R${" "}
                                      {Number(
                                        item.seguro_valor ?? 0
                                      ).toLocaleString("pt-BR", {
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
                              <p className="text-[14px] text-[#666666]">
                                Quantidade de itens
                              </p>
                              <p>
                                {item?.itens.reduce(
                                  (total: number, item: any) =>
                                    total + Number(item.quantidade),
                                  0
                                )}
                              </p>
                            </div>

                            <hr className="border-t border-neutral-300 mb-2 w-full" />

                            <div className="flex w-full justify-between px-2">
                              <p className="text-[14px] text-[#666666]">
                                Frete
                              </p>
                              <p className="text-[14px] text-[#32a04b]">
                                Grátis
                              </p>
                            </div>

                            <hr className="border-t border-neutral-300 mb-2  w-full" />

                            <div className="flex w-full justify-between px-2">
                              <p className="text-[14px] text-[#666666]">
                                Forma de Pagamento
                              </p>
                              <p className="text-[14px]">
                                {getTypeOfPayment(item?.forma_pagamento)}
                              </p>
                            </div>

                            <hr className="border-t border-neutral-300 mb-2  w-full" />

                            <div className="flex w-full justify-between px-2">
                              <p className="text-[14px] text-[#666666]">
                                Parcelamento
                              </p>
                              <p className="text-[14px]">
                                {" "}
                                {item?.parcelamento === 1
                                  ? "à vista"
                                  : `${item?.parcelamento}x`}
                              </p>
                            </div>

                            <hr className="border-t border-neutral-400 mb-2  w-full" />
                          </div>
                          <div className="flex flex-col items-start m-3 gap-2 ">
                            <div className="flex w-full justify-between mb-4 px-2 text-[14px] font-bold">
                              <p className="text-[#666666]">
                                Valor da parcela mensal (Produtos)
                              </p>
                              <p>
                                R${" "}
                                {item?.valor_parcela_total.toLocaleString(
                                  "pt-BR",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </p>
                            </div>

                            <div className="flex w-full justify-between mb-4 px-2 text-[14px] font-bold">
                              <p className="text-[#666666]">
                                Valor da parcela mensal (Serviços)
                              </p>
                              <p>
                                R${" "}
                                {item?.itens
                                  .filter(
                                    (item: any) => item.seguro_valor
                                  )
                                  .reduce(
                                    (total: number, item: any) =>
                                      total + Number(item.seguro_valor ?? 0),
                                    0
                                  )
                                  .toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                              </p>
                            </div>
                            <div className="flex w-full justify-between mb-8 text-[14px] px-2 font-bold">
                              <p className="text-[#666666]">
                                Valor total do pedido
                              </p>
                              <p>
                                R$
                                {Number(item?.total).toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="mt-4 flex gap-4 justify-end mr-4">
          <Button
            onClick={closeModal}
            color="green"
            variant="outlined"
            style={{
              color: "#029d23",
              fontSize: "14px",
            }}
          >
            Fechar
          </Button>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
