import { ConfigProvider, Modal } from "antd";
import { useState } from "react";
import HeaderInputs from "./headerInputs";

import ConfirmDeleteModal from "@/components/confirmDeleteModal";
import FooterButtons from "@/components/orders/footerButtons";
import { generatePDF } from "../controllers/exportPDF";
import { VROrder } from "@/interfaces/VROrder";
import { OrdersRHDisplayModal } from "./RHDisplay";

export function OrdersRHDetailsModal({
    isModalOpen,
    closeModal,
    selectedOrder,
}: {
    isModalOpen: boolean;
    closeModal: () => void;
    selectedOrder: VROrder | null;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    if (!isModalOpen || !selectedOrder) return null;

    return (
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
                    Select: {
                        hoverBorderColor: "#029d23",
                        activeBorderColor: "#029d23",
                        activeOutlineColor: "none",
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
            <Modal
                centered
                title={<HeaderInputs />}
                open={isModalOpen}
                onCancel={closeModal}
                footer={null}
                width={1200}
            >
                <div className="text-[#666666] mt-4 h-[460px] overflow-y-auto scrollbar-thin">
                    <OrdersRHDisplayModal />
                </div>
                <div className="mt-4 flex gap-4 justify-end">
                    {!isEditing && (
                        <FooterButtons
                            onGeneratePDF={() => generatePDF("")}
                            onEdit={() => setIsEditing(false)}
                            onDelete={() => setShowDeleteModal(true)}
                        />
                    )}
                </div>
            </Modal>
            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => {
                    console.log("isso");
                }}
                isLoading={false}
                message="Tem certeza que deseja excluir o pedido"
                itemToDelete={""}
            />
        </ConfigProvider>
    );
}
