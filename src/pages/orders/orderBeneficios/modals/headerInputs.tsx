import { ConfigProvider, Select } from "antd";

export default function HeaderInputs(
  //   {
  //   localData,
  //   setLocalData,
  //   selectedId,
  //   changeBandaLargaOrderStatus,
  //   statusOptions,
  //   updateOrderData,
  // }: any
) {
  return (
    <>
      <div className="flex  flex-col md:flex-row lg:flex-row gap-4 mg:items-start lg:items-start justify-between">
        <span style={{ color: "#252525" }}>
          Pedido Nº
          {/* {localData.ordernumber || localData.id} */}
        </span>
        <div className="flex flex-col  flex-wrap items-center gap-4 ">
          <ConfigProvider
            theme={{
              components: {
                Select: {
                  hoverBorderColor: "#029d23",
                  activeBorderColor: "#029d23",
                  activeOutlineColor: "none",
                },
                Input: {
                  hoverBorderColor: "#029d23",
                  activeBorderColor: "#029d23",
                },
              },
            }}
          >


            <div className="flex items-start justify-start gap-4 self-start mr-8">
              <div className="flex items-center gap-2 ">
                <span className="text-[14px] font-semibold">Pedido:</span>
                <Select
                  size="small"
                  style={{ width: 110 }}
                  // value={localData?.status}
                  // onChange={(value) => {
                  //   setLocalData((prev: any) =>
                  //     prev ? { ...prev, status: value } : null,
                  //   );
                  //   changeBandaLargaOrderStatus({
                  //     id: selectedId?.id,
                  //     data: { status: value },
                  //   });
                  // }}
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
                  // value={localData?.status_pos_venda}
                  style={{
                    width: "340px",
                    fontWeight: "400",
                  }}
                // onChange={(value) => {
                //   setLocalData((prev: any) =>
                //     prev ? { ...prev, status_pos_venda: value } : null,
                //   );
                //   updateOrderData({
                //     id: selectedId?.id,
                //     data: { pedido: { status_pos_venda: value } },
                //   });
                // }}
                // options={statusOptions?.map((status: string) => ({
                //   value: status,
                //   label: status,
                // }))}
                />
              </div>

            </div>


          </ConfigProvider>
        </div>
      </div>
    </>
  );
}
