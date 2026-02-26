
import { useNavigate } from "react-router-dom";
import { useFilesController } from "./controller/controller";
import { ConfigProvider, Table } from "antd";
import { IFiles } from "@/interfaces/files";
import { customLocale } from "@/utils/customLocale";
import { FiltroFilesForm } from "./components/filter";
import { useFilesFilterController } from "./controller/filterController";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Files() {
    const navigate = useNavigate();
    const queryClient = new QueryClient();

    const {
        //  isFiltered,
        control,
        onSubmit,
        handleSubmit,
        clearFilters,
        // selectedFile,
        // setSelectedFile,
        currentPage,
        // pageSize,
        columns,
        styles,
        allColumnOptions,
        visibleColumns,
        handleColumnsChange,

    } = useFilesFilterController();
    const {
        // filesQuery: { status, error, refetch },
        itemsPerPage,
        // currentPage,
        totalPages,
        // files,
        sortedData,
        // changePage,
        // changeItemsPerPage,
        // changeFileStatus,
        // changeFileObservation,
        // removeFile,
        // toggleSortOrder,
        // sortOrder,
        // sortBy,
    } = useFilesController();

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
                            <FiltroFilesForm
                                control={control}
                                handleSubmit={handleSubmit}
                                onSubmit={onSubmit}
                                onClear={clearFilters}
                                allColumnOptions={allColumnOptions}
                                visibleColumns={visibleColumns}
                                handleColumnsChange={handleColumnsChange}
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
                            <Table<IFiles>
                                rowKey="id"
                                // loading={isLoading}
                                scroll={{ y: 800 }}
                                // rowSelection={rowSelection}
                                className={styles.customTable}
                                dataSource={sortedData}
                                // rowClassName={(record) => rowClassName(record) ?? ""}
                                columns={columns}
                                // onRow={(record) => ({
                                //   onClick: () => {
                                //     setSelectedBLOrder(record);
                                //     showModal();
                                //   },
                                //   style: { cursor: "pointer" },
                                // })}
                                pagination={{
                                    current: currentPage,
                                    pageSize: itemsPerPage,
                                    total: totalPages,
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
                </div>
            </QueryClientProvider>


        </>
    )
}