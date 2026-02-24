import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAllOrdersFilterController } from "./controllers/filterController";
import { FiltroProspectsForm } from "./components/filter";
import { useAllOrdersController } from "./controllers/dataController";

import { Alert, ConfigProvider, Table } from "antd";
import { DataType } from "src/interfaces/orderModal";
import { customLocale } from "@/utils/customLocale";
import { ProspectsPFModal } from "./modals/ProspectsPFDetails";

function ProspectsPF() {
  const queryClient = new QueryClient();
  const { showModal, closeModal, isModalOpen } = useAllOrdersController();

  const {
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedProspect,
    setSelectedProspect,

    columns,
    styles,
  } = useAllOrdersFilterController();

  // const rowClassName = (record: DataType) => {
  //   return record.cliente_gold === 0 ? "ant-table-row-yellow" : "";
  // };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col px-6 md:px-10 lg:px-14 py-4 min-h-[833px] ">
          <div className="flex justify-between  mt-6  mb-4">
            <div>
              <div className="flex  gap-8 justify-between mb-2">
                <h1 className="text-[22px]">Prospects PF</h1>
              </div>
              {/* Filtro */}
              <FiltroProspectsForm
                control={control}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                onClear={clearFilters}
              />
            </div>
            <Alert
              message="Tela em desenvolvimento"
              description="Esta tela está em processo de desenvolvimento. Em breve estará disponível."
              type="warning"
              showIcon
              className="min-h-22 max-h-32"
            />{" "}
          </div>
          <ConfigProvider
            locale={customLocale}
            theme={{
              token: {
                colorPrimary: "#660099",
                colorPrimaryHover: "#833baa",
                colorLink: "#660099",
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

                onRow={(record) => ({
                  onClick: () => {
                    setSelectedProspect(record);
                    showModal();
                  },
                  style: { cursor: "pointer" },
                })}
              // pagination={{
              //   current: currentPage,
              //   pageSize: pageSize,
              //   total: totalItems,
              //   showSizeChanger: true,
              //   pageSizeOptions: ["50", "100", "200", "500"],
              //   showLessItems: true,
              //   onChange: (page, pageSize) => {
              //     const params = new URLSearchParams(window.location.search);
              //     params.set("page", page.toString());
              //     params.set("limit", pageSize.toString());
              //     navigate(`?${params.toString()}`);
              //   },
              //   showTotal: (total) => `Total de ${total} prospects`,
              // }}
              />
            </div>
          </ConfigProvider>

          {/* Modal */}
          <ProspectsPFModal
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            selectedId={selectedProspect}
          />
        </div>
      </QueryClientProvider>
    </>
  );
}

export default ProspectsPF;
