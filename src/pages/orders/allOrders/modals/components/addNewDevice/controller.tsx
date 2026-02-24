import { IProduct } from "@/interfaces/product";
import React, { useState } from "react";

export function useAddNewDeviceController({
  products,
}: {
  products: IProduct[];
}) {
  const [showClearButton, setShowClearButton] = React.useState(false);
  const [selectedTipo, setSelectedTipo] = useState<string | undefined>();
  const [selectedMarca, setSelectedMarca] = useState<string | undefined>();
  const [selectedModelo, setSelectedModelo] = useState<string | undefined>();
  const [selectedCor, setSelectedCor] = useState<string | undefined>();

  // produtos filtrados com base nas seleções
  const filteredProducts = products?.filter((p: IProduct) => {
    const matchesTipo = selectedTipo ? p.tipo === selectedTipo : true;
    const matchesMarca = selectedMarca ? p.marca === selectedMarca : true;
    const matchesModelo = selectedModelo
      ? `${p.name} ${p.name2 ?? ""}` === selectedModelo
      : true;
    const matchesCor = selectedCor
      ? Array.isArray(p.cores) && p.cores.includes(selectedCor)
      : true;
    return matchesTipo && matchesMarca && matchesModelo && matchesCor;
  });

  // Tipo únicos com base no filtro atual
  const tipos = Array.from(
    new Set(
      filteredProducts?.filter((p) => p.online === true).map((p) => p.tipo)
    )
  ).map((tipo) => ({ label: tipo, value: tipo }));

  // marcas únicas com base no filtro atual
  const marcas = Array.from(
    new Set(
      filteredProducts?.filter((p) => p.online === true).map((p) => p.marca)
    )
  ).map((marca) => ({ label: marca, value: marca }));

  // modelos únicos com base no filtro atual
  const modelosSet = new Map<
    string,
    { label: string; value: string; preco?: number }
  >();
  filteredProducts?.forEach((p) => {
    if (p.online === true) {
      const modelo = `${p.name} ${p.name2 ?? ""}`;
      if (!modelosSet.has(modelo)) {
        modelosSet.set(modelo, {
          label: modelo,
          value: modelo,
          preco: p.preco24x,
        });
      }
    }
  });
  const modelos = Array.from(modelosSet.values());

  // cores únicas com base no filtro atual
  const allCores = filteredProducts
    ?.flatMap((p) => p?.cores || [])
    .filter((cor) => typeof cor === "string" && cor.trim() !== "");
  const coresUnicas = Array.from(new Set(allCores));
  const cores = coresUnicas.map((cor) => ({ label: cor, value: cor }));

  const clearFilter = () => {
    setSelectedMarca(undefined);
    setSelectedModelo(undefined);
    setSelectedTipo(undefined);
    setSelectedCor(undefined);
    setShowClearButton(false);
  };

  return {
    showClearButton,
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
  };
}
