import { Button, ConfigProvider, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import { DataType } from "src/interfaces/orderModal";

function MobileCard({
  dataSource,
  setSelectedOrder,
  showModal,
  currentPage,
  pageSize,
  totalItems,
}: {
  dataSource: DataType[];
  setSelectedOrder: (order: DataType) => void;
  showModal: () => void;
  currentPage: number;
  pageSize: number;
  totalItems: number;
}) {
  const navigate = useNavigate();
  return (
    <>
      <div className="block md:hidden">
        {dataSource.map((purchase: DataType, index: number) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-4 mb-4 text-[14px] flex flex-col gap-2"
          >
            <div className="flex justify-between">
              <span className="font-semibold text-[#666]">ID do Pedido:</span>
              <span className="text-right">{purchase.id}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-[#666]">CNPJ:</span>
              <span className="text-right">{purchase.cnpj}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[#666]">Nome do Gestor:</span>
              <span className="text-right">{purchase.gestor_sfa}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[#666]">Telefone:</span>
              <span className="text-right">{purchase.telefone}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[#666]">Total:</span>
              <span className="text-right">{purchase.total}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-[#666]">Status:</span>
              <span className="text-right">{purchase.status}</span>
            </div>

            <div className="flex justify-center mt-2">
              <Button
                onClick={() => {
                  setSelectedOrder(purchase);
                  showModal();
                }}
                color="green"
                variant="link"
                className="w-full"
              >
                Ver mais
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 md:hidden">
        <ConfigProvider
          theme={{
            components: {
              Pagination: {
                colorPrimaryBorder: "#029d23",
                colorPrimary: "#029d23",
                colorPrimaryHover: "#550088",
              },
            },
          }}
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            showSizeChanger={true}
            onChange={(page, pageSize) => {
              const params = new URLSearchParams(window.location.search);
              params.set("page", page.toString());
              params.set("limit", pageSize.toString());
              navigate(`?${params.toString()}`);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </ConfigProvider>
      </div>
    </>
  );
}

export default MobileCard;
