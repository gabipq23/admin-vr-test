import { Controller, Control, UseFormHandleSubmit } from "react-hook-form";
import { Input, Button, Tooltip, ConfigProvider, Select } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { IFilters } from "src/interfaces/purchase";
import ptBR from "antd/es/locale/pt_BR";
interface FiltroPedidosFormProps {
  control: Control<IFilters>;
  handleSubmit: UseFormHandleSubmit<IFilters>;
  onSubmit: (data: IFilters) => void;
  onClear: () => void;

  statusOptions?: string[];
}
import { PatternFormat, PatternFormatProps } from "react-number-format";

const CPFInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="###.###.###-##"
    customInput={Input}
    placeholder="CPF"
    size="middle"
    allowEmptyFormatting
  />
);
export function FiltroProspectsForm({
  control,
  handleSubmit,
  onSubmit,
  onClear,
}: FiltroPedidosFormProps) {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onReset={onClear}
      className="flex min-w-[200px] flex-wrap gap-2 mb-4"
    >
      <div className="flex gap-2 flex-wrap">
        <ConfigProvider
          locale={ptBR}
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
            name="id"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="ID do Pedido"
                value={field.value || ""}
                onChange={field.onChange}
                style={{
                  width: "115px",
                }}
                maxLength={13}
              />
            )}
          />

          <Controller
            control={control}
            name="cnpj"
            render={({ field }) => (
              <CPFInput
                {...field}
                format="###.###.###-##"
                value={field.value || ""}
                onValueChange={(values) => field.onChange(values.value)}
                style={{ width: "150px" }}
              />
            )}
          />
          <Controller
            control={control}
            name="razao_social"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Nome"
                value={field.value || ""}
                onChange={field.onChange}
                style={{
                  width: "170px",
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="telefone"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Telefone"
                value={field.value || ""}
                onChange={field.onChange}
                style={{
                  width: "110px",
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="demanda"
            render={({ field }) => (
              <Select
                style={{ width: "150px" }}
                placeholder="Demanda"
                value={field.value ?? undefined}
                onChange={field.onChange}
                allowClear
              >
                <Select.Option value="nova_linha">Nova Linha</Select.Option>
                <Select.Option value="seguro">Seguro</Select.Option>
                <Select.Option value="reserva_iphone_17">
                  Reserva iPhone 17
                </Select.Option>
              </Select>
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
      </div>
    </form>
  );
}
