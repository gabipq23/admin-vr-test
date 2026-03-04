import { ConfigProvider, Modal } from "antd";
import { useState } from "react";
import HeaderInputs from "./headerInputs";

import ConfirmDeleteModal from "@/components/confirmDeleteModal";
import FooterButtons from "@/components/orders/footerButtons";
import { generateVRPDF } from "../../shared/export-pdf-vr";
import { VROrder } from "@/interfaces/VROrder";
import { OrdersRHDisplayModal } from "./RHDisplay";
import { VROrderStatus } from "@/services/vrOrders";

export function OrdersRHDetailsModal({
    isModalOpen,
    closeModal,
    selectedOrder,
    removeOrderData,
    isRemoveOrderFetching,
    changeOrderStatusData,
    isChangeOrderStatusFetching,
}: {
    isModalOpen: boolean;
    closeModal: () => void;
    selectedOrder: VROrder | null;
    removeOrderData: (id: number) => void;
    isRemoveOrderFetching: boolean;
    changeOrderStatusData: (id: number, status: VROrderStatus) => void;
    isChangeOrderStatusFetching: boolean;
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
                        colorPrimaryHover: "#029d23",
                    },
                },
            }}
        >
            <Modal
                centered
                title={
                    <HeaderInputs
                        selectedOrder={selectedOrder}
                        changeOrderStatusData={changeOrderStatusData}
                        isChangeOrderStatusFetching={isChangeOrderStatusFetching}
                    />
                }
                open={isModalOpen}
                onCancel={closeModal}
                footer={null}
                width={1200}
            >
                <div className="text-[#666666] mt-4 h-[460px] overflow-y-auto scrollbar-thin">
                    <OrdersRHDisplayModal selectedOrder={selectedOrder} />
                </div>
                <div className="mt-4 flex gap-4 justify-end">
                    {!isEditing && (
                        <FooterButtons
                            onGeneratePDF={() => generateVRPDF(selectedOrder)}
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
                    removeOrderData(selectedOrder.id);
                    closeModal();
                }}
                isLoading={isRemoveOrderFetching}
                message="Tem certeza que deseja excluir o pedido"
                itemToDelete={selectedOrder.order_number}
            />
        </ConfigProvider>
    );
}
