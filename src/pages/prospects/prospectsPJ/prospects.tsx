import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAllOrdersFilterController } from "./controllers/filterController";
import { FiltroProspectsForm } from "./components/filter";
import { useAllOrdersController } from "./controllers/dataController";

import { ConfigProvider, Table } from "antd";
import { DataType } from "src/interfaces/orderModal";
import { useNavigate } from "react-router-dom";
import { OrderDetailsModal } from "./modals/orderDetails";
import { customLocale } from "@/utils/customLocale";

function Prospects() {
  const queryClient = new QueryClient();
  const {
    prospectsFilteredQuery,
    showModal,
    closeModal,
    isModalOpen,
    dataSource,
    isProspectsFetching,
  } = useAllOrdersController();
  const navigate = useNavigate();

  const {
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedProspect,
    setSelectedProspect,
    currentPage,
    pageSize,
    totalItems,
    columns,
    styles,
  } = useAllOrdersFilterController({
    prospectsFilteredQuery,
  });

  // const rowClassName = (record: DataType) => {
  //   return record.cliente_gold === 0 ? "ant-table-row-yellow" : "";
  // };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col px-6 md:px-10 lg:px-14 py-4 min-h-[833px] ">
          <div className="flex w-full justify-between mt-3 pb-4">
            <h1 className="text-[22px]">Prospects PJ</h1>
          </div>
          {/* Filtro */}
          <FiltroProspectsForm
            control={control}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            onClear={clearFilters}
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
            }}
          >
            {/* Tabela */}
            <div className="overflow-y-auto ">
              <Table<DataType>
                className={styles.customTable}
                columns={columns}
                // rowClassName={rowClassName}
                loading={isProspectsFetching}
                dataSource={dataSource}
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedProspect(record);
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
                  showTotal: (total) => `Total de ${total} prospects`,
                }}
              />
            </div>
          </ConfigProvider>

          {/* Modal */}
          <OrderDetailsModal
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            selectedId={selectedProspect}
            dataSource={prospectsFilteredQuery}
          />
        </div>
      </QueryClientProvider>
    </>
  );
}

export default Prospects;
