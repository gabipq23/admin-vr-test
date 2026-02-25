import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ConfigProvider, Table } from "antd";
import { customLocale } from "@/utils/customLocale";
import { useAllOrdersFilterController } from "./controllers/filterController";
import { useNavigate } from "react-router-dom";
import { TableProps } from "antd/lib";
import { useState } from "react";
import { FiltroOrdersRHForm } from "./components/filter";
import { VROrder } from "@/interfaces/VROrder";

export default function OrdersRH() {
  const queryClient = new QueryClient();

  const navigate = useNavigate();
  const {
    control,
    // onSubmit,
    // handleSubmit,
    // clearFilters,
    // selectedBLOrder,
    setSelectedBLOrder,
    currentPage,
    pageSize,
    columns,
    styles,
    allColumnOptions,
    visibleColumns,
    handleColumnsChange,
  } = useAllOrdersFilterController();

  const totalItems = 0;

  const rowClassName = (record: any) => {
    const hasAvaiability = record?.availability;
    const isCoveredByRange = record?.encontrado_via_range;
    const hasUnicCep = record?.cep_unico;
    if (record?.status === "fechado") {
      if (
        hasAvaiability === false ||
        hasAvaiability === null ||
        hasAvaiability === 0
      ) {
        return "ant-table-row-red";
      } else if (isCoveredByRange === 1 || hasUnicCep === 1) {
        return "ant-table-row-yellow";
      }

      return "ant-table-row-green";
    }
    return "";
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection: TableProps<any>["rowSelection"] = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const RHOrder: VROrder[] = [{
    additional_operator: "Claro S.A.",
    additional_phone: "48999887766",
    additional_phone_ported: false,
    additional_phone_porting_date: null,
    additional_phone_valid: true,
    address_info: {
      address: "Rua das Flores",
      block: "B",
      building_or_house: "building",
      city: "São Paulo",
      complement: "Sala 402",
      district: "Centro",
      floor: "4",
      lot: null,
      number: "1200",
      reference_point: "Próximo ao metrô",
      single_zip_code: 0,
      state: "SP",
      zip_code: "01001000",
      zip_code_type: "logradouro",
    },
    after_sales_status: "Em andamento",
    capital_social: "50000.00",
    client_ip: "189.45.22.180",
    cnpj: "11222333000181",
    company_name: "Empresa Exemplo LTDA",
    company_size: "Médio",
    cpf: "14720194907",
    created_at: "16/03/2026 17:30:00",
    email: "contato@empresaexemplo.com.br",
    fingerprint: {
      browser: {
        name: "Chrome",
        version: "122.0.0.0",
      },
      device: "desktop",
      os: {
        name: "Windows",
        version: "11",
      },
      resolution: {
        dpr: 1,
        height: 1080,
        width: 1920,
      },
      timezone: "America/Sao_Paulo",
      timezone_name: "BRT",
      timezone_offset: 180,
    },
    fingerprint_id: "fp-abc-123",
    full_name: "Carlos Eduardo da Silva",
    geolocation: {
      formatted_address: "Rua das Flores, 1200 - Centro, São Paulo - SP",
      latitude: "-23.55052",
      longitude: "-46.633308",
      maps_link: "https://maps.google.com/?q=-23.55052,-46.633308",
      precision: "ROOFTOP",
      queried_at: "2026-02-25T20:38:16.282Z",
      street_view_link:
        "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=-23.55052,-46.633308",
      success: true,
    },
    id: 5,
    id_order: null,
    ip_access_type: "fixo",
    ip_as: "AS12345",
    ip_isp: "Vivo Fibra",
    ip_org: "Telefonica Brasil S.A.",
    is_email_valid: true,
    is_mei: false,
    is_socio: true,
    obs: "Lead validado e com documentação completa",
    operator: "TIM S/A",
    order_number: 96248817,
    order_type: "RH",
    phone: "48999202542",
    phone_ported: "Não",
    phone_porting_date: null,
    phone_valid: true,
    responsible_name: "Ana Paula",
    rfb_birth_date: "2004-03-16T00:00:00.000Z",
    rfb_gender: "M",
    rfb_name: "CARLOS EDUARDO DA SILVA",
    rfb_status: "Ativa",
    socios_empresas: [
      {
        cpf: "12345678901",
        is_admin: "1",
        name: "João Pedro Souza",
      },
      {
        cpf: "98765432100",
        is_admin: "0",
        name: "Mariana Costa Lima",
      },
    ],
    status: "aberto",
    temperature: 7,
    updated_at: "2026-02-25T21:10:10.000Z",
    url: "https://portal.exemplo.com/pedido/96248817",
    vr_order: {
      already_has_point_solution: true,
      number_of_employees_home: 10,
      number_of_employees_office: 25,
      point_solution_name: "PontoTel",
      whats_rh_digital: true,
    },
    whatsapp: {
      address: null,
      avatar: "",
      category: "Serviços empresariais",
      exists_on_whatsapp: true,
      is_commercial: true,
      links: ["https://wa.me/5548999202542"],
      number: "5548999202542",
      status_message: "Atendimento comercial",
      success: true,
      verified_at: "2026-02-25T20:40:00.000Z",
    },
  }];

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="px-6 md:px-10 lg:px-14">
          <div className="flex justify-between mt-6 mb-4 items-center">
            <div>
              <div className="flex gap-8 justify-between pb-2">
                <h1 className="text-[22px] pl-16 ">Pedidos RH</h1>
              </div>
              {/* Filtro */}
              <FiltroOrdersRHForm
                control={control}
                // handleSubmit={handleSubmit}
                // onSubmit={onSubmit}
                // selectedRowKeys={selectedRowKeys}
                // onClear={clearFilters}
                // statusOptions={ordersBandaLarga?.status_pos_venda_enum}
                // orderBandaLargaPF={orderBandaLargaPF}

                allColumnOptions={allColumnOptions}
                visibleColumns={visibleColumns}
                handleColumnsChange={handleColumnsChange}
              // tableColumns={columns}
              />
            </div>
          </div>
          <ConfigProvider
            locale={customLocale}
            theme={{
              token: {
                colorPrimary: "#029d23",
                colorPrimaryHover: "#833baa",
                colorLink: "#029d23",
                colorPrimaryBg: "transparent",
              },
              components: {
                Checkbox: {
                  colorPrimary: "#029d23",
                  colorPrimaryHover: "#029d23",
                  borderRadius: 4,
                  controlInteractiveSize: 18,
                  lineWidth: 2,
                },
              },
            }}
          >
            {/* Tabela */}
            <div className="overflow-y-auto ">
              <Table<any>
                rowKey="id"
                // loading={isLoading}
                scroll={{ y: 800 }}
                rowSelection={rowSelection}
                className={styles.customTable}
                dataSource={RHOrder}
                rowClassName={(record) => rowClassName(record) ?? ""}
                columns={columns}
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedBLOrder(record);
                    // showModal();
                  },
                  style: { cursor: "pointer" },
                })}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalItems,
                  showSizeChanger: true,
                  pageSizeOptions: ["50", "100", "200", "500"],
                  showLessItems: true,
                  onChange: (page, pageSize) => {
                    const params = new URLSearchParams(window.location.search);
                    params.set("page", page.toString());
                    params.set("limit", pageSize.toString());
                    navigate(`?${params.toString()}`);
                  },
                  showTotal: (total) => `Total de ${total} pedidos`,
                }}
              />
            </div>
          </ConfigProvider>

          {/* Modal */}
          {/* <OrdersRHDetailsModal
            statusOptions={ordersBandaLarga?.status_pos_venda_enum}

            updateOrderData={updateBandaLargaOrder}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            selectedId={selectedBLOrder}
            removeOrderData={removeBandaLargaOrder}
            isRemoveOrderFetching={isRemoveBandaLargaOrderFetching}
            updateDataIdVivoAndConsultorResponsavel={
              updateDataIdVivoAndConsultorResponsavel
            }
            changeBandaLargaOrderStatus={changeBandaLargaOrderStatus}
          /> */}
        </div>
      </QueryClientProvider>
    </>
  );
}
