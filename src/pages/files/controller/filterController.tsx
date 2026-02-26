import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useStyle } from "@/style/tableStyle";
import { useRHTableColumns } from "../components/tableColumns";

export function getFiltersFromURL(): any {
    const params = new URLSearchParams(window.location.search);


    const to = params.get("to") || undefined;
    const from = params.get("from") || undefined;


    return {
        to,
        from,
    };
}


export function useFilesFilterController() {
    const navigate = useNavigate();
    const filters = getFiltersFromURL();

    const [selectedFile, setSelectedFile] = useState<any | null>(null);

    const currentPage = filters.page;
    const pageSize = filters.limit;

    const { handleSubmit, reset, control } = useForm<any>({
        defaultValues: {
            status: null,
            nome: "",
            from: "",
            to: "",


        },
    });

    const [isFiltered, setIsFiltered] = useState<boolean>(false);

    const onSubmit = (data: any) => {
        const params = new URLSearchParams();

        if (data.nome) params.set("nome", data.nome);
        if (data.from) params.set("data_de", data.from);
        if (data.to) params.set("data_ate", data.to);
        if (data.status) params.set("status", data.status);

        navigate(`?${params.toString()}`);
        setIsFiltered(true);
    };

    const clearFilters = () => {
        reset();
        navigate("");
        setIsFiltered(false);
    };

    const { styles } = useStyle();

    const alwaysVisibleKeys = [""];
    const allTableColumns = useRHTableColumns();

    const allColumnOptions = allTableColumns
        .filter(
            (col) =>
                "dataIndex" in col &&
                !alwaysVisibleKeys.includes(String(col.dataIndex)),
        )
        .map((col) => ({
            label:
                typeof col.title === "function"
                    ? String(col.key || ("dataIndex" in col ? col.dataIndex : ""))
                    : String(col.title),
            value: String(col.key || ("dataIndex" in col ? col.dataIndex : "")),
        }));

    const selectableKeys = allTableColumns
        .filter(
            (col) =>
                "dataIndex" in col &&
                !alwaysVisibleKeys.includes(String(col.dataIndex)),
        )
        .map((col) => String(col.key || ("dataIndex" in col ? col.dataIndex : "")));

    const [visibleColumns, setVisibleColumns] =
        useState<string[]>(selectableKeys);
    const handleColumnsChange = (checkedValues: string[]) => {
        setVisibleColumns(checkedValues);
    };

    const columns = [
        ...allTableColumns.filter(
            (col) =>
                "dataIndex" in col && alwaysVisibleKeys.includes(String(col.dataIndex)),
        ),
        ...allTableColumns.filter(
            (col) =>
                "dataIndex" in col &&
                !alwaysVisibleKeys.includes(String(col.dataIndex)) &&
                visibleColumns.includes(
                    String(col.key || ("dataIndex" in col ? col.dataIndex : "")),
                ),
        ),
    ];

    return {
        isFiltered,
        control,
        onSubmit,
        handleSubmit,
        clearFilters,
        selectedFile,
        setSelectedFile,
        currentPage,
        pageSize,
        columns,
        styles: { customTable: styles.customTable },
        allColumnOptions,
        visibleColumns,
        handleColumnsChange,
    };
}
