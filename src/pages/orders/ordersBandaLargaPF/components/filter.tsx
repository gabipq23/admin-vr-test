import { Controller, Control, UseFormHandleSubmit } from "react-hook-form";
import {
  Input,
  Button,
  Tooltip,
  ConfigProvider,
  Select,
  Dropdown,
  Checkbox,
} from "antd";
import { FilterOutlined, DownloadOutlined } from "@ant-design/icons";
import ptBR from "antd/es/locale/pt_BR";
import { DatePicker } from "antd";
import { PatternFormat, PatternFormatProps } from "react-number-format";
import dayjs from "dayjs";
import { handleExportXLSX } from "../controllers/exportXLSX";
import { BandaLargaFilters } from "@/interfaces/bandaLargaPF";
import { customLocale } from "@/utils/customLocale";

interface FiltroPedidosFormProps {
  control: Control<BandaLargaFilters>;
  handleSubmit: UseFormHandleSubmit<BandaLargaFilters>;
  onSubmit: (data: BandaLargaFilters) => void;
  onClear: () => void;
  selectedRowKeys: any;
  statusOptions?: string[];
  orderBandaLargaPF: any;
  planBLPFStock: any;
  allColumnOptions: any[];
  visibleColumns: string[];
  handleColumnsChange: (checked: string[]) => void;
  tableColumns: any;
}

const CPFInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="###.###.###-##"
    customInput={Input}
    placeholder="CPF"
    size="middle"
  />
);
export function FiltroOrdersBandaLargaPFForm({
  control,
  handleSubmit,
  onSubmit,
  onClear,
  statusOptions,
  selectedRowKeys,
  orderBandaLargaPF,
  planBLPFStock,
  allColumnOptions,
  visibleColumns,
  handleColumnsChange,
}: FiltroPedidosFormProps) {
  const { RangePicker } = DatePicker;

  const uniquePlans = Array.isArray(planBLPFStock)
    ? Array.from(
        new Map(
          planBLPFStock.map((plan: any) => [plan.plan_name, plan]),
        ).values(),
      )
    : [];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onReset={onClear}
      className="flex justify-between items-center  min-w-[200px] flex-wrap  gap-2 "
    >
      <div className="flex gap-2 items-center flex-wrap ">
        <div className="flex gap-2 flex-wrap">
          <ConfigProvider
            locale={ptBR}
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
              name="ordernumber"
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
              name="status"
              render={({ field }) => (
                <Select
                  mode="multiple"
                  style={{ minWidth: "120px" }}
                  placeholder="Pedido"
                  value={field.value?.length ? field.value : []}
                  onChange={field.onChange}
                  options={[
                    { value: "aberto", label: "Aberto" },
                    { value: "fechado", label: "Fechado" },
                    { value: "cancelado", label: "Cancelado" },
                  ]}
                  allowClear
                />
              )}
            />
            <Controller
              control={control}
              name="initial_status"
              render={({ field }) => (
                <Select
                  mode="multiple"
                  style={{ minWidth: "130px" }}
                  placeholder="Status inicial"
                  value={field.value?.length ? field.value : []}
                  onChange={field.onChange}
                  options={[
                    { value: "consulta", label: "Consulta" },
                    { value: "pedido", label: "Pedido" },
                  ]}
                  allowClear
                />
              )}
            />
            <Controller
              control={control}
              name="availability"
              render={({ field }) => (
                <Select
                  style={{ minWidth: "120px" }}
                  placeholder="Disponibilidade"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={[
                    { value: true, label: "Disponível" },
                    { value: false, label: "Indisponível" },
                  ]}
                  allowClear
                />
              )}
            />
            <Controller
              control={control}
              name="cpf"
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
              name="phone"
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
              name="plan"
              render={({ field }) => (
                <Select
                  style={{ minWidth: "200px" }}
                  placeholder="Plano"
                  value={field.value?.length ? field.value : []}
                  onChange={field.onChange}
                  options={uniquePlans.map((plan: any) => ({
                    value: plan.plan_name,
                    label: plan.plan_name,
                  }))}
                  allowClear
                />
              )}
            />
            <Controller
              control={control}
              name="status_pos_venda"
              render={({ field }) => (
                <Select
                  style={{
                    width: "300px",
                  }}
                  placeholder="Status do Pedido"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  options={statusOptions?.map((status: string) => ({
                    value: status,
                    label: status,
                  }))}
                  allowClear
                />
              )}
            />
            {/* Período de datas: data_de (início) e data_ate (fim) */}
            <Controller
              control={control}
              name="data_de"
              render={({ field: fieldDe }) => (
                <Controller
                  control={control}
                  name="data_ate"
                  render={({ field: fieldAte }) => (
                    <RangePicker
                      style={{
                        width: "215px",
                      }}
                      value={
                        fieldDe.value && fieldAte.value
                          ? [
                              fieldDe.value
                                ? dayjs(decodeURIComponent(fieldDe.value))
                                : null,
                              fieldAte.value
                                ? dayjs(decodeURIComponent(fieldAte.value))
                                : null,
                            ]
                          : [null, null]
                      }
                      format="DD/MM/YYYY"
                      onChange={(dates) => {
                        fieldDe.onChange(
                          dates && dates[0]
                            ? encodeURIComponent(
                                dates[0].startOf("day").format("YYYY-MM-DD"),
                              )
                            : null,
                        );
                        fieldAte.onChange(
                          dates && dates[1]
                            ? encodeURIComponent(
                                dates[1].endOf("day").format("YYYY-MM-DD"),
                              )
                            : null,
                        );
                      }}
                      allowClear
                      placeholder={["de", "até"]}
                    />
                  )}
                />
              )}
            />
          </ConfigProvider>
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
              title="Download"
              placement="top"
              styles={{ body: { fontSize: "11px" } }}
            >
              <Button
                variant="outlined"
                color="purple"
                style={{ width: "24px", height: "28px", color: "#660099" }}
                onClick={() =>
                  handleExportXLSX(orderBandaLargaPF, selectedRowKeys)
                }
              >
                <DownloadOutlined />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div></div>
      <div className="flex  justify-end ">
        <ConfigProvider
          locale={customLocale}
          theme={{
            components: {
              Checkbox: {
                colorPrimary: "#660099",
                colorPrimaryHover: "#660099",
                borderRadius: 4,
                controlInteractiveSize: 18,
                lineWidth: 2,
              },
              Button: {
                colorBorder: "#660099",
                colorText: "#660099",
                colorPrimaryHover: "#cb1ef5",
                colorPrimaryBorderHover: "#cb1ef5",
              },
            },
          }}
        >
          <div className="flex justify-end">
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              dropdownRender={() => (
                <div
                  style={{
                    width: 240,
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    padding: 12,
                    maxHeight: 300,
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                  <div className="hide-scrollbar">
                    <Checkbox.Group
                      options={allColumnOptions}
                      value={visibleColumns}
                      onChange={handleColumnsChange}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    />
                  </div>
                </div>
              )}
            >
              <Button>Selecionar Colunas</Button>
            </Dropdown>
          </div>
        </ConfigProvider>
      </div>
    </form>
  );
}
