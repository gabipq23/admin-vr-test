import { useState } from "react";

export function useAllOrdersController() {
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    showModal,
    closeModal,
    isModalOpen,
  };
}
