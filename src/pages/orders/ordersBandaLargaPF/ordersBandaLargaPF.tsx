import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ConfigProvider, Table } from "antd";
import { customLocale } from "@/utils/customLocale";
import { useAllOrdersController } from "./controllers/dataController";
import { useAllOrdersFilterController } from "./controllers/filterController";
import { useNavigate } from "react-router-dom";
import { OrderBandaLargaPFDetailsModal } from "./modals/orderBandaLargaPFDetails";
import { FiltroOrdersBandaLargaPFForm } from "./components/filter";
import { OrderBandaLargaPF } from "@/interfaces/bandaLargaPF";
import { TableProps } from "antd/lib";
import { useState } from "react";

export default function OrdersBandaLargaPF() {
  const queryClient = new QueryClient();
  const {
    ordersBandaLarga,

    showModal,
    closeModal,
    isModalOpen,
    isLoading,
    orderBandaLargaPF,
    updateBandaLargaOrder,
    removeBandaLargaOrder,
    isRemoveBandaLargaOrderFetching,
    updateDataIdVivoAndConsultorResponsavel,
    changeBandaLargaOrderStatus,
  } = useAllOrdersController();
  const navigate = useNavigate();
  const {
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedBLOrder,
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

  const rowClassName = (record: OrderBandaLargaPF) => {
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

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="px-6 md:px-10 lg:px-14">
          <div className="flex justify-between mt-6 mb-4 items-center">
            <div>
              <div className="flex gap-8 justify-between pb-2">
                <h1 className="text-[22px] pl-16 ">Pedidos Banda Larga PF</h1>
              </div>
              {/* Filtro */}
              <FiltroOrdersBandaLargaPFForm
                control={control}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                selectedRowKeys={selectedRowKeys}
                onClear={clearFilters}
                statusOptions={ordersBandaLarga?.status_pos_venda_enum}
                orderBandaLargaPF={orderBandaLargaPF}

                allColumnOptions={allColumnOptions}
                visibleColumns={visibleColumns}
                handleColumnsChange={handleColumnsChange}
                tableColumns={columns}
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
                loading={isLoading}
                scroll={{ y: 800 }}
                rowSelection={rowSelection}
                className={styles.customTable}
                dataSource={orderBandaLargaPF}
                rowClassName={(record) => rowClassName(record) ?? ""}
                columns={columns}
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedBLOrder(record);
                    showModal();
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
          <OrderBandaLargaPFDetailsModal
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
          />
        </div>
      </QueryClientProvider>
    </>
  );
}
