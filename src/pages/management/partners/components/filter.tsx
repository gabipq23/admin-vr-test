import { Control, Controller, UseFormHandleSubmit } from "react-hook-form";
import { Input, Button, Tooltip, ConfigProvider } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useState } from "react";
import CreatePartnerModal from "../modals/createPartner";
interface FiltroPartnersFormProps {
  control: Control<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  onSubmit: (data: any) => void;
  onClear: () => void;
  isFiltered: boolean;
  createPartner: any;
}

export function FiltroPartnersForm({
  createPartner,
  control,
  handleSubmit,
  onSubmit,
  onClear,
}: FiltroPartnersFormProps) {
  const [showCreatePartnerModal, setShowCreatePartnerModal] = useState(false);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onReset={onClear}
        className="flex min-w-[200px] flex-wrap  gap-2 mb-4"
      >
        <div className="flex gap-2 flex-wrap">
          <ConfigProvider
            theme={{
              components: {
                Input: {
                  hoverBorderColor: "#029d23",
                  activeBorderColor: "#029d23",
                  activeShadow: "none",
                },
                Select: {
                  hoverBorderColor: "#029d23",
                  activeBorderColor: "#029d23",
                  activeOutlineColor: "none",
                },
                DatePicker: {
                  hoverBorderColor: "#029d23",
                  activeBorderColor: "#029d23",
                  colorPrimaryBorder: "#029d23",
                  colorPrimary: "#029d23",
                },
              },
            }}
          >
            <Controller
              control={control}
              name="cnpj"
              render={({ field }) => (
                <Input
                  style={{
                    width: "140px",
                  }}
                  {...field}
                  placeholder="CNPJ"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="razao_social"
              render={({ field }) => (
                <Input
                  style={{
                    width: "160px",
                  }}
                  {...field}
                  placeholder="Razão Social"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
          </ConfigProvider>
        </div>

        <div className="flex gap-2 items-center">
          <Tooltip
            title="Filtrar"
            placement="top"
            styles={{ body: { fontSize: "11px" } }}
          >
            <Button
              variant="outlined"
              color="green"
              style={{
                width: "24px",
                height: "28px",
                color: "#029d23",
              }}
              htmlType="submit"
            >
              <FilterOutlined />
            </Button>
          </Tooltip>

          <Tooltip
            title="Limpar filtro"
            placement="top"
            styles={{ body: { fontSize: "11px" } }}
          >
            <Button
              variant="outlined"
              color="green"
              onClick={onClear}
              style={{ width: "24px", height: "28px", color: "#029d23" }}
            >
              X
            </Button>
          </Tooltip>
          <Tooltip
            title="Adicionar Representante"
            placement="top"
            styles={{ body: { fontSize: "12px" } }}
          >
            <Button
              variant="outlined"
              color="green"
              onClick={() => setShowCreatePartnerModal(true)}
              style={{ width: "24px", height: "28px", color: "#029d23" }}
            >
              +
            </Button>
          </Tooltip>
        </div>
      </form>
      <CreatePartnerModal
        createPartner={createPartner}
        showCreatePartnerModal={showCreatePartnerModal}
        setShowCreatePartnerModal={setShowCreatePartnerModal}
      />
    </>
  );
}
