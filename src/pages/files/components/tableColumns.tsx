import {
    TableColumnsType,
    Tooltip,
} from "antd";
import { IFiles } from "@/interfaces/files";
import { convertData } from "@/utils/convertData";
import { FileActions } from "./fileActions";
import { Status } from "@/services/files";

type IFilesWithFallbackFields = IFiles & {
    creatdAt?: string;
    statys?: string;
};

const statusLabels: { [key in Status]: string } = {
    [Status.PENDING]: "Pendente",
    [Status.REJECTED]: "Reprovado",
    [Status.APPROVED]: "Aprovado",
};

const getStatusLabel = (status: Status = Status.PENDING): string =>
    statusLabels[status] || statusLabels[Status.PENDING];

export const useRHTableColumns = ({
    changeFileStatus,
    changeFileObservation,
    removeFile,
}: {
    changeFileStatus: (args: { id: number; status: string }) => void;
    changeFileObservation: (args: { id: number; observation: string }) => void;
    removeFile: (id: number) => void;
}): TableColumnsType<IFiles> => {
    return [
        {
            title: "Avatar",
            key: "avatar",
            dataIndex: ["prospect", "platformData", "picture"],
            width: 90,
            render: (picture) => (
                <img
                    src={picture || "/assets/anonymous_avatar.png"}
                    className="h-9 w-9 rounded-full"
                    alt="Avatar"
                />
            ),
        },
        {
            title: "Nome do Arquivo",
            key: "name",
            dataIndex: "name",
            width: 240,
            ellipsis: { showTitle: false },
            render: (name) => (
                <Tooltip placement="topLeft" title={name || "-"} styles={{ body: { fontSize: "12px" } }}>
                    {name || "-"}
                </Tooltip>
            ),
        },
        {
            title: "Tipo",
            key: "format",
            dataIndex: "format",
            width: 120,
            render: (format) => format || "-",
        },
        {
            title: "Peso",
            key: "length",
            dataIndex: "length",
            width: 120,
            render: (length) => length || "-",
        },
        {
            title: "Bot",
            key: "bot",
            dataIndex: ["prospect", "bot", "name"],
            width: 180,
            ellipsis: { showTitle: false },
            render: (botName) => (
                <Tooltip placement="topLeft" title={botName || "-"} styles={{ body: { fontSize: "12px" } }}>
                    {botName || "-"}
                </Tooltip>
            ),
        },
        {
            title: "Data/Hora",
            key: "createdAt",
            dataIndex: "createdAt",
            width: 150,
            render: (_, record) => {
                const createdAt =
                    record.createdAt || (record as IFilesWithFallbackFields).creatdAt;
                return createdAt ? convertData(createdAt) : "-";
            },
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
            width: 120,
            render: (_, record) => {
                const status =
                    record.status || (record as IFilesWithFallbackFields).statys;
                if (!status) return "-";
                return getStatusLabel(status as Status);
            },
        },
        {
            title: "Obs",
            key: "observation",
            dataIndex: "observation",
            width: 220,
            ellipsis: { showTitle: false },
            render: (observation) => (
                <Tooltip
                    placement="topLeft"
                    title={observation || "Sem observações"}
                    styles={{ body: { fontSize: "12px" } }}
                >
                    {observation || "-"}
                </Tooltip>
            ),
        },
        {
            title: "Ações",
            key: "actions",
            dataIndex: "actions",
            width: 190,
            fixed: "right",
            render: (_, record) => (
                <FileActions
                    id={record.id}
                    fileUrl={record.url}
                    fileType={record.fileType}
                    format={record.format}
                    fileName={record.name}
                    status={record.status}
                    observation={record.observation}
                    changeFileStatus={changeFileStatus}
                    changeFileObservation={changeFileObservation}
                    removeFile={removeFile}
                />
            ),
        },

    ];
};
