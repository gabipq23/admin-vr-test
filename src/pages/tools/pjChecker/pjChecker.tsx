import { SearchOutlined } from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button, ConfigProvider, Form, Input, Tooltip } from "antd";
// import { usePJCheckerFilterController } from "./controller/filterController";

export default function PJChecker() {
  const queryClient = new QueryClient();
  // const { tableColumns, styles } = usePJCheckerFilterController();

  // const exemploResultado = {
  //   ddd: "61",
  //   numero: "61994527594",
  //   status: "OK",
  //   anatel: "Válido",
  //   tipo: "Móvel",
  //   uf: "DF",
  //   municipio: "BRASILIA",
  //   pj: true,
  //   cnpj: "12.345.678/0001-90",
  //   razaoSocial: "EMPRESA EXEMPLO LTDA",
  //   porte: "Médio",
  //   rfb: "Ativa",
  //   cs: "1000,00",
  //   socios: [
  //     { nome: "João da Silva", cpf: "123.456.789-00", isADM: true },
  //     { nome: "Maria Oliveira", cpf: "987.654.321-00", isADM: false },
  //     { nome: "Carlos Pereira", cpf: "456.789.123-11" },
  //   ],
  // };
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col px-6 md:px-10 lg:px-14 pt-4 h-[calc(100vh-160px)]">
          <div className="flex w-full justify-between mt-3 pb-4">
            <h1 className="text-[22px]">Phone Finder</h1>
          </div>

          <div>
            <ConfigProvider
              theme={{
                components: {
                  Input: {
                    activeBorderColor: "#029d23",
                    hoverBorderColor: "#029d23",
                  },
                },
              }}
            >
              <Form>
                <div className="flex ">
                  <Form.Item name="numero">
                    <Input
                      className="h-8"
                      size="middle"
                      style={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                      placeholder="Digite aqui um CNPJ"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      //   loading={isLoading}
                      style={{
                        backgroundColor: "#029d23",
                        color: "white",
                        borderColor: "#000000",
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        height: "32px",
                      }}
                    >
                      <SearchOutlined /> Consultar
                    </Button>
                  </Form.Item>
                  <ConfigProvider
                    theme={{
                      components: {
                        Button: {
                          colorBorder: "#029d23",
                          colorText: "#029d23",
                          colorPrimary: "#029d23",
                          colorPrimaryHover: "#029d23",
                        },
                      },
                    }}
                  >
                    <div className="ml-2">
                      <Tooltip
                        title="Limpar consulta"
                        placement="top"
                        styles={{ body: { fontSize: "12px" } }}
                      >
                        <Button className="w-6 h-6">X</Button>
                      </Tooltip>
                    </div>
                  </ConfigProvider>
                </div>
              </Form>
            </ConfigProvider>
          </div>

          {/* <div className="hidden md:block overflow-y-auto ">
            <Table<any>
              rowKey="id"
              dataSource={exemploResultado ? [exemploResultado] : []}
              // loading={isLoading}
              className={styles.customTable}
              columns={tableColumns}
              pagination={false}
            />
          </div> */}
        </div>
      </QueryClientProvider>
    </>
  );
}
