import { Control, Controller, UseFormHandleSubmit } from "react-hook-form";
import { Input, Button, Tooltip, ConfigProvider, Select } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useState } from "react";
import CreateUserModal from "../modals/createUser";

interface FiltroUsersFormProps {
  control: Control<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  onSubmit: (data: any) => void;
  onClear: () => void;
  isFiltered: boolean;
  createUser: any;
}

export function FiltroUsersForm({
  createUser,
  control,
  handleSubmit,
  onSubmit,
  onClear,
}: FiltroUsersFormProps) {
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

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
                  hoverBorderColor: "#660099",
                  activeBorderColor: "#660099",
                  activeShadow: "none",
                },
                Select: {
                  hoverBorderColor: "#660099",
                  activeBorderColor: "#660099",
                  activeOutlineColor: "none",
                },
                DatePicker: {
                  hoverBorderColor: "#660099",
                  activeBorderColor: "#660099",
                  colorPrimaryBorder: "#660099",
                  colorPrimary: "#660099",
                },
              },
            }}
          >
            <Controller
              control={control}
              name="nome"
              render={({ field }) => (
                <Input
                  style={{
                    width: "140px",
                  }}
                  {...field}
                  placeholder="Nome"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  style={{
                    width: "160px",
                  }}
                  {...field}
                  placeholder="Email"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="nivel_acesso"
              render={({ field }) => (
                <Select
                  style={{
                    width: "140px",
                  }}
                  placeholder="Nível de Acesso"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={[
                    { value: "Gold", label: "Gold" },
                    { value: "Master", label: "Master" },
                    { value: "Gerente", label: "Gerente" },
                    { value: "Líder", label: "Líder" },
                    { value: "Consultor", label: "Consultor" },
                    { value: "Parceiro", label: "Parceiro" },
                  ]}
                  allowClear
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
              color="purple"
              style={{
                width: "24px",
                height: "28px",
                color: "#660099",
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
              color="purple"
              onClick={onClear}
              style={{ width: "24px", height: "28px", color: "#660099" }}
            >
              X
            </Button>
          </Tooltip>
          <Tooltip
            title="Adicionar Usuário"
            placement="top"
            styles={{ body: { fontSize: "12px" } }}
          >
            <Button
              variant="outlined"
              color="purple"
              onClick={() => setShowCreateUserModal(true)}
              style={{ width: "24px", height: "28px", color: "#660099" }}
            >
              +
            </Button>
          </Tooltip>
        </div>
      </form>
      <CreateUserModal
        createUser={createUser}
        showCreateUserModal={showCreateUserModal}
        setShowCreateUserModal={setShowCreateUserModal}
      />
    </>
  );
}
