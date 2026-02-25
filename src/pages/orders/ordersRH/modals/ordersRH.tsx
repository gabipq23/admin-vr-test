import { ConfigProvider, Modal, Form } from "antd";
import { useState, useEffect } from "react";
import { OrderBandaLargaPFDisplay } from "./RHDisplay";
import { OrderBandaLargaPFEdit } from "./RHEdit";
import HeaderInputs from "./headerInputs";
import dayjs from "dayjs";
import ConfirmDeleteModal from "@/components/confirmDeleteModal";
import FooterButtons from "@/components/orders/footerButtons";
import { generatePDF } from "../controllers/exportPDF";

export function OrderBandaLargaPFDetailsModal({
  isModalOpen,
  closeModal,
  selectedId,
  updateOrderData,
  removeOrderData,
  isRemoveOrderFetching,
  updateDataIdVivoAndConsultorResponsavel,
  changeBandaLargaOrderStatus,

  statusOptions,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedId: any | null;
  updateOrderData?: (params: { id: number; data: any }) => void;
  removeOrderData: any;
  isRemoveOrderFetching: boolean;
  updateDataIdVivoAndConsultorResponsavel: any;
  changeBandaLargaOrderStatus: any;

  statusOptions: string[] | undefined;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localData, setLocalData] = useState<any | null>(null);
  const [form] = Form.useForm();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [consultor, setConsultor] = useState<string>("");
  const [idVivo, setIdVivo] = useState<string>("");
  const [idCRM, setIdCRM] = useState<number>(0);
  const [credito, setCredito] = useState<number | string>(0);

  useEffect(() => {
    if (selectedId) {
      setLocalData(selectedId);
    }
  }, [selectedId]);




  useEffect(() => {
    setConsultor(localData?.consultor_responsavel || "");
    setIdVivo(localData?.id_vivo_corp || "");
    setIdCRM(localData?.id_crm || 0);
    setCredito(localData?.credito || 0);
  }, [selectedId, localData]);

  useEffect(() => {
    if (localData && isEditing) {
      form.setFieldsValue({
        plan_id: localData.plan?.id || "",
        plan_name: localData.plan?.name || "",
        plan_price: localData.plan?.price?.toString() || "",
        fullname: localData.fullname,
        cpf: localData.cpf,
        birthdate: localData.birthdate,
        motherfullname: localData.motherfullname,
        phone: localData.phone,
        phoneAdditional: localData.phoneAdditional,
        email: localData.email,
        address: localData.address,
        addressnumber: localData.addressnumber,
        addresscomplement: localData.addresscomplement,
        addresslot: localData.addresslot,
        addressFloor: localData.addressFloor,
        addressblock: localData.addressblock,
        buildingorhouse: localData.buildingorhouse,
        district: localData.district,
        city: localData.city,
        state: localData.state,
        cep: localData.cep,
        addressreferencepoint: localData.addressreferencepoint,
        cep_unico: localData.cep_unico,
        installation_preferred_date_one:
          localData.installation_preferred_date_one
            ? dayjs(localData.installation_preferred_date_one, "DD/MM/YYYY")
            : null,

        installation_preferred_date_two:
          localData.installation_preferred_date_two
            ? dayjs(localData.installation_preferred_date_two, "DD/MM/YYYY")
            : null,

        installation_preferred_period_one:
          localData.installation_preferred_period_one,

        installation_preferred_period_two:
          localData.installation_preferred_period_two,

        dueday: localData.dueday,
        accept_offers: localData.accept_offers,
        terms_accepted: localData.terms_accepted,
        url: localData.url,
        status: localData.status,
      });
    }
  }, [localData, isEditing, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();



      if (values.installation_preferred_date_one) {
        values.installation_preferred_date_one = dayjs(
          values.installation_preferred_date_one,
        ).format("DD/MM/YYYY");
      }
      if (values.installation_preferred_date_two) {
        values.installation_preferred_date_two = dayjs(
          values.installation_preferred_date_two,
        ).format("DD/MM/YYYY");
      }
      const formattedData: any = {
        pedido: {
          ...values,
        },
      };



      if (updateOrderData && localData && localData.id) {
        await updateOrderData({
          id: localData.id,
          data: formattedData,
        });

        setLocalData((prev) => (prev ? { ...prev, ...values } : null));
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Erro ao validar campos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  if (!localData) return null;

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            hoverBorderColor: "#029d23",
            activeBorderColor: "#029d23",
            activeShadow: "none",
            colorBorder: "#bfbfbf",
            colorTextPlaceholder: "#666666",
          },
          Select: {
            hoverBorderColor: "#029d23",
            activeBorderColor: "#029d23",
            activeOutlineColor: "none",
            colorBorder: "#bfbfbf",
            colorTextPlaceholder: "#666666",
          },
          Button: {
            colorBorder: "#029d23",
            colorText: "#029d23",
            colorPrimary: "#029d23",
            colorPrimaryHover: "#883fa2",
          },
        },
      }}
    >
      <Modal
        centered
        title={
          <HeaderInputs
            updateOrderData={updateOrderData}
            localData={localData}
            setLocalData={setLocalData}
            selectedId={selectedId}
            updateDataIdVivoAndConsultorResponsavel={
              updateDataIdVivoAndConsultorResponsavel
            }
            statusOptions={statusOptions}
            changeBandaLargaOrderStatus={changeBandaLargaOrderStatus}
            consultor={consultor}
            setConsultor={setConsultor}
            idVivo={idVivo}
            setIdVivo={setIdVivo}
            idCRM={idCRM}
            setIdCRM={setIdCRM}
            credito={credito}
            setCredito={setCredito}
          />
        }
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={1200}
      >
        <div className="text-[#666666] mt-4 h-[460px] overflow-y-auto scrollbar-thin">
          {isEditing ? (
            <OrderBandaLargaPFEdit
              localData={localData}
              form={form}
              handleSave={handleSave}
              handleCancel={handleCancel}
              loading={loading}
            />
          ) : (
            <OrderBandaLargaPFDisplay
              localData={localData}
              updateOrderData={updateOrderData}
            />
          )}
        </div>
        <div className="mt-4 flex gap-4 justify-end">
          {!isEditing && (
            <FooterButtons
              onGeneratePDF={() => generatePDF(localData)}
              onEdit={() => setIsEditing(true)}
              onDelete={() => setShowDeleteModal(true)}
            />
          )}
        </div>
      </Modal>
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          removeOrderData({ id: selectedId?.id });
          closeModal();
        }}
        isLoading={isRemoveOrderFetching}
        message="Tem certeza que deseja excluir o pedido"
        itemToDelete={selectedId?.ordernumber || selectedId?.id}
      />
    </ConfigProvider>
  );
}
