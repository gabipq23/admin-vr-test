import { Button, ConfigProvider, Modal } from "antd";

import { DataType } from "src/interfaces/orderModal";

export function ProspectsPFModal({
  isModalOpen,
  closeModal,

  selectedId,
}: {
  isModalOpen: boolean;
  closeModal: () => void;

  selectedId: DataType | null;
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
          <div className="text-[#666666] min-w-[320px] max-w-[1120px] h-[460px] "></div>
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
