export function formatBRL(value: any) {
  if (value === null || value === undefined || value === "") return "";
  return `R$ ${Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  })}`;
}
