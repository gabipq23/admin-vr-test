import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { formatCEP } from "@/utils/formatCEP";
import { formatCPF } from "@/utils/formatCPF";
import { OrderBandaLargaPF } from "@/interfaces/bandaLargaPF";
import { formatBRL } from "@/utils/formatBRL";
import {
  formatBrowserDisplay,
  formatOSDisplay,
} from "@/utils/formatClientEnvironment";
import DisplayGenerator from "@/components/displayGenerator";
import { Button, ConfigProvider, Form, Input, Tooltip } from "antd";
import { useEffect } from "react";
import { ExclamationOutlined } from "@ant-design/icons";
import { EmpresasDisplay } from "@/components/empresasDisplay";
import { convertData } from "@/utils/convertData";

interface OrderBandaLargaPFDisplayProps {
  localData: OrderBandaLargaPF;
  updateOrderData: any;
}

export function OrderBandaLargaPFDisplay({
  localData,
  updateOrderData,
}: OrderBandaLargaPFDisplayProps) {
  const [form] = Form.useForm();

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

  const formatResolution = (resolution: any) => {
    if (resolution && resolution.width && resolution.height) {
      return `${resolution.width} x ${resolution.height}`;
    }
    return "-";
  };

  const AvailabilityStatus = () => {
    if (
      localData.availability === null ||
      localData.availability === undefined
    ) {
      return (
        <div className="flex flex-col items-center mt-2">
          <div className="flex items-center justify-center">-</div>
        </div>
      );
    }

    if (localData.availability) {
      if (localData.encontrado_via_range === 1) {
        return (
          <div className="flex flex-col items-center mt-2">
            <div className="flex items-center justify-center mb-2">
              <Tooltip
                title="Disponibilidade - Disponível (via range numérico)"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <div className="h-2 w-2 bg-yellow-500 rounded-full cursor-pointer"></div>
              </Tooltip>
            </div>
            <div className="text-center text-[11px] text-neutral-600 bg-yellow-50 px-2 py-1 rounded">
              <strong>Range numérico:</strong> {localData.range_min} -{" "}
              {localData.range_max}
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-center mt-2">
            <div className="flex items-center justify-center">
              <Tooltip
                title="Disponibilidade - Disponível"
                placement="top"
                styles={{ body: { fontSize: "12px" } }}
              >
                <div className="h-2 w-2 bg-green-500 rounded-full cursor-pointer"></div>
              </Tooltip>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="flex flex-col items-center mt-2">
        <div className="flex items-center justify-center">
          <Tooltip
            title="Disponibilidade - Indisponível"
            placement="top"
            styles={{ body: { fontSize: "12px" } }}
          >
            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
          </Tooltip>
        </div>
      </div>
    );
  };

  const PAPStatus = () => {
    if (
      localData.availability_pap === null ||
      localData.availability_pap === undefined
    ) {
      return (
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center">-</div>
        </div>
      );
    }

    if (localData.availability_pap) {
      return (
        <div className="flex flex-col items-center mt-2">
          <div className="flex items-center justify-center">
            <Tooltip
              title="PAP - Disponível"
              placement="top"
              styles={{ body: { fontSize: "12px" } }}
            >
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </Tooltip>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center mt-2">
        <div className="flex items-center justify-center">
          <Tooltip
            title="PAP - Indisponível"
            placement="top"
            styles={{ body: { fontSize: "12px" } }}
          >
            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
          </Tooltip>
        </div>
      </div>
    );
  };
  useEffect(() => {
    if (localData) {
      form.setFieldsValue({
        observacao_consultor: localData.observacao_consultor || "",
      });
    }
  }, [localData, form]);

  const getAlertScenarios = (
    availability?: boolean | number,
    encontrado_via_range?: number,
    cep_unico?: number,
    status?: string,
  ) => {
    const scenarios: { color: string; content: React.ReactNode }[] = [];
    const noAvailability =
      availability === false || availability === null || availability === 0;
    const isCoveredByRange = encontrado_via_range === 1;
    const hasUnicCep = cep_unico === 1;

    if (status === "fechado") {
      if (noAvailability) {
        scenarios.push({
          color: "#ffeaea",
          content:
            "Não foi identificada disponibilidade no endereço fornecido.",
        });
      } else if (isCoveredByRange) {
        scenarios.push({
          color: "#fff6c7",
          content:
            "O número fornecido esta dentro de um range com disponibilidade.",
        });
      } else if (hasUnicCep) {
        scenarios.push({
          color: "#fff6c7",
          content: "CEP Único",
        });
      }
    }

    if (
      status === "fechado" &&
      !hasUnicCep &&
      !isCoveredByRange &&
      !noAvailability
    ) {
      scenarios.push({
        color: "#e6ffed",
        content: "Esse pedido não possui travas",
      });
    }
    return scenarios;
  };

  const handleSaveObservacao = async () => {
    const values = await form.validateFields();

    if (
      values.observacao_consultor &&
      values.observacao_consultor.trim() !== ""
    ) {
      updateOrderData({
        id: localData?.id,
        data: { pedido: { observacao_consultor: values.observacao_consultor } },
      });
    }
  };
  return (
    <div className="flex flex-col w-full gap-2">
      {/* Detalhes dos Planos */}
      <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3 w-full">
        <div className="flex items-center">
          <h2 className="text-[14px] text-[#666666]">Detalhes </h2>
        </div>

        <div className="mt-4 text-neutral-700">
          {/* Header da tabela */}
          <div className="flex items-center font-semibold text-[#666666] text-[14px]">
            <p className="w-48 text-center">Plano</p>
            <p className="w-32 text-center">Valor (R$)</p>
            <p className="w-40 text-center">Data Instalação 1</p>
            <p className="w-32 text-center">Período 1</p>
            <p className="w-40 text-center">Data Instalação 2</p>
            <p className="w-32 text-center">Período 2</p>
            <p className="w-32 text-center">Vencimento</p>
          </div>
          <hr className="border-t border-neutral-300 mx-2" />
          <div>
            <div className="flex items-center py-4 text-[14px] text-neutral-700">
              <p className="text-[14px] font-semibold w-48 text-center">
                {localData.plan?.name + " - " + localData.plan?.speed || "-"}
              </p>
              <p className="text-[14px] font-semibold w-32 text-center">
                {localData.plan?.price
                  ? ` ${formatBRL(localData.plan.price)}`
                  : "-"}
              </p>
              <p className="text-[14px] w-40 text-center">
                {localData.installation_preferred_date_one || "-"}
              </p>
              <p className="text-[14px] w-32 text-center">
                {localData.installation_preferred_period_one || "-"}
              </p>
              <p className="text-[14px] w-40 text-center">
                {localData.installation_preferred_date_two || "-"}
              </p>
              <p className="text-[14px] w-32 text-center">
                {localData.installation_preferred_period_two || "-"}
              </p>
              <p className="text-[14px] font-semibold w-32 text-center">
                {localData.dueday?.toString() || "-"}
              </p>
            </div>
            <hr className="border-t border-neutral-300 mx-2" />
          </div>
        </div>
      </div>

      {/* Seção de Disponibilidade */}
      <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3 w-full">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-md p-4 flex flex-col items-center">
            <p className="text-[14px] font-medium text-neutral-700 ">
              Disponibilidade
            </p>
            <AvailabilityStatus />
          </div>
          <div className="bg-white rounded-md p-4 flex flex-col items-center">
            <p className="text-[14px] font-medium text-neutral-700 mb-2">PAP</p>
            <PAPStatus />
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
            {localData.temperatura_pf === 10 ? (
              <div className="flex bg-[#d63535] rounded-full w-10 h-10 items-center justify-center relative mr-3">
                <img
                  src={
                    localData.whatsapp?.avatar || "/assets/anonymous_avatar.png"
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
                  localData.whatsapp?.avatar || "/assets/anonymous_avatar.png"
                }
                className="h-10 w-10 rounded-full mr-3"
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <DisplayGenerator title="Nome:" value={localData.fullname} />
              <DisplayGenerator
                title="Nome (RFB):"
                value={localData.nome_receita}
              />
              <DisplayGenerator
                title="Gênero:"
                value={
                  localData.genero_receita === "M"
                    ? "Masculino"
                    : localData.genero_receita === "F"
                      ? "Feminino"
                      : "-"
                }
              />
              <DisplayGenerator title="CPF:" value={formatCPF(localData.cpf)} />

              <DisplayGenerator
                title="Data de Nascimento:"
                value={localData.birthdate}
              />
              <DisplayGenerator
                title="Data Nascimento (RFB):"
                value={localData.data_de_nascimento_receita}
              />
              <DisplayGenerator
                title="Nome da Mãe:"
                value={localData.motherfullname}
              />
              <DisplayGenerator
                title="Nome Mãe (RFB):"
                value={localData.nome_da_mae_receita}
              />
              <DisplayGenerator title="Email:" value={localData.email} />
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
                    value={formatPhoneNumber(localData.phone)}
                  />
                  <DisplayGenerator
                    title="Anatel:"
                    value={
                      localData.numero_valido
                        ? "Sim"
                        : localData.numero_valido === null ||
                          localData.numero_valido === undefined
                          ? "-"
                          : "Não"
                    }
                  />
                  <DisplayGenerator
                    title="Operadora:"
                    value={localData.operadora}
                  />
                  <DisplayGenerator
                    title="Portado:"
                    value={localData.portabilidade}
                  />
                  <DisplayGenerator
                    title="Data da Portabilidade:"
                    value={
                      localData.data_portabilidade
                        ? convertData(localData.data_portabilidade)
                        : "-"
                    }
                  />

                  {/* <DisplayGenerator
                    title="Status:"
                    value={localData.whatsapp?.recado}
                  /> */}
                  {/* <DisplayGenerator
                    title="Título WA:"
                    value={localData.nome_whatsapp}
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
                    value={formatPhoneNumber(localData.phoneAdditional || "")}
                  />
                  <DisplayGenerator
                    title="Anatel:"
                    value={
                      localData.numero_adicional_valido
                        ? "Sim"
                        : localData.numero_adicional_valido === null
                          ? "-"
                          : "Não"
                    }
                  />
                  <DisplayGenerator
                    title="Operadora:"
                    value={localData.operadora_adicional}
                  />{" "}
                  <DisplayGenerator
                    title="Portado:"
                    value={localData.portabilidade_adicional}
                  />
                  <DisplayGenerator
                    title="Data da Portabilidade:"
                    value={
                      localData.data_portabilidade_adicional
                        ? convertData(localData.data_portabilidade_adicional)
                        : "-"
                    }
                  />
                  {/* <DisplayGenerator
                    title="WhatsApp:"
                    value={
                      localData.whatsapp?.is_comercial === true
                        ? "Business"
                        : localData.whatsapp?.is_comercial === false
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
                value={localData.socio ? "Sim" : "Não"}
              />{" "}
              <EmpresasDisplay empresas={localData.socios_empresas} />
              <div className="md:col-span-2">
                <DisplayGenerator
                  title="MEI:"
                  value={localData.is_mei ? "Sim" : "Não"}
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
              <DisplayGenerator title="Rua:" value={localData.address} />
              <DisplayGenerator
                title="Número:"
                value={localData.addressnumber}
              />
              <DisplayGenerator
                title="Complemento:"
                value={localData.addresscomplement}
              />
              <DisplayGenerator title="Bairro:" value={localData.district} />
              <DisplayGenerator title="Cidade:" value={localData.city} />
              <DisplayGenerator title="UF:" value={localData.state} />
            </div>
          </div>

          {/* Detalhes Técnicos */}
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="space-y-2">
                <DisplayGenerator
                  title="Tipo:"
                  value={
                    localData.buildingorhouse === "building"
                      ? "Edifício"
                      : "Casa"
                  }
                />
                <DisplayGenerator
                  title="Andar:"
                  value={localData.addressFloor}
                />
              </div>
              <div className="space-y-2">
                <DisplayGenerator
                  title="CEP:"
                  value={formatCEP(localData.cep)}
                />
                <DisplayGenerator
                  title="CEP único:"
                  value={localData.cep_unico ? "Sim" : "Não"}
                />
              </div>
              <div className="space-y-2">
                <DisplayGenerator title="Lote:" value={localData.addresslot} />
                <DisplayGenerator
                  title="Quadra:"
                  value={localData.addressblock}
                />
              </div>
              <div className="md:col-span-3">
                <DisplayGenerator
                  title="Ponto de Referência:"
                  value={localData.addressreferencepoint}
                />
              </div>
            </div>
          </div>
          {/* Detalhes Técnicos */}
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
              <DisplayGenerator
                title="Coordenadas:"
                value={
                  localData.geolocalizacao?.latitude &&
                    localData.geolocalizacao?.longitude
                    ? `${localData.geolocalizacao.latitude}, ${localData.geolocalizacao.longitude}`
                    : "-"
                }
              />

              <a
                href={localData.geolocalizacao?.link_maps}
                target="_blank"
                style={{ color: "#029d23", textDecoration: "underline" }}
                rel="noopener noreferrer"
              >
                Ver no Google Maps
              </a>

              <a
                href={localData.geolocalizacao?.link_street_view}
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
              <DisplayGenerator title="IP:" value={localData.client_ip} />
              <DisplayGenerator title="Provedor:" value={localData.ip_isp} />
              <DisplayGenerator
                title="Tipo de acesso:"
                value={
                  localData.ip_tipo_acesso === "movel"
                    ? "Móvel"
                    : localData.ip_tipo_acesso === "fixo"
                      ? "Fixo"
                      : localData.ip_tipo_acesso === "hosting"
                        ? "Hosting"
                        : localData.ip_tipo_acesso === "proxy"
                          ? "Proxy"
                          : localData.ip_tipo_acesso === "local"
                            ? "Local"
                            : localData.ip_tipo_acesso === "desconhecido"
                              ? "Desconhecido"
                              : "-"
                }
              />
              <DisplayGenerator
                title="URL:"
                value={localData.url}
                maxLength={50}
              />
            </div>
          </div>

          {/* Informações do Dispositivo */}
          <div className="bg-white rounded-md p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <DisplayGenerator
                title="Plataforma:"
                value={formatOSDisplay(localData.finger_print?.os)}
              />
              <DisplayGenerator
                title="Dispositivo:"
                value={formatDevice(localData.finger_print?.device || "-")}
              />
              <DisplayGenerator
                title="Browser:"
                value={formatBrowserDisplay(localData.finger_print?.browser)}
              />
              <DisplayGenerator
                title="TimeZone:"
                value={localData.finger_print?.timezone || "-"}
              />
              <DisplayGenerator
                title="Resolução:"
                value={formatResolution(
                  localData.finger_print?.resolution || "-",
                )}
              />
              <DisplayGenerator
                title="ID Fingerprint:"
                value={localData.fingerprintId || "-"}
              />
            </div>
          </div>
        </div>
      </div>
      {localData?.status === "fechado" &&
        getAlertScenarios(
          localData?.availability,
          localData?.encontrado_via_range,
          localData?.cep_unico,
          localData?.status,
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
                  name="observacao_consultor"
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
}
