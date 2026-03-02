export const formatCompanySizeRange = (value: unknown): string => {
  const companySizeRangeMap: Record<string, string> = {
    "1_a_10": "1 a 10",
    "11_a_25": "11 a 25",
    "26_a_50": "26 a 50",
    "51_a_100": "51 a 100",
    "101_a_999": "101 a 999",
    mais_de_1000: "Mais de 1000",
  };

  if (!value || typeof value !== "string") return "-";

  return companySizeRangeMap[value] || value;
};

export const formatContactObjective = (value: unknown): string => {
  const contactObjectiveMap: Record<string, string> = {
    rh_contratar_vr:
      "Sou RH/Empregador e quero contratar a VR na minha empresa",
    estabelecimento_aceitar_vr: "Sou Estabelecimento e quero aceitar VR",
    cliente_mais_info: "Já sou cliente VR e quero mais informações",
    trabalhador_consultar_saldo:
      "Sou Trabalhador e quero consultar meu saldo VR",
  };

  if (!value || typeof value !== "string") return "-";

  return contactObjectiveMap[value] || value;
};
