import React from "react";

import { IPurchase, IPurchaseItens } from "@/interfaces/purchase";

export const ItensListLargeScreen = ({
  purchaseById,
}: {
  purchaseById: IPurchase | undefined | null;
}) => (
  <div className="hidden md:block mt-4 text-neutral-700">
    {/* Renderização dinâmica dos produtos em ordem decrescente */}
    <div className="flex items-center font-semibold text-[#666666] text-[14px]">
      <p className="w-36 text-center">Código</p>
      <p className="w-36 text-center">Tipo</p>
      <p className="w-24 text-center">Marca</p>
      <p className="w-100 text-center">Modelo</p>
      <p className="w-40 text-center flex items-center cursor-pointer gap-1 justify-center">
        Cor
      </p>
      <p className="w-40 text-center">Quantidade</p>
      <p className="w-38 text-center">Parcela (R$)</p>
      {/* <p className="w-36 text-center flex items-center cursor-pointer gap-1 justify-center">
        Parcelamento
      </p> */}
      <p className="w-32 text-center  ">Seguro </p>
    </div>
    <hr className="border-t border-neutral-300 mx-2" />

    {[...(purchaseById?.itens ?? [])]
      .slice()
      .reverse()
      .map((product: IPurchaseItens) => {
        return (
          <React.Fragment key={product.id}>
            <React.Fragment key={product.id}>
              <div className="flex items-center py-4 text-[14px] text-neutral-700">
                <p className="text-[14px]  font-semibold w-36 text-center">
                  {product.cod_sap}
                </p>
                <p className="text-[14px] w-36 text-center">{product.tipo}</p>
                <p className="text-[14px] font-semibold w-24 text-center">
                  {product.marca}
                </p>
                <p className="text-[14px] font-semibold w-100 text-center">
                  {product.modelo || "-"}
                </p>
                <p className="text-[14px] font-semibold w-40 text-center">
                  {product?.cor_escolhida || "-"}
                </p>
                <p className="text-[14px] font-semibold w-40 text-center">
                  {product?.quantidade}
                </p>
                <p className="text-[14px] text-neutral-700 font-semibold w-38 text-center">
                  R${" "}
                  {(
                    Number(product?.valor_parcelado) /
                    Number(purchaseById?.parcelamento || 1)
                  ).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                {/* <p className="text-[14px] text-neutral-700 font-semibold w-36 text-center">
                  {purchaseById?.parcelamento === 1
                    ? "à vista"
                    : `${purchaseById?.parcelamento}x`}
                </p> */}
                <p className="w-32 text-center ">
                  {product?.seguro_valor !== null ? (
                    <span>
                      R${" "}
                      {product?.seguro_valor?.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      /mês
                    </span>
                  ) : (
                    "Sem seguro"
                  )}
                </p>
              </div>
              <hr className="border-t border-neutral-300 mx-2" />
            </React.Fragment>

            <hr className="border-t border-neutral-300 mx-2" />
          </React.Fragment>
        );
      })}
  </div>
);
