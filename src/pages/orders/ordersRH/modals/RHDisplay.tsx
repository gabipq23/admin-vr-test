import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { formatCEP } from "@/utils/formatCEP";
import { formatCPF } from "@/utils/formatCPF";
import {
  formatBrowserDisplay,
  type FingerprintNameVersion,
  formatOSDisplay,
} from "@/utils/formatClientEnvironment";
import DisplayGenerator from "@/components/displayGenerator";
import { Button, ConfigProvider, Form, Input } from "antd";
import { useEffect } from "react";
// import { ExclamationOutlined } from "@ant-design/icons";
import { EmpresasDisplay } from "@/components/empresasDisplay";
import { convertData } from "@/utils/convertData";
import { formatCompanySizeRange, formatContactObjective } from "@/utils/vrOrderFieldFormatters";

// interface OrderBandaLargaPFDisplayProps {
// selectedOrder: RHDisplayData;
// updateOrderData: (payload: {
//   id: number | undefined;
//   data: { pedido: { obs: string } };
// }) => void;
// }



export function OrdersRHDisplayModal({ selectedOrder }: any
  // {
  //  selectedOrder,
  // updateOrderData,
  // }: OrderBandaLargaPFDisplayProps) 
) {
  const [form] = Form.useForm();


  const addressInfo = selectedOrder?.address_info;
  const geolocation = selectedOrder?.geolocation
  const fingerprint = selectedOrder?.fingerprint
  const vrOrder = selectedOrder?.vr_order as Record<string, unknown> | undefined;
  const mapsLink =
    (geolocation as { maps_link?: string; link_maps?: string } | undefined)
      ?.maps_link ||
    (geolocation as { maps_link?: string; link_maps?: string } | undefined)
      ?.link_maps;
  const streetViewLink =
    (
      geolocation as
      | { street_view_link?: string; link_street_view?: string }
      | undefined
    )?.street_view_link ||
    (
      geolocation as
      | { street_view_link?: string; link_street_view?: string }
      | undefined
    )?.link_street_view;
  const mainPhonePortingDate =
    selectedOrder.phone_porting_date
  const additionalPhonePortingDate =
    selectedOrder.additional_phone_porting_date

  const formatYesNo = (value: unknown) => {
    if (value === true || value === 1 || value === "Sim") return "Sim";
    if (value === false || value === 0 || value === "Não" || value === "Nao") {
      return "Não";
    }
    return "-";
  };

  const formatDevice = (device: string) => {
    if (!device) return "-";
    return device === "mobile"
      ? "Mobile"
      : device === "desktop"
        ? "Desktop"
        : device === "tablet"
          ? "Tablet"
          : device.charAt(0).toUpperCase() + device.slice(1);
  };

  const formatResolution = (
    resolution?: { width?: number; height?: number } | string,
  ) => {
    if (
      resolution &&
      typeof resolution !== "string" &&
      resolution.width &&
      resolution.height
    ) {
      return `${resolution.width} x ${resolution.height}`;
    }
    return "-";
  };

  useEffect(() => {
    if (selectedOrder) {
      form.setFieldsValue({
        obs: selectedOrder.obs || "",
      });
    }
  }, [form]);

  // const getAlertScenarios = (
  //   availability?: boolean | number,
  //   encontrado_via_range?: number,
  //   cep_unico?: number,
  //   status?: string,
  // ) => {
  //   const scenarios: { color: string; content: React.ReactNode }[] = [];
  //   const noAvailability =
  //     availability === false || availability === null || availability === 0;
  //   const isCoveredByRange = encontrado_via_range === 1;
  //   const hasUnicCep = cep_unico === 1;

  //   if (status === "FECHADO") {
  //     if (noAvailability) {
  //       scenarios.push({
  //         color: "#ffeaea",
  //         content:
  //           "Não foi identificada disponibilidade no endereço fornecido.",
  //       });
  //     } else if (isCoveredByRange) {
  //       scenarios.push({
  //         color: "#fff6c7",
  //         content:
  //           "O número fornecido esta dentro de um range com disponibilidade.",
  //       });
  //     } else if (hasUnicCep) {
  //       scenarios.push({
  //         color: "#fff6c7",
  //         content: "CEP Único",
  //       });
  //     }
  //   }

  //   if (
  //     status === "FECHADO" &&
  //     !hasUnicCep &&
  //     !isCoveredByRange &&
  //     !noAvailability
  //   ) {
  //     scenarios.push({
  //       color: "#e6ffed",
  //       content: "Esse pedido não possui travas",
  //     });
  //   }
  //   return scenarios;
  // };

  // const handleSaveObservacao = async () => {
  //   const values = await form.validateFields();

  //   if (
  //     values.obs &&
  //     values.obs.trim() !== ""
  //   ) {
  //     updateOrderData({
  //       id: selectedOrder?.id,
  //       data: { pedido: { obs: values.obs } },
  //     });
  //   }
  // };
  return (
    <div className="flex flex-col w-full gap-2">
      {/* Detalhes dos Planos */}
      <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3 w-full">
        <div className="flex items-center">
          <h2 className="text-[14px] text-[#666666]">Detalhes </h2>
        </div>

        <div className="mt-4 text-neutral-700">
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedOrder.order_type === "RH" &&
                vrOrder?.["whats_rh_digital"] !== undefined && (
                  <>
                    <DisplayGenerator
                      title="RH Digital:"
                      value={formatYesNo(vrOrder?.["whats_rh_digital"])}
                    />
                    <DisplayGenerator
                      title="Funcionários no escritório:"
                      value={String(vrOrder?.["number_of_employees_office"] ?? "-")}
                    />
                    <DisplayGenerator
                      title="Funcionários em home office:"
                      value={String(vrOrder?.["number_of_employees_home"] ?? "-")}
                    />
                    <DisplayGenerator
                      title="Já possui solução de ponto:"
                      value={formatYesNo(vrOrder?.["already_has_point_solution"])}
                    />
                    <DisplayGenerator
                      title="Nome da solução:"
                      value={(vrOrder?.["point_solution_name"] as string) || "-"}
                    />
                    <DisplayGenerator
                      title="Nº de Colaboradores:"
                      value={formatCompanySizeRange(vrOrder?.["company_size_range"])}
                    />
                    <DisplayGenerator
                      title="Objetivo do contato:"
                      value={formatContactObjective(vrOrder?.["contact_objective"])}
                    />
                    <DisplayGenerator
                      title="Tipo:"
                      value={(vrOrder?.["landing_page"] as string) || "-"}
                    />
                  </>
                )}
            </div>
          </div>
        </div>
      </div>



      {/* Informações do Cliente */}
      <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3 w-full">
        <div className="flex items-center mb-3">
          <h2 className="text-[14px] text-[#666666] font-medium">
            Informações do Cliente
          </h2>
        </div>

        <div className="flex flex-col text-neutral-800 gap-4 rounded-lg">
          {/* Dados Pessoais */}
          <div className="bg-white rounded-md p-2">
            {selectedOrder.temperature === 10 ? (
              <div className="flex bg-[#d63535] rounded-full w-10 h-10 items-center justify-center relative mr-3">
                <img
                  src={
                    selectedOrder.whatsapp?.avatar || "/assets/anonymous_avatar.png"
                  }
                  className="rounded-full w-10 h-10"
                />
                <div className="text-sm absolute -top-1 -right-1 flex items-center justify-center">
                  🔥
                </div>
              </div>
            ) : (
              <img
                src={
                  selectedOrder.whatsapp?.avatar || "/assets/anonymous_avatar.png"
                }
                className="h-10 w-10 rounded-full mr-3"
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <DisplayGenerator title="Nome:" value={selectedOrder.full_name} />
              <DisplayGenerator
                title="Nome (RFB):"
                value={selectedOrder.rfb_name}
              />
              <DisplayGenerator
                title="Gênero:"
                value={
                  (selectedOrder.rfb_gender) === "M"
                    ? "Masculino"
                    : (selectedOrder.rfb_gender) === "F"
                      ? "Feminino"
                      : "-"
                }
              />
              <DisplayGenerator title="CPF:" value={formatCPF(selectedOrder.cpf || "")} />


              <DisplayGenerator
                title="Data Nascimento (RFB):"
                value={selectedOrder.rfb_birth_date ? convertData(selectedOrder.rfb_birth_date) : "-"}
              />

              <DisplayGenerator title="Email:" value={selectedOrder.email} />
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Telefone Principal */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500">
                  Telefone Principal
                </div>
                <div className="p-1 space-y-1">
                  <DisplayGenerator
                    title="Número:"
                    value={formatPhoneNumber(selectedOrder.phone || "")}
                  />
                  <DisplayGenerator
                    title="Anatel:"
                    value={formatYesNo(selectedOrder.phone_valid)}
                  />
                  <DisplayGenerator
                    title="Operadora:"
                    value={selectedOrder.operator}
                  />
                  <DisplayGenerator
                    title="Portado:"
                    value={
                      selectedOrder.phone_ported === "Sim" || selectedOrder.phone_ported === "Não"
                        ? selectedOrder.phone_ported
                        : formatYesNo(selectedOrder.phone_ported)
                    }
                  />
                  <DisplayGenerator
                    title="Data da Portabilidade:"
                    value={
                      mainPhonePortingDate
                        ? convertData(mainPhonePortingDate)
                        : "-"
                    }
                  />

                  {/* <DisplayGenerator
                    title="Status:"
                    value={selectedOrder.whatsapp?.recado}
                  /> */}
                  {/* <DisplayGenerator
                    title="Título WA:"
                    value={selectedOrder.nome_whatsapp}
                  /> */}
                </div>
              </div>

              {/* Telefone Adicional */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500">
                  Telefone Adicional
                </div>
                <div className="rounded p-1 space-y-1">
                  <DisplayGenerator
                    title="Número:"
                    value={formatPhoneNumber(selectedOrder.additional_phone || "")}
                  />
                  <DisplayGenerator
                    title="Anatel:"
                    value={formatYesNo(selectedOrder.additional_phone_valid)}
                  />
                  <DisplayGenerator
                    title="Operadora:"
                    value={selectedOrder.additional_operator}
                  />{" "}
                  <DisplayGenerator
                    title="Portado:"
                    value={formatYesNo(selectedOrder.additional_phone_ported)}
                  />
                  <DisplayGenerator
                    title="Data da Portabilidade:"
                    value={
                      additionalPhonePortingDate
                        ? convertData(additionalPhonePortingDate)
                        : "-"
                    }
                  />
                  {/* <DisplayGenerator
                    title="WhatsApp:"
                    value={
                      selectedOrder.whatsapp?.is_comercial === true
                        ? "Business"
                        : selectedOrder.whatsapp?.is_comercial === false
                          ? "Messenger"
                          : "-"
                    }
                  /> */}
                </div>
              </div>
            </div>
          </div>

          {/* Informações Empresariais */}
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <DisplayGenerator
                title="Sócio:"
                value={formatYesNo(selectedOrder.is_socio)}
              />{" "}
              <EmpresasDisplay empresas={selectedOrder.socios_empresas} />
              <div className="md:col-span-2">
                <DisplayGenerator
                  title="MEI:"
                  value={formatYesNo(selectedOrder.is_mei)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3 w-full">
        <div className="flex items-center mb-3">
          <h2 className="text-[14px] text-[#666666] font-medium">Endereço</h2>
        </div>

        <div className="flex flex-col text-neutral-800 gap-4 rounded-lg">
          {/* Dados do Endereço */}
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <DisplayGenerator title="Rua:" value={addressInfo?.address} />
              <DisplayGenerator
                title="Número:"
                value={addressInfo?.number}
              />
              <DisplayGenerator
                title="Complemento:"
                value={addressInfo?.complement}
              />
              <DisplayGenerator title="Bairro:" value={addressInfo?.district} />
              <DisplayGenerator title="Cidade:" value={addressInfo?.city} />
              <DisplayGenerator title="UF:" value={addressInfo?.state} />
            </div>
          </div>

          {/* Detalhes Técnicos */}
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="space-y-2">
                <DisplayGenerator
                  title="Tipo:"
                  value={
                    (addressInfo?.building_or_house) === "building"
                      ? "Edifício"
                      : "Casa"
                  }
                />
                <DisplayGenerator
                  title="Andar:"
                  value={addressInfo?.floor}
                />
              </div>
              <div className="space-y-2">
                <DisplayGenerator
                  title="CEP:"
                  value={formatCEP(addressInfo?.zip_code || "")}
                />
                <DisplayGenerator
                  title="CEP único:"
                  value={formatYesNo(addressInfo?.single_zip_code)}
                />
              </div>
              <div className="space-y-2">
                <DisplayGenerator title="Lote:" value={addressInfo?.lot} />
                <DisplayGenerator
                  title="Quadra:"
                  value={addressInfo?.block}
                />
              </div>
              <div className="md:col-span-3">
                <DisplayGenerator
                  title="Ponto de Referência:"
                  value={addressInfo?.reference_point}
                />
              </div>
            </div>
          </div>
          {/* Detalhes Técnicos */}
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">


              <a
                href={mapsLink}
                target="_blank"
                style={{ color: "#029d23", textDecoration: "underline" }}
                rel="noopener noreferrer"
              >
                Ver no Google Maps
              </a>

              <a
                href={streetViewLink}
                target="_blank"
                style={{ color: "#029d23", textDecoration: "underline" }}
                rel="noopener noreferrer"
                className="text-[#029d23]  underline"
              >
                Ver no Street View
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Dados do Tráfego */}
      <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3 w-full">
        <div className="flex items-center mb-3">
          <h2 className="text-[14px] text-[#666666] font-medium">
            Dados do Tráfego
          </h2>
        </div>

        <div className="flex flex-col text-neutral-800 gap-4 rounded-lg">
          {/* Informações de Rede */}
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <DisplayGenerator title="IP:" value={selectedOrder.client_ip} />
              <DisplayGenerator title="Provedor:" value={selectedOrder.ip_isp} />
              <DisplayGenerator
                title="Tipo de acesso:"
                value={
                  (selectedOrder.ip_access_type) === "movel"
                    ? "Móvel"
                    : (selectedOrder.ip_access_type) === "fixo"
                      ? "Fixo"
                      : (selectedOrder.ip_access_type) === "hosting"
                        ? "Hosting"
                        : (selectedOrder.ip_access_type) === "proxy"
                          ? "Proxy"
                          : (selectedOrder.ip_access_type) === "local"
                            ? "Local"
                            : (selectedOrder.ip_access_type) === "desconhecido"
                              ? "Desconhecido"
                              : "-"
                }
              />
              <DisplayGenerator
                title="URL:"
                value={selectedOrder.url}
                maxLength={50}
              />
            </div>
          </div>

          {/* Informações do Dispositivo */}
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <DisplayGenerator
                title="Plataforma:"
                value={formatOSDisplay(fingerprint?.os as FingerprintNameVersion)}
              />
              <DisplayGenerator
                title="Dispositivo:"
                value={formatDevice(fingerprint?.device || "-")}
              />
              <DisplayGenerator
                title="Browser:"
                value={formatBrowserDisplay(
                  fingerprint?.browser as FingerprintNameVersion,
                )}
              />
              <DisplayGenerator
                title="TimeZone:"
                value={fingerprint?.timezone || "-"}
              />
              <DisplayGenerator
                title="Resolução:"
                value={formatResolution(
                  fingerprint?.resolution || "-",
                )}
              />
              <DisplayGenerator
                title="ID Fingerprint:"
                value={selectedOrder.fingerprint_id || "-"}
              />
            </div>
          </div>
        </div>
      </div>
      {/* {selectedOrder?.status === "FECHADO" &&
        getAlertScenarios(
          selectedOrder?.availability,
          selectedOrder?.encontrado_via_range,
          selectedOrder?.cep_unico,
          selectedOrder?.status,
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
        ))} */}

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

              colorPrimaryHover: "#029d23",
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
                  name="obs"
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
              // onClick={handleSaveObservacao}
              >
                Salvar
              </Button>
            </div>
          </Form>
        </div>
      </ConfigProvider>
    </div>
  );
}
