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
  return (
    <>
      <div className="mt-4 flex gap-4 justify-end">
        <Button onClick={onGeneratePDF} variant="outlined" color="green">
          {generatePDFText}
        </Button>
        <Button
          onClick={onEdit}
          color="green"
          variant="outlined"
          style={{
            color: "#029d23",
            fontSize: "14px",
          }}
        >
          {editText}
        </Button>
        <Button
          onClick={onDelete}
          color="red"
          variant="outlined"
          style={{
            color: "red",
            fontSize: "14px",
          }}
        >
          {deleteText}
        </Button>
      </div>
    </>
  );
}
