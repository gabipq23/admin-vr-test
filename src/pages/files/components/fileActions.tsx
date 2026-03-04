import { useState } from "react";
import { Button, Input, Modal, Select, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, FileOutlined } from "@ant-design/icons";

type FileActionsProps = {
    id: number;
    fileUrl: string;
    fileType: string;
    format?: string;
    fileName?: string;
    status?: string;
    observation?: string;
    changeFileStatus: (args: { id: number; status: string }) => void;
    changeFileObservation: (args: { id: number; observation: string }) => void;
    removeFile: (id: number) => void;
};

const { TextArea } = Input;

const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"];

const getExtension = (urlOrName?: string) => {
    if (!urlOrName) return "";
    const clean = urlOrName.split("?")[0];
    const parts = clean.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
};

export function FileActions({
    id,
    fileUrl,
    fileType,
    format,
    fileName,
    status,
    observation,
    changeFileStatus,
    changeFileObservation,
    removeFile,
}: FileActionsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEvaluateOpen, setIsEvaluateOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [localObservation, setLocalObservation] = useState(observation || "");
    const [localStatus, setLocalStatus] = useState(status || "PENDING");

    const isDefectiveUrl = (fileUrl || "").startsWith("https://mmg.whatsapp.net/");

    const extension = getExtension(fileUrl || fileName);
    const normalizedFormat = (format || "").toLowerCase();
    const normalizedType = (fileType || "").toLowerCase();

    const isImage =
        normalizedType.includes("image") ||
        normalizedFormat.startsWith("image/") ||
        imageExtensions.includes(extension);

    const modalTitle = isImage ? "Imagem" : "Documento";

    const statusOptions = [
        {
            value: "PENDING",
            label: (
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-yellow-500" />
                    Pendente
                </div>
            ),
        },
        {
            value: "APPROVED",
            label: (
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Aprovado
                </div>
            ),
        },
        {
            value: "REJECTED",
            label: (
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Reprovado
                </div>
            ),
        },
    ];

    const handleOpenEvaluate = () => {
        setLocalObservation(observation || "");
        setLocalStatus(status || "PENDING");
        setIsEvaluateOpen(true);
    };

    const handleSubmitEvaluate = () => {
        changeFileStatus({ id, status: localStatus });
        changeFileObservation({ id, observation: localObservation });
        setIsEvaluateOpen(false);
    };

    const handleConfirmDelete = () => {
        removeFile(id);
        setIsDeleteOpen(false);
    };

    const greenOutlineButtonClass =
        "!border-[#029d23] !text-[#029d23] hover:!border-[#029d23] hover:!bg-[#029d2314]";

    const redOutlineButtonClass =
        "!border-[#ef4444] !text-[#ef4444] hover:!border-[#ef4444] hover:!bg-[#ef444414]";

    return (
        <>
            <Modal
                title="Deseja excluir o anexo?"
                open={isDeleteOpen}
                onCancel={() => setIsDeleteOpen(false)}
                footer={null}
                centered
                width={600}
            >
                <div className="flex justify-end gap-3 pt-3 border-t border-[#f0f0f0]">
                    <Button
                        className={greenOutlineButtonClass}
                        onClick={() => setIsDeleteOpen(false)}
                    >
                        Cancelar
                    </Button>
                    <Button className={redOutlineButtonClass} onClick={handleConfirmDelete}>
                        Excluir
                    </Button>
                </div>
            </Modal>

            <Modal
                title="Avaliar Anexo"
                open={isEvaluateOpen}
                onCancel={() => setIsEvaluateOpen(false)}
                footer={null}
                centered
                width={800}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <span className="text-[16px] font-semibold">Observação</span>
                        <TextArea
                            value={localObservation}
                            onChange={(event) => setLocalObservation(event.target.value)}
                            rows={7}
                            placeholder="Digite aqui a sua mensagem"
                        />
                    </div>

                    <Select
                        value={localStatus}
                        onChange={(value) => setLocalStatus(value)}
                        options={statusOptions}
                    />

                    <div className="flex justify-end gap-3 pt-3 border-t border-[#f0f0f0]">
                        <Button
                            className={greenOutlineButtonClass}
                            onClick={() => setIsEvaluateOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button className={greenOutlineButtonClass} onClick={handleSubmitEvaluate}>
                            Editar
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                title={modalTitle}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                centered
                width={isImage ? 1200 : 1120}
            >
                {isDefectiveUrl ? (
                    <div className="h-[20dvh] w-full flex items-center justify-center">
                        <p>Arquivo Inválido</p>
                    </div>
                ) : isImage ? (
                    <div className="w-full flex items-center justify-center p-2">
                        <img
                            src={fileUrl}
                            alt={fileName || "Imagem do anexo"}
                            className="rounded-md max-h-[70vh] max-w-[100%]"
                        />
                    </div>
                ) : (
                    <div className="h-[85dvh] w-full flex items-center justify-center overflow-auto p-2">
                        <embed src={fileUrl} className="w-full h-full" title="Visualizador de documento" />
                    </div>
                )}
            </Modal>

            <div className="flex items-center justify-center gap-2">
                <Tooltip title="Visualizar Anexo" styles={{ body: { fontSize: "12px" } }}>
                    <Button
                        icon={<FileOutlined />}
                        onClick={() => setIsModalOpen(true)}
                        className={`!h-10 !w-10 !rounded-lg ${greenOutlineButtonClass}`}
                    />
                </Tooltip>

                <Tooltip title="Avaliar Anexo" styles={{ body: { fontSize: "12px" } }}>
                    <Button
                        icon={<EditOutlined />}
                        onClick={handleOpenEvaluate}
                        className={`!h-10 !w-10 !rounded-lg ${greenOutlineButtonClass}`}
                    />
                </Tooltip>

                <Tooltip title="Excluir Anexo" styles={{ body: { fontSize: "12px" } }}>
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => setIsDeleteOpen(true)}
                        className={`!h-10 !w-10 !rounded-lg ${redOutlineButtonClass}`}
                    />
                </Tooltip>
            </div>
        </>
    );
}
