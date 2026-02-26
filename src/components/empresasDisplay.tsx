import { CopyOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState } from "react";

type SocioEmpresa = {
  cpf: string;
  name: string;
  is_admin: string;
};

type LegacyEmpresa = {
  cnpj: string;
  nome: string;
  porte: string;
};

type EmpresasProp = SocioEmpresa[] | LegacyEmpresa[] | null | undefined;

const isSocioEmpresa = (empresa: unknown): empresa is SocioEmpresa => {
  if (!empresa || typeof empresa !== "object") return false;

  const candidate = empresa as Record<string, unknown>;
  return (
    typeof candidate.cpf === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.is_admin === "string"
  );
};

const isLegacyEmpresa = (empresa: unknown): empresa is LegacyEmpresa => {
  if (!empresa || typeof empresa !== "object") return false;

  const candidate = empresa as Record<string, unknown>;
  return (
    typeof candidate.cnpj === "string" &&
    typeof candidate.nome === "string" &&
    typeof candidate.porte === "string"
  );
};

export const EmpresasDisplay = ({ empresas }: { empresas: EmpresasProp }) => {
  const [tooltipTitle, setTooltipTitle] = useState("Copiar");

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code || "-");
    setTooltipTitle("Copiado!");
    setTimeout(() => setTooltipTitle("Copiar"), 2000);
  };

  if (!empresas || !Array.isArray(empresas) || empresas.length === 0) {
    const copyComponent = (
      <Tooltip
        styles={{ body: { fontSize: "11px" } }}
        title={tooltipTitle}
        trigger="hover"
        placement="top"
      >
        <div
          onClick={() => handleCopy("-")}
          className="text-[#666666] cursor-pointer"
        >
          <CopyOutlined style={{ fontSize: 12, color: "#8b8e8f" }} />
        </div>
      </Tooltip>
    );

    return (
      <div className="flex py-1 text-[14px] gap-2 text-neutral-700">
        <p>
          <strong>Empresas:</strong> -
        </p>
        {copyComponent}
      </div>
    );
  }

  const empresasFormatadas = empresas
    .map((empresa) => {
      if (isSocioEmpresa(empresa)) {
        const adminLabel = empresa.is_admin === "1" ? "Sim" : "Não";
        return `${empresa.cpf}, ${empresa.name}, Admin: ${adminLabel}`;
      }

      if (isLegacyEmpresa(empresa)) {
        return `${empresa.cnpj}, ${empresa.nome}, ${empresa.porte}`;
      }

      return "-";
    })
    .join("; \n");

  const copyComponent = (
    <Tooltip
      styles={{ body: { fontSize: "11px" } }}
      title={tooltipTitle}
      trigger="hover"
      placement="top"
    >
      <div
        onClick={() => handleCopy(empresasFormatadas)}
        className="text-[#666666] cursor-pointer"
      >
        <CopyOutlined style={{ fontSize: 12, color: "#8b8e8f" }} />
      </div>
    </Tooltip>
  );

  const maxLength = 50;

  return (
    <div className="flex py-1 text-[14px] gap-2 text-neutral-700">
      {empresasFormatadas.length > maxLength ? (
        <Tooltip
          styles={{ body: { fontSize: "12px" } }}
          title={
            <div style={{ whiteSpace: "pre-line" }}>{empresasFormatadas}</div>
          }
          trigger="hover"
          placement="top"
        >
          <p className="cursor-pointer">
            <strong>Empresas:</strong>{" "}
            {`${empresasFormatadas.substring(0, maxLength)}...`}
          </p>
        </Tooltip>
      ) : (
        <p>
          <strong>Empresas:</strong> {empresasFormatadas}
        </p>
      )}
      {copyComponent}
    </div>
  );
};
