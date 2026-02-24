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
        <Button key="cancel" onClick={onClose}>
          {cancelButtonText}
        </Button>,
        <Button
          key="confirm"
          type="primary"
          danger={isDanger}
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
