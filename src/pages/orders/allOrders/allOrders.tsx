import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAllOrdersController } from "./controllers/dataController";
import { ConfigProvider, Table } from "antd";
import { DataType } from "src/interfaces/orderModal";
import { OrderDetailsModal } from "./modals/orderDetails";
import MobileCard from "./components/mobileCard";
import { FiltroPedidosForm } from "./components/filter";
import { useAllOrdersFilterController } from "./controllers/filterController";
import { useNavigate } from "react-router-dom";
import { IPurchaseItens } from "@/interfaces/purchase";
import type { TableProps } from "antd";
import React, { useState } from "react";
import { customLocale } from "@/utils/customLocale";

function AllOrders() {
  const navigate = useNavigate();
  const queryClient = new QueryClient();

  const {
    productsFilteredQuery,
    isModalOpen,
    showModal,
    closeModal,
    handleAddItemInChart,
    removeItem,
    changeStatus,
    updateData,
    updateDataIdVivoAndConsultorResponsavel,
    devices,
    isDataLoading,
    dataSource,
    isAllProductsFilteredLoading,
    saveSelectedSeguro,
    removeInsurance,
    changePurchaseChartStatus,
    removeOrder,
    isRemoveOrderFetching,
  } = useAllOrdersController();

  const {
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedOrder,
    setSelectedOrder,
    currentPage,
    pageSize,
    totalItems,
    columns,
    styles,
  } = useAllOrdersFilterController({ productsFilteredQuery, showModal });

  function parseBRL(value: string | number | null | undefined): number {
    if (typeof value === "number") return value;
    if (!value) return 0;

    return Number(
      String(value)
        .replace(/[^\d,.-]/g, "")
        .replace(/\./g, "")
        .replace(",", "."),
    );
  }
  const rowClassName = (record: DataType) => {
    const travaRFB = record?.empresa?.situacao_cadastral;

    const quantityOfItemsAllowedToBuy = Array.isArray(
      record?.credito_cliente?.telefones,
    )
      ? record?.credito_cliente?.telefones.reduce(
        (total: number, telefone: any) =>
          total + (telefone.elegiveis ? 1 : 0),
        0,
      )
      : 0;

    const quantityOfItemsAtChart = Array.isArray(record?.itens)
      ? record?.itens.reduce(
        (total: number, item: IPurchaseItens) =>
          total + Number(item.quantidade),
        0,
      )
      : 0;

    const isQuantityApproved =
      quantityOfItemsAtChart <= quantityOfItemsAllowedToBuy;
    const travaCrédito = record?.credito_cliente?.credito;
    const valorTotal = parseBRL(record?.total);
    const isCreditEnough = travaCrédito >= valorTotal;

    if (record?.status !== "Fechado") {
      return "";
    }

    if (travaCrédito === 0) {
      return "ant-table-row-red";
    }

    if (
      travaRFB === "INAPTA" ||
      travaRFB === "BAIXADA" ||
      travaRFB === "SUSPENSA" ||
      travaRFB === null
    ) {
      return "ant-table-row-red";
    }

    if (travaRFB === "ATIVA") {
      if (
        !isQuantityApproved ||
        !isCreditEnough ||
        record.telefone_foi_editado === 1 ||
        record.email_foi_editado === 1 ||
        record.observacao_foi_editado === 1 ||
        record.complemento_foi_editado === 1 ||
        !record?.gestor_sfa ||
        !record?.email ||
        !record?.telefone
      ) {
        return "ant-table-row-yellow";
      }
      return "ant-table-row-green";
    }
    return "ant-table-row-green";
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection: TableProps<DataType>["rowSelection"] = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col px-6 md:px-10 lg:px-14 py-4 min-h-[833px] ">
          <div className="flex w-full justify-between mt-3 pb-4">
            <h1 className="text-[22px]">Pedidos RH</h1>
          </div>
          {/* Filtro */}
          <FiltroPedidosForm
            control={control}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            onClear={clearFilters}
            statusOptions={productsFilteredQuery?.status_pos_venda_enum}
            selectedRowKeys={selectedRowKeys}
            productsFilteredQuery={productsFilteredQuery}
          />

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
            {/* Tabela para web */}
            <div className="hidden md:block overflow-y-auto ">
              <Table<DataType>
                rowKey="id"
                rowSelection={rowSelection}
                rowClassName={rowClassName}
                className={styles.customTable}
                loading={isAllProductsFilteredLoading}
                columns={columns}
                dataSource={dataSource}
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedOrder(record);
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
          {/* Cards para mobile */}
          <MobileCard
            dataSource={dataSource}
            setSelectedOrder={setSelectedOrder}
            showModal={showModal}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
          />

          {/* Modal */}
          <OrderDetailsModal
            changePurchaseChartStatus={changePurchaseChartStatus}
            saveSelectedSeguro={saveSelectedSeguro}
            removeInsurance={removeInsurance}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            selectedId={selectedOrder}
            dataSource={productsFilteredQuery}
            addItemInChart={handleAddItemInChart}
            removeItem={removeItem}
            statusOptions={productsFilteredQuery?.status_pos_venda_enum}
            changeStatus={changeStatus}
            updateData={updateData}
            devices={devices}
            isDataLoading={isDataLoading}
            updateDataIdVivoAndConsultorResponsavel={
              updateDataIdVivoAndConsultorResponsavel
            }
            removeOrder={removeOrder}
            isRemoveOrderFetching={isRemoveOrderFetching}
          />
        </div>
      </QueryClientProvider>
    </>
  );
}

export default AllOrders;
