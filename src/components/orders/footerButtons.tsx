import { Button } from "antd";

interface FooterButtonsProps {
  onGeneratePDF: () => void;
  onEdit: () => void;
  onDelete: () => void;
  generatePDFText?: string;
  editText?: string;
  deleteText?: string;
}

export default function FooterButtons({
  onGeneratePDF,
  onEdit,
  onDelete,
  generatePDFText = "Gerar PDF",
  editText = "Editar",
  deleteText = "Deletar pedido",
}: FooterButtonsProps) {
  const greenOutlineButtonClass =
    "!border-[#029d23] !text-[#029d23] hover:!border-[#029d23] hover:!bg-[#029d2314]";

  const redOutlineButtonClass =
    "!border-[#ef4444] !text-[#ef4444] hover:!border-[#ef4444] hover:!bg-[#ef444414]";

  return (
    <>
      <div className="mt-4 flex gap-4 justify-end">
        <Button onClick={onGeneratePDF} className={greenOutlineButtonClass}>
          {generatePDFText}
        </Button>
        <Button onClick={onEdit} className={greenOutlineButtonClass}>
          {editText}
        </Button>
        <Button onClick={onDelete} className={redOutlineButtonClass}>
          {deleteText}
        </Button>
      </div>
    </>
  );
}
