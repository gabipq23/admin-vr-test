import { Button, Modal } from "antd";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  message: string;
  itemToDelete?: string | number;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isDanger?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Confirmar exclusão",
  message,
  itemToDelete,
  confirmButtonText = "Confirmar exclusão",
  cancelButtonText = "Cancelar",
  isDanger = true,
}: ConfirmDeleteModalProps) {
  const greenOutlineButtonClass =
    "!border-[#029d23] !text-[#029d23] hover:!border-[#029d23] hover:!bg-[#029d2314]";

  const redOutlineButtonClass =
    "!border-[#ef4444] !text-[#ef4444] hover:!border-[#ef4444] hover:!bg-[#ef444414]";

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      centered
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} className={greenOutlineButtonClass}>
          {cancelButtonText}
        </Button>,
        <Button
          key="confirm"
          className={isDanger ? redOutlineButtonClass : greenOutlineButtonClass}
          loading={isLoading}
          onClick={handleConfirm}
        >
          {confirmButtonText}
        </Button>,
      ]}
      title={title}
    >
      {message}
      {itemToDelete && <b> {itemToDelete}</b>}?
    </Modal>
  );
}
