import React from "react";
import { Button, ConfigProvider, Select, Tooltip } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { useAddNewDeviceController } from "./controller";
import { IProduct } from "@/interfaces/product";
import {
  IAddItemInChartFunction,
  IAddItemInChartData,
} from "@/interfaces/purchase";

type AllSelectsToAddProductsProps = {
  addItemInChart: (idProduto: IAddItemInChartFunction) => void;
  products: IProduct[] | undefined;
  selectedId: string | undefined;
};

export const AllSelectsToAddProducts: React.FC<
  AllSelectsToAddProductsProps
> = ({ addItemInChart, products, selectedId }) => {
  const {
    setShowClearButton,
    selectedTipo,
    setSelectedTipo,
    selectedMarca,
    setSelectedMarca,
    selectedModelo,
    setSelectedModelo,
    selectedCor,
    setSelectedCor,
    filteredProducts,
    tipos,
    marcas,
    modelos,
    cores,
    clearFilter,
  } = useAddNewDeviceController({ products: products ?? [] });

  return (
    <div className="flex flex-wrap mr-2">
      <ConfigProvider
        theme={{
          components: {
            Select: {
              hoverBorderColor: "#029d23",
              activeBorderColor: "#029d23",
              activeOutlineColor: "none",
              colorBorder: "#a2a2a2",
              colorTextPlaceholder: "#a2a2a2",
            },
            Button: {
              colorBorder: "#029d23",
              colorText: "#029d23",
              colorPrimaryHover: "#cb1ef5",
              colorPrimaryBorderHover: "#cb1ef5",
            },
          },
        }}
      >
        <div className="flex flex-wrap justify-between items-center ">
          <div className="flex flex-col lg:flex-row md:flex-row flex-1 gap-2">
            {/* Tipo */}
            <Select
              className="min-w-26 max-w-36"
              showSearch
              placeholder="Tipo"
              value={selectedTipo}
              onChange={(value) => {
                setSelectedTipo(value);
                setSelectedMarca(undefined);
                setSelectedModelo(undefined);
                setShowClearButton(true);
              }}
              filterOption={(input, option) => {
                if (!option || typeof option.label !== "string") return false;
                return option.label.toLowerCase().includes(input.toLowerCase());
              }}
              options={tipos.filter(
                (tipo) =>
                  typeof tipo.label === "string" && tipo.label.trim() !== ""
              )}
            />
            {/* Marca */}
            <Select
              className="min-w-26 max-w-36"
              showSearch
              placeholder="Marca"
              value={selectedMarca}
              onChange={(value) => {
                setSelectedMarca(value);
                setSelectedModelo(undefined);
                setShowClearButton(true);
              }}
              filterOption={(input, option) => {
                if (!option || typeof option.label !== "string") return false;
                return option.label.toLowerCase().includes(input.toLowerCase());
              }}
              options={marcas}
            />
            {/* Cor */}
            <Select
              className="min-w-26 max-w-36"
              showSearch
              placeholder="Cor"
              value={selectedCor}
              onChange={(value) => setSelectedCor(value)}
              filterOption={(input, option) => {
                if (!option || typeof option.label !== "string") return false;
                return option.label.toLowerCase().includes(input.toLowerCase());
              }}
              options={cores}
            />
            {/* Modelo */}
            <Select
              className="min-w-90 max-w-140"
              showSearch
              placeholder="Modelo"
              value={selectedModelo}
              onChange={(value) => {
                setSelectedModelo(value);
                setShowClearButton(true);
              }}
              filterOption={(input, option) => {
                if (!option || typeof option.label !== "string") return false;
                return option.label.toLowerCase().includes(input.toLowerCase());
              }}
              options={modelos}
            />
            <div className="flex w-auto self-end md:self-start lg:self-start gap-2">
              <Button
                style={{ width: "18px", height: "32px" }}
                variant="outlined"
                color="green"
                onClick={() => {
                  addItemInChart({
                    idProduto: selectedId,
                    produto: {
                      aparelho_id: (filteredProducts ?? [])[0]?.id,
                      quantidade: 1,
                      cor: selectedCor || (filteredProducts ?? [])[0]?.cores[0],
                    } as IAddItemInChartData,
                  });

                  clearFilter();
                }}
              >
                <Tooltip
                  title="Adicionar produto"
                  placement="top"
                  styles={{ body: { fontSize: "12px" } }}
                >
                  <PlusOutlined />
                </Tooltip>
              </Button>
              <Button
                variant="outlined"
                color="green"
                style={{ width: "18px", height: "32px" }}
                onClick={() => {
                  clearFilter();
                }}
              >
                <Tooltip
                  title="Limpar escolha"
                  placement="top"
                  styles={{ body: { fontSize: "12px" } }}
                >
                  <CloseOutlined />
                </Tooltip>
              </Button>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};
