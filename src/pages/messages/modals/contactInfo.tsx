import { IContact } from "@/interfaces/contacts";
import { convertData } from "@/utils/convertData";
import { formatCNPJ } from "@/utils/formatCNPJ";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { CopyOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Modal, Select, Tooltip } from "antd";
import { useEffect, useState } from "react";

export function ContactInfoModal({
  isModalOpen,
  closeModal,
  selectedId,
  changeContactStatus,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedId: IContact | null;
  changeContactStatus?: any;
}) {
  const getTimeOrDate = (dataEpoch: string, type: "hora" | "data") => {
    const match = dataEpoch.match(/^(\d{2})-(\d{2})-(\d{4}) (.+)$/);
    let formattedDate = dataEpoch;
    if (match) {
      formattedDate = `${match[3]}-${match[2]}-${match[1]} ${match[4]}`;
    }

    const converted = convertData(formattedDate);
    if (type === "hora") {
      return converted.split(",")[1].trim().slice(0, 5);
    }
    if (type === "data") {
      const [month, day, year] = converted.split(",")[0].split("/");
      return `${day}/${month}/${year}`;
    }
  };

  const [tooltipTitle, setTooltipTitle] = useState("Copiar");

  const handleCopy = (
    code: string,
    setTooltip: React.Dispatch<React.SetStateAction<string>>
  ) => {
    navigator.clipboard.writeText(code || "-");
    setTooltip("Copiado!");
    setTimeout(() => setTooltip("Copiar"), 2000);
  };
  const [localStatus, setLocalStatus] = useState(
    selectedId?.status_mensagem ?? ""
  );

  useEffect(() => {
    setLocalStatus(selectedId?.status_mensagem ?? "");
  }, [selectedId?.status_mensagem]);

  const copyComponent = (text: string) => {
    return (
      <Tooltip
        styles={{ body: { fontSize: "11px" } }}
        title={tooltipTitle}
        trigger="hover"
        placement="top"
      >
        <div
          onClick={() => selectedId && handleCopy(text, setTooltipTitle)}
          className="text-[#666666] cursor-pointer"
        >
          <CopyOutlined style={{ fontSize: 16, color: "purple" }} />
        </div>
      </Tooltip>
    );
  };

  return (
    <Modal
      centered
      title={
        <div className="flex  justify-between">
          <span style={{ color: "#252525" }}>#{selectedId?.id}</span>

          <ConfigProvider
            theme={{
              components: {
                Select: {
                  hoverBorderColor: "#660099",
                  activeBorderColor: "#660099",
                  activeOutlineColor: "none",
                },
              },
            }}
          >
            <div className="flex items-center gap-2 mr-5">
              <span className="text-[14px] font-semibold">Status: </span>
              <Select
                size="small"
                value={localStatus}
                style={{ width: "150px", fontWeight: "400" }}
                onChange={(value) => {
                  setLocalStatus(value);

                  if (selectedId?.id) {
                    changeContactStatus({
                      id: selectedId.id,
                      status_mensagem: value,
                    });
                  }
                }}
                options={[
                  { label: "Visualizada", value: "Visualizada" },
                  { label: "Respondida", value: "Respondida" },
                ]}
              />
            </div>
          </ConfigProvider>
        </div>
      }
      open={isModalOpen}
      onCancel={closeModal}
      footer={null}
      width={1000}
    >
      <div className="flex flex-col mr-4">
        <p className="flex text-[22px] gap-2 ">
          {selectedId?.assunto} {copyComponent(selectedId?.assunto ?? "")}
        </p>
        <div className="flex ">
          <div className="flex flex-col md:flex-row lg:flex-row w-full justify-between text-[#666666]">
            <p className="flex gap-2 text-[15px]">
              {selectedId?.nome} {copyComponent(selectedId?.nome ?? "")} &bull;{" "}
              {formatPhoneNumber(selectedId?.telefone ?? "")} &bull;{" "}
              {formatCNPJ(selectedId?.cnpj ?? "")} &bull; {selectedId?.email}{" "}
              {copyComponent(selectedId?.email ?? "")}{" "}
            </p>
            <div className="flex gap-2">
              {selectedId?.data_criacao && (
                <p>
                  {getTimeOrDate(selectedId?.data_criacao, "data")},{" "}
                  {getTimeOrDate(selectedId?.data_criacao, "hora")}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-[#eeeeee] mt-8 p-1 text-[15px] text-[#666666]">
          Mensagem
          {selectedId?.empresa ? (
            <>
              {" da empresa"}{" "}
              {<span className="text-[#555]">{selectedId?.empresa}</span>}:
            </>
          ) : (
            ":"
          )}
        </div>
        <div className="flex items-center border-1 p-1 border-[#eeeeee] text-[16px] text-[#666666] justify-between">
          <span>{selectedId?.mensagem}</span>
          {copyComponent(selectedId?.mensagem ?? "")}
        </div>
      </div>

      <div className="mt-4 flex gap-4 justify-end mr-4">
        <Button
          onClick={closeModal}
          color="purple"
          variant="outlined"
          style={{
            color: "#660099",
            fontSize: "14px",
          }}
        >
          Fechar
        </Button>
      </div>
    </Modal>
  );
}
