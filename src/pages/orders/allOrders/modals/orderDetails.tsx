import { Button, ConfigProvider, Input, Modal, Select } from "antd";

import { useEffect, useState } from "react";
import EditOrder from "./components/editOrder";

import {
  IPurchaseResponse,
  IAddItemInChartFunction,
  IChangeStatusCallFunction,
  IPayloadUpdateDataFormValues,
  IPurchase,
  IRemoveItemFunction,
} from "src/interfaces/purchase";
import { DataType } from "src/interfaces/orderModal";
import { IProduct } from "src/interfaces/product";
import InfoPaymentChartPage from "./screen/infoPaymentChartPage";
import { generatePDF } from "../controllers/exportPDF";

export function OrderDetailsModal({
  isModalOpen,
  closeModal,
  dataSource,
  selectedId,
  addItemInChart,
  removeItem,
  changeStatus,
  statusOptions,
  updateData,
  updateDataIdVivoAndConsultorResponsavel,
  devices,
  isDataLoading,
  removeInsurance,
  saveSelectedSeguro,
  changePurchaseChartStatus,
  removeOrder,
  isRemoveOrderFetching,
}: {
  changePurchaseChartStatus: any;
  isModalOpen: boolean;
  closeModal: () => void;
  dataSource: IPurchaseResponse | undefined;
  selectedId: DataType | null;
  addItemInChart: (idProduto: IAddItemInChartFunction) => void;
  devices: IProduct[] | undefined;
  removeItem: IRemoveItemFunction;
  changeStatus: IChangeStatusCallFunction;
  statusOptions: string[] | undefined;
  updateData: (
    pedido_id: string | undefined,
    formValues: IPayloadUpdateDataFormValues,
  ) => void;
  isDataLoading: boolean;
  updateDataIdVivoAndConsultorResponsavel: any;
  saveSelectedSeguro: any;
  removeInsurance: any;
  removeOrder: any;
  isRemoveOrderFetching: boolean;
}) {
  const [showEditOrderLayout, setShowEditOrderLayout] = useState(false);
  const [consultor, setConsultor] = useState<string>("");
  const [idVivo, setIdVivo] = useState<string>("");
  const [idCRM, setIdCRM] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const pedido = dataSource?.pedidos?.find(
      (item: IPurchase) => item?.id === selectedId?.id,
    );
    setConsultor(pedido?.consultor_responsavel || "");
    setIdVivo(pedido?.id_vivo_corp || "");
    setIdCRM(pedido?.id_crm || 0);
  }, [selectedId, dataSource]);

  const pedidoAtual = dataSource?.pedidos?.find(
    (item: IPurchase) => item?.id === selectedId?.id,
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            // contentBg: "#f3f4f6",
            // headerBg: "#fffff",
          },
        },
      }}
    >
      <Modal
        centered
        title={
          <div className="flex  flex-col md:flex-row lg:flex-row gap-4 mg:items-start lg:items-start justify-between">
            <span className="" style={{ color: "#252525" }}>
              Pedido Nº {selectedId?.id}
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
                <div className="flex items-start justify-start self-start gap-4 mr-8">
                  <div className="flex items-center gap-2 ">
                    <span className="text-[14px] font-semibold">
                      Consultor:
                    </span>
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
                        updateDataIdVivoAndConsultorResponsavel(
                          selectedId?.id,
                          {
                            consultor_responsavel: consultor,
                          },
                        );
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2 ">
                    <span className="text-[14px] font-semibold">
                      {" "}
                      ID Vivo:{" "}
                    </span>
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
                        updateDataIdVivoAndConsultorResponsavel(
                          selectedId?.id,
                          {
                            id_vivo_corp: idVivo,
                          },
                        );
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
                        updateDataIdVivoAndConsultorResponsavel(
                          selectedId?.id,
                          {
                            id_crm: idCRM,
                          },
                        );
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-start justify-start gap-4 self-start mr-8">
                  <div className="flex items-center gap-2 ">
                    <span className="text-[14px] font-semibold">Carrinho:</span>
                    <Select
                      size="small"
                      style={{ width: 110 }}
                      value={pedidoAtual?.status}
                      onChange={(value) => {
                        changePurchaseChartStatus({
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
                    <span className="text-[14px] font-semibold">
                      Status do Pedido:{" "}
                    </span>
                    <Select
                      placeholder="Selecione o status"
                      size="small"
                      value={
                        dataSource?.pedidos?.filter(
                          (item: IPurchase) => item?.id === selectedId?.id,
                        )[0]?.status_pos_venda
                      }
                      style={{
                        width: "340px",
                        fontWeight: "400",
                      }}
                      onChange={(value) => {
                        changeStatus({
                          id: selectedId?.id,
                          data: { status_pos_venda: value },
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
                    <span className="font-normal">{pedidoAtual?.equipe}</span>
                  </div>
                </div>
              </ConfigProvider>
            </div>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setShowDeleteModal(false);
          closeModal();
        }}
        footer={null}
        width={1200}
      >
        <div className="flex items-center justify-center gap-2 h-auto md:h-[460px] overflow-y-auto scrollbar-thin">
          {!showEditOrderLayout ? (
            <div className="text-[#666666] min-w-[320px] max-w-[1120px] h-[460px] ">
              {dataSource?.pedidos
                ?.filter((item: IPurchase) => item?.id === selectedId?.id)
                .map((item: IPurchase, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col min-w-[320px] max-w-[1120px] gap-2 p-1 "
                  >
                    <InfoPaymentChartPage
                      updateData={updateData}
                      dataSource={item}
                    />
                  </div>
                ))}
            </div>
          ) : (
            <EditOrder
              addItemInChart={addItemInChart}
              devices={devices}
              dataSource={dataSource}
              selectedId={selectedId}
              updateData={updateData}
              setShowEditOrderLayout={setShowEditOrderLayout}
              isDataLoading={isDataLoading}
              removeItem={removeItem}
              removeInsurance={removeInsurance}
              saveSelectedSeguro={saveSelectedSeguro}
            />
          )}
        </div>

        <div className="mt-4 flex gap-4 justify-end">
          {!showEditOrderLayout && (
            <>
              <Button
                onClick={() =>
                  generatePDF(
                    dataSource?.pedidos?.find(
                      (item: IPurchase) => item?.id === selectedId?.id,
                    ),
                  )
                }
                variant="outlined"
                color="green"
              >
                Gerar PDF
              </Button>

              <Button
                onClick={() => setShowEditOrderLayout(true)}
                color="green"
                variant="outlined"
                style={{
                  color: "#029d23",
                  fontSize: "14px",
                }}
              >
                Editar pedido
              </Button>
              <Button
                onClick={() => setShowDeleteModal(true)}
                color="red"
                variant="outlined"
                style={{
                  color: "red",
                  fontSize: "14px",
                }}
              >
                Deletar pedido
              </Button>
            </>
          )}
        </div>
      </Modal>
      <Modal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger
            loading={isRemoveOrderFetching}
            onClick={() => {
              removeOrder({ id: selectedId?.id });
              setShowDeleteModal(false);
              closeModal();
            }}
          >
            Confirmar exclusão
          </Button>,
        ]}
        title="Confirmar exclusão"
      >
        Tem certeza que deseja excluir o pedido <b>{selectedId?.id}</b>?
      </Modal>
    </ConfigProvider>
  );
}
