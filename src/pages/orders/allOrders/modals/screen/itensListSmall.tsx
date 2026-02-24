import { Tooltip } from "antd";

import { IPurchase, IPurchaseItens } from "@/interfaces/purchase";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export const ItensListSmallScreen = ({
  purchaseById,
}: {
  purchaseById: IPurchase | undefined | null;
}) => (
  <div className="block md:hidden">
    {purchaseById?.itens
      ?.slice()
      .sort((a, b) => b.id - a.id)
      .map((product: IPurchaseItens) => {
        return (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow p-4 mb-4 mt-3 flex flex-col gap-2"
          >
            <div className="flex justify-between">
              <span className="font-semibold text-[#666]">Código:</span>
              <span>{product.cod_sap}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[#666]">Tipo:</span>
              <span>{product.tipo}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[#666]">Marca:</span>
              <span>{product.marca}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[#666]">Modelo:</span>
              <span>{product.modelo || "-"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold flex items-center gap-1 text-[#666]">
                Cor{" "}
                <div className="cursor-poiter">
                  <Tooltip
                    title="A escolha de cor é uma indicação de preferência. Mas a consolidação do pedido na cor escolhida depende da disponibilidade no estoque no momento do fechamento efetivo do pedido."
                    placement="top"
                    styles={{ body: { fontSize: "12px" } }}
                  >
                    <ExclamationCircleOutlined />
                  </Tooltip>
                </div>
                :
              </span>
              {product?.cor_escolhida}
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#666]">Quantidade:</span>
              {product?.quantidade}
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[#666]">Parcela (R$) :</span>
              <span>
                R${" "}
                {(
                  Number(product?.valor_parcelado) /
                  Number(purchaseById?.parcelamento || 1)
                )?.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold flex items-center gap-1 text-[#666]">
                Parcelamento{" "}
                <div className="cursor-poiter">
                  <Tooltip
                    title="Para alterar a quantidade de parcelas, selecione o plano de parcelamento desejado no 'editor de pedido'."
                    placement="top"
                    styles={{ body: { fontSize: "12px" } }}
                  >
                    <ExclamationCircleOutlined />
                  </Tooltip>
                </div>
                :
              </span>
              <span>
                {" "}
                {purchaseById?.parcelamento === 1
                  ? "à vista"
                  : `${purchaseById?.parcelamento}x`}
              </span>
            </div>
          </div>
        );
      })}
  </div>
);
