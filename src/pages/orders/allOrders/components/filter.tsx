import { Controller, Control, UseFormHandleSubmit } from "react-hook-form";
import { Input, Select, Button, Tooltip, ConfigProvider } from "antd";
import { DownloadOutlined, FilterOutlined } from "@ant-design/icons";
import { IFilters } from "src/interfaces/purchase";
import ptBR from "antd/es/locale/pt_BR";
interface FiltroPedidosFormProps {
  control: Control<IFilters>;
  handleSubmit: UseFormHandleSubmit<IFilters>;
  onSubmit: (data: IFilters) => void;
  onClear: () => void;
  selectedRowKeys: any;
  statusOptions?: string[];
  productsFilteredQuery?: any;
}
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { PatternFormat, PatternFormatProps } from "react-number-format";
import { handleExportXLSX } from "../controllers/exportXLSX";

const CNPJInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="##.###.###/####-##"
    customInput={Input}
    placeholder="CNPJ"
    size="middle"
    allowEmptyFormatting
  />
);
export function FiltroPedidosForm({
  control,
  handleSubmit,
  onSubmit,
  onClear,
  statusOptions,
  selectedRowKeys,
  productsFilteredQuery,
}: FiltroPedidosFormProps) {
  const { RangePicker } = DatePicker;

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
                hoverBorderColor: "#660099",
                activeBorderColor: "#660099",
                activeShadow: "none",
              },
              Select: {
                hoverBorderColor: "#660099",
                activeBorderColor: "#660099",
                activeOutlineColor: "none",
                optionSelectedBg: "#e6e6e6",
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
              // <Input
              //   {...field}
              //   placeholder="CNPJ"
              //   value={field.value || ""}
              //   onChange={field.onChange}
              //   style={{
              //     width: "130px",
              //   }}
              //   maxLength={14}
              // />

              <CNPJInput
                {...field}
                format="##.###.###/####-##"
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
                placeholder="Razão Social"
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
            name="status"
            render={({ field }) => (
              <Select
                mode="multiple"
                style={{ minWidth: "120px" }}
                placeholder="Carrinho"
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
            name="status_pos_venda"
            render={({ field }) => (
              <Select
                style={{
                  width: "240px",
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
          <Controller
            control={control}
            name="equipe"
            render={({ field }) => (
              <Select
                style={{
                  width: "90px",
                }}
                placeholder="Equipe"
                value={field.value || undefined}
                onChange={field.onChange}
                options={[
                  { value: "eco", label: "ECO" },
                  { value: "brasil", label: "BRASIL" },
                ]}
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
                handleExportXLSX(productsFilteredQuery, selectedRowKeys)
              }
            >
              <DownloadOutlined />
            </Button>
          </Tooltip>
        </div>
      </div>
    </form>
  );
}
