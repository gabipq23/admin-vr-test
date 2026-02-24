import { ConfigProvider, Input, Select } from "antd";

export default function HeaderInputs({
  localData,
  setLocalData,
  selectedId,
  updateDataIdVivoAndConsultorResponsavel,
  changeBandaLargaOrderStatus,
  consultor,
  setConsultor,
  idVivo,
  setIdVivo,
  idCRM,
  setIdCRM,
  statusOptions,
  updateOrderData,
  setCredito,
  credito,
}: any) {
  return (
    <>
      <div className="flex  flex-col md:flex-row lg:flex-row gap-4 mg:items-start lg:items-start justify-between">
        <span style={{ color: "#252525" }}>
          Pedido Nº {localData.ordernumber || localData.id}
        </span>
        <div className="flex flex-col  flex-wrap items-center gap-4 ">
          <ConfigProvider
            theme={{
              components: {
                Select: {
                  hoverBorderColor: "#660099",
                  activeBorderColor: "#660099",
                  activeOutlineColor: "none",
                },
                Input: {
                  hoverBorderColor: "#660099",
                  activeBorderColor: "#660099",
                },
              },
            }}
          >
            <div className="flex items-start justify-start self-start gap-4 mr-8">
              <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold">Consultor:</span>
                <Input
                  size="small"
                  placeholder="Consultor"
                  style={{
                    width: "240px",
                    fontWeight: "400",
                  }}
                  maxLength={13}
                  value={consultor}
                  onChange={(e) => setConsultor(e.target.value)}
                  onPressEnter={() => {
                    updateDataIdVivoAndConsultorResponsavel(selectedId?.id, {
                      consultor_responsavel: consultor,
                    });
                  }}
                />
              </div>
              <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold"> ID Vivo: </span>
                <Input
                  size="small"
                  value={idVivo}
                  placeholder="ID Vivo"
                  style={{
                    width: "150px",
                    fontWeight: "400",
                  }}
                  maxLength={13}
                  onChange={(e) => setIdVivo(e.target.value)}
                  onPressEnter={() => {
                    updateDataIdVivoAndConsultorResponsavel(selectedId?.id, {
                      id_vivo_corp: idVivo,
                    });
                  }}
                />
              </div>

              <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold"> ID CRM: </span>
                <Input
                  size="small"
                  value={idCRM}
                  placeholder="ID CRM"
                  style={{
                    width: "120px",
                    fontWeight: "400",
                  }}
                  maxLength={8}
                  onChange={(e) => setIdCRM(Number(e.target.value))}
                  onPressEnter={() => {
                    updateDataIdVivoAndConsultorResponsavel(selectedId?.id, {
                      id_crm: idCRM,
                    });
                  }}
                />
              </div>
            </div>

            <div className="flex items-start justify-start gap-4 self-start mr-8">
              <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold">Pedido:</span>
                <Select
                  size="small"
                  style={{ width: 110 }}
                  value={localData?.status}
                  onChange={(value) => {
                    setLocalData((prev: any) =>
                      prev ? { ...prev, status: value } : null,
                    );
                    changeBandaLargaOrderStatus({
                      id: selectedId?.id,
                      data: { status: value },
                    });
                  }}
                  options={[
                    { value: "aberto", label: "Aberto" },
                    { value: "fechado", label: "Fechado" },
                    { value: "cancelado", label: "Cancelado" },
                  ]}
                />
              </div>
              <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold">Tramitação: </span>
                <Select
                  placeholder="Selecione o status"
                  size="small"
                  value={localData?.status_pos_venda}
                  style={{
                    width: "340px",
                    fontWeight: "400",
                  }}
                  onChange={(value) => {
                    setLocalData((prev: any) =>
                      prev ? { ...prev, status_pos_venda: value } : null,
                    );
                    updateOrderData({
                      id: selectedId?.id,
                      data: { pedido: { status_pos_venda: value } },
                    });
                  }}
                  options={statusOptions?.map((status: string) => ({
                    value: status,
                    label: status,
                  }))}
                />
              </div>
              <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold">Equipe:</span>
                <span className="font-normal">{selectedId?.equipe || "-"}</span>
              </div>
            </div>

            <div className="flex items-start justify-start gap-4 self-start mr-8">
              <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold">Crédito:</span>
                <Input
                  size="small"
                  value={credito}
                  placeholder="Crédito"
                  style={{
                    width: "110px",
                    fontWeight: "400",
                  }}
                  maxLength={13}
                  onChange={(e) => setCredito(e.target.value)}
                  onPressEnter={() => {
                    updateDataIdVivoAndConsultorResponsavel(selectedId?.id, {
                      credito: credito,
                    });
                  }}
                />
              </div>
              <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold">Atendimento: </span>
                <Select
                  placeholder=""
                  size="small"
                  value={localData?.atendimento}
                  style={{
                    width: "200px",
                    fontWeight: "400",
                  }}
                  onChange={(value) => {
                    setLocalData((prev: any) =>
                      prev ? { ...prev, atendimento: value } : null,
                    );
                    updateOrderData({
                      id: selectedId?.id,
                      data: { pedido: { atendimento: value } },
                    });
                  }}
                  options={[
                    { value: "em_andamento", label: "Em Andamento" },
                    { value: "concluido", label: "Concluído" },
                  ]}
                />
              </div>
              <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold">Instalação:</span>
                <span className="font-normal">
                  {selectedId?.instalacao || "-"}
                </span>
              </div>
            </div>
          </ConfigProvider>
        </div>
      </div>
    </>
  );
}
