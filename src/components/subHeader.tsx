import { useAuthContext } from "@/pages/login/context";
import { LogoutOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import { Button, Dropdown } from "antd";

export default function SubHeader() {
  const navigate = useNavigate();
  const [selectedLink, setSelectedLink] = useState<string>("pedidos");
  const { logout } = useAuthContext();
  // const user = JSON.parse(localStorage.getItem("vivoGold@user") || "null");
  // const userID = user?.id;

  const handleLogOut = useCallback(() => {
    logout();
    navigate("/admin");
  }, [logout, navigate]);

  const toolsMenuItems: MenuProps["items"] = [
    {
      key: "check-operadora",
      label: (
        <span
          onClick={() => {
            setSelectedLink("check-operadora");
            navigate(`/admin/check-operadora`);
          }}
        >
          Check Operadora
        </span>
      ),
    },
    {
      key: "check-anatel",
      label: (
        <span
          onClick={() => {
            setSelectedLink("check-anatel");
            navigate(`/admin/check-anatel`);
          }}
        >
          Check Anatel
        </span>
      ),
    },
    {
      key: "zap-checker",
      label: (
        <span
          onClick={() => {
            setSelectedLink("zap-checker");
            navigate(`/admin/zap-checker`);
          }}
        >
          Zap Checker
        </span>
      ),
    },
    {
      key: "pj-checker",
      label: (
        <span
          onClick={() => {
            setSelectedLink("pj-checker");
            navigate(`/admin/pj-checker`);
          }}
        >
          Phone Finder
        </span>
      ),
    },
    {
      key: "base2b-socio",
      label: (
        <span
          onClick={() => {
            setSelectedLink("base2b-socio");
            navigate(`/admin/base2b-socio`);
          }}
        >
          Base2B / Busca-sócio
        </span>
      ),
    },
    {
      key: "base2b-empresa",
      label: (
        <span
          onClick={() => {
            setSelectedLink("base2b-empresa");
            navigate(`/admin/base2b-empresa`);
          }}
        >
          Base2B / Busca-empresa
        </span>
      ),
    },
    {
      key: "gender-checker",
      label: (
        <span
          onClick={() => {
            setSelectedLink("gender-checker");
            navigate(`/admin/gender-checker`);
          }}
        >
          Gender Checker
        </span>
      ),
    },
    {
      key: "pf-ou-pj",
      label: (
        <span
          onClick={() => {
            setSelectedLink("pf-ou-pj");
            navigate(`/admin/pf-ou-pj`);
          }}
        >
          PF ou PJ?
        </span>
      ),
    },
    {
      key: "mail-checker",
      label: (
        <span
          onClick={() => {
            setSelectedLink("mail-checker");
            navigate(`/admin/mail-checker`);
          }}
        >
          MailChecker
        </span>
      ),
    },
  ];

  const lpMenuItems: MenuProps["items"] = [
    {
      key: "loja-banda-larga-pf",
      label: (
        <a
          href="https://vivofibra.gold/pf/index.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Banda Larga PF
        </a>
      ),
    },
    {
      key: "loja-banda-larga-pj",
      label: (
        <a
          href="https://vivofibra.gold/pj/index.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Banda Larga PJ
        </a>
      ),
    },
    {
      key: "loja-aparelhos",
      label: (
        <a
          href="https://lojavivo.gold/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Loja Aparelhos
        </a>
      ),
    },
    {
      key: "loja-office-365",
      label: (
        <a
          href="https://new-office-lead.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Office 365
        </a>
      ),
    },
    {
      key: "loja-workspace",
      label: (
        <a
          href="https://new-workspace-lead.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Workspace
        </a>
      ),
    },
    // Novas LPs sem link ainda
    {
      key: "lp-banda-larga-ultra-pf",
      label: <span>Banda Larga - Ultra velocidade PF</span>,
    },
    {
      key: "lp-banda-larga-ultra-pj",
      label: <span>Banda Larga - Ultra velocidade PJ</span>,
    },
    {
      key: "lp-vivo-tv-pf",
      label: <span>Vivo TV PF</span>,
    },
    {
      key: "lp-seguros",
      label: <span>Seguros</span>,
    },
    {
      key: "lp-vivo-movel-pos-pf",
      label: <span>Vivo Móvel-pós PF</span>,
    },
    {
      key: "lp-vivo-movel-pos-pj",
      label: <span>Vivo Móvel-pós PJ</span>,
    },
    {
      key: "lp-vivo-controle",
      label: <span>Vivo Controle</span>,
    },
    {
      key: "lp-vivo-total",
      label: <span>Vivo Total</span>,
    },
    {
      key: "lp-vivo-voz-negocio",
      label: <span>Vivo Voz Negócio</span>,
    },
    {
      key: "lp-vivo-energia",
      label: <span>Vivo Energia</span>,
    },
    {
      key: "lp-internet-dedicada",
      label: <span>Internet Dedicada</span>,
    },
  ];

  // const managementMenuItems: MenuProps["items"] = [
  //   {
  //     key: "usuarios",
  //     label: (
  //       <span
  //         onClick={() => {
  //           setSelectedLink("usuarios");
  //           navigate("/admin/usuarios");
  //         }}
  //       >
  //         Usuários
  //       </span>
  //     ),
  //   },
  //   // {
  //   //   key: "representantes",
  //   //   label: (
  //   //     <span
  //   //       onClick={() => {
  //   //         setSelectedLink("representantes");
  //   //         navigate("/admin/representantes");
  //   //       }}
  //   //     >
  //   //       Representantes
  //   //     </span>
  //   //   ),
  //   // },
  // ];

  const backofficeMenuItems: MenuProps["items"] = [
    {
      key: "faturas",
      label: (
        <span
          onClick={() => {
            setSelectedLink("faturas");
            navigate("/admin/painel-faturas");
          }}
        >
          Faturas
        </span>
      ),
    },
    {
      key: "produtos",
      label: (
        <span
          onClick={() => {
            setSelectedLink("produtos");
            navigate("/admin/painel-produtos");
          }}
        >
          Visão 360
        </span>
      ),
    },
    {
      key: "parque-movel",
      label: (
        <span
          onClick={() => {
            setSelectedLink("parque-movel");
            navigate("/admin/parque-movel");
          }}
        >
          Parque Móvel
        </span>
      ),
    },
    {
      key: "parque-fixo",
      label: (
        <span
          onClick={() => {
            setSelectedLink("parque-fixo");
            navigate("/admin/parque-fixo");
          }}
        >
          Parque Fixo
        </span>
      ),
    },
    {
      key: "consulta-disponibilidade",
      label: (
        <span
          onClick={() => {
            setSelectedLink("consulta-disponibilidade");
            navigate("/admin/consulta-disponibilidade");
          }}
        >
          Disponibilidade
        </span>
      ),
    },
  ];

  const ordersMenuItems: MenuProps["items"] = [
    {
      key: "pedidos-aparelhos-pj",
      label: (
        <span
          onClick={() => {
            setSelectedLink("pedidos-aparelhos-pj");
            navigate(`/admin/pedidos-aparelhos-pj`);
          }}
        >
          Aparelhos
        </span>
      ),
    },
    {
      key: "pedidos-banda-larga-pf",
      label: (
        <span
          onClick={() => {
            setSelectedLink("pedidos-banda-larga-pf");
            navigate(`/admin/pedidos-banda-larga-pf`);
          }}
        >
          Banda Larga PF
        </span>
      ),
    },
    {
      key: "pedidos-banda-larga-pj",
      label: (
        <span
          onClick={() => {
            setSelectedLink("pedidos-banda-larga-pj");
            navigate(`/admin/pedidos-banda-larga-pj`);
          }}
        >
          Banda Larga PJ
        </span>
      ),
    },
    {
      key: "pedidos-office-pj",
      label: (
        <span
          onClick={() => {
            setSelectedLink("pedidos-office-pj");
            navigate(`/admin/pedidos-office-pj`);
          }}
        >
          Office 365
        </span>
      ),
    },
    {
      key: "pedidos-workspace-pj",
      label: (
        <span
          onClick={() => {
            setSelectedLink("pedidos-workspace-pj");
            navigate(`/admin/pedidos-workspace-pj`);
          }}
        >
          Workspace
        </span>
      ),
    },

    {
      key: "pedidos-energia",
      label: (
        <span
          onClick={() => {
            setSelectedLink("pedidos-energia");
            navigate(`/admin/pedidos-energia`);
          }}
        >
          Energia
        </span>
      ),
    },
    // {
    //   key: "pedido-vivo-tech-pj",
    //   label: (
    //     <span
    //       onClick={() => {
    //         setSelectedLink("pedido-vivo-tech-pj");
    //         navigate(`/admin/pedido-vivo-tech-pj`);
    //       }}
    //     >
    //       Pedido Vivo Tech PJ
    //     </span>
    //   ),
    // },
    {
      key: "pedidos-tv",
      label: (
        <span
          onClick={() => {
            setSelectedLink("pedidos-tv");
            navigate(`/admin/pedidos-tv`);
          }}
        >
          TV
        </span>
      ),
    },
  ];

  const productsMenuItems: MenuProps["items"] = [
    {
      key: "estoque-aparelhos",
      label: (
        <span
          onClick={() => {
            setSelectedLink("estoque-aparelhos");
            navigate(`/admin/estoque`);
          }}
        >
          Estoque Aparelhos
        </span>
      ),
    },
    // {
    //   key: "estoque-equipamento",
    //   label: (
    //     <span
    //       onClick={() => {
    //         setSelectedLink("estoque-equipamento");
    //         navigate(`/admin/estoque-equipamento`);
    //       }}
    //     >
    //       Estoque VivoTech
    //     </span>
    //   ),
    // },
    {
      key: "estoque-banda-larga",
      label: (
        <span
          onClick={() => {
            setSelectedLink("planos-banda-larga");
            navigate(`/admin/planos-banda-larga`);
          }}
        >
          Planos Banda Larga
        </span>
      ),
    },
    {
      key: "planos-vivo-total",
      label: (
        <span
          onClick={() => {
            setSelectedLink("planos-vivo-total");
            navigate(`/admin/planos-vivo-total`);
          }}
        >
          Planos Vivo Total
        </span>
      ),
    },

    {
      key: "telefonia-fixa",
      label: (
        <span
          onClick={() => {
            setSelectedLink("telefonia-fixa");
            navigate(`/admin/telefonia-fixa`);
          }}
        >
          Telefonia Fixa
        </span>
      ),
    },
    {
      key: "telefonia-movel",
      label: (
        <span
          onClick={() => {
            setSelectedLink("telefonia-movel");
            navigate(`/admin/telefonia-movel`);
          }}
        >
          Telefonia Móvel
        </span>
      ),
    },
    {
      key: "streaming",
      label: (
        <span
          onClick={() => {
            setSelectedLink("streaming");
            navigate(`/admin/streaming`);
          }}
        >
          Streaming
        </span>
      ),
    },
    {
      key: "tv",
      label: (
        <span
          onClick={() => {
            setSelectedLink("tv");
            navigate(`/admin/tv`);
          }}
        >
          TV
        </span>
      ),
    },
    {
      key: "seguros",
      label: (
        <span
          onClick={() => {
            setSelectedLink("seguros");
            navigate(`/admin/seguros`);
          }}
        >
          Seguros
        </span>
      ),
    },
    {
      key: "energia",
      label: (
        <span
          onClick={() => {
            setSelectedLink("energia");
            navigate(`/admin/energia`);
          }}
        >
          Energia
        </span>
      ),
    },
    // {
    //   key: "produtos-office365",
    //   label: (
    //     <span
    //       onClick={() => {
    //         setSelectedLink("produtos-office365");
    //         navigate(`/admin/produtos-office365`);
    //       }}
    //     >
    //       Office 365
    //     </span>
    //   ),
    // },
    // {
    //   key: "produtos-workspace",
    //   label: (
    //     <span
    //       onClick={() => {
    //         setSelectedLink("produtos-workspace");
    //         navigate(`/admin/produtos-workspace`);
    //       }}
    //     >
    //       Workspace
    //     </span>
    //   ),
    // },
  ];
  const chatsMenuItems: MenuProps["items"] = [
    {
      key: "chats",
      label: (
        <span
          onClick={() => {
            setSelectedLink("chats");
            navigate(`/admin/chats`);
          }}
        >
          Chat
        </span>
      ),
    },
    {
      key: "evolution",
      label: (
        <span
          onClick={() => {
            setSelectedLink("evolution");
            navigate(`/admin/evolution`);
          }}
        >
          Conectar Conta
        </span>
      ),
    },
  ];

  const clientsMenuItems: MenuProps["items"] = [
    {
      key: "clientes-pj",
      label: (
        <span
          onClick={() => {
            setSelectedLink("clientes-pj");
            navigate(`/admin/clientes-pj`);
          }}
        >
          PJ
        </span>
      ),
    },
    {
      key: "clientes-pf",
      label: (
        <span
          onClick={() => {
            setSelectedLink("clientes-pf");
            navigate(`/admin/clientes-pf`);
          }}
        >
          PF
        </span>
      ),
    },
  ];

  // // const prospectsMenuItems: MenuProps["items"] = [
  // //   {
  // //     key: "prospects-pj",
  // //     label: (
  // //       <span
  // //         onClick={() => {
  // //           setSelectedLink("prospects-pj");
  // //           navigate(`/admin/prospects-pj`);
  // //         }}
  // //       >
  // //         PJ
  // //       </span>
  // //     ),
  // //   },
  // //   {
  // //     key: "prospects-pf",
  // //     label: (
  // //       <span
  // //         onClick={() => {
  // //           setSelectedLink("prospects-pf");
  // //           navigate(`/admin/prospects-pf`);
  // //         }}
  // //       >
  // //         PF
  // //       </span>
  // //     ),
  // //   },
  // // ];

  return (
    <div className="relative z-2">
      <div className="">
        <div className="flex  justify-between items-center p-2 bg-[#44066b] px-6 md:px-10 lg:px-14">
          <div className="flex items-center gap-8">
            <Dropdown menu={{ items: ordersMenuItems }} placement="bottom">
              <a
                onClick={(e) => e.preventDefault()}
                className={`text-[14px] cursor-pointer text-neutral-300 hover:text-neutral-100 ${
                  selectedLink === "pedidos-aparelhos"
                    ? "font-bold text-neutral-100"
                    : ""
                }`}
              >
                Pedidos
              </a>
            </Dropdown>
            <Dropdown menu={{ items: productsMenuItems }} placement="bottom">
              <a
                onClick={(e) => e.preventDefault()}
                className={`text-[14px] cursor-pointer text-neutral-300 hover:text-neutral-100 ${
                  selectedLink === "estoque-aparelhos"
                    ? "font-bold text-neutral-100"
                    : ""
                }`}
              >
                Produtos
              </a>
            </Dropdown>
            <Dropdown menu={{ items: clientsMenuItems }} placement="bottom">
              <a
                onClick={(e) => e.preventDefault()}
                className={`text-[14px] cursor-pointer text-neutral-300 hover:text-neutral-100 ${
                  selectedLink === "clientes-pj"
                    ? "font-bold text-neutral-100"
                    : ""
                }`}
              >
                Clientes
              </a>
            </Dropdown>
            {/* 
            <Dropdown menu={{ items: prospectsMenuItems }} placement="bottom">
              <a
                onClick={(e) => e.preventDefault()}
                className={`text-[14px] cursor-pointer text-neutral-300 hover:text-neutral-100 ${
                  selectedLink === "prospects-pj"
                    ? "font-bold text-neutral-100"
                    : ""
                }`}
              >
                Prospects
              </a>
            </Dropdown> */}

            <a
              onClick={() => {
                setSelectedLink("contatos");
                navigate(`/admin/contatos`);
              }}
              className={`text-[14px] cursor-pointer text-neutral-300 hover:text-neutral-100 ${
                selectedLink === "contatos" ? "font-bold text-neutral-100" : ""
              }`}
            >
              Mensagens
            </a>

            <Dropdown menu={{ items: chatsMenuItems }} placement="bottom">
              <a className="text-[14px] cursor-pointer text-neutral-300 hover:text-neutral-100">
                Chatter
              </a>
            </Dropdown>

            <a
              onClick={() => {
                setSelectedLink("book-de-ofertas");
                navigate(`/admin/book-de-ofertas`);
              }}
              className={`text-[14px] cursor-pointer text-neutral-300 hover:text-neutral-100 ${
                selectedLink === "book-de-ofertas"
                  ? "font-bold text-neutral-100"
                  : ""
              }`}
            >
              Book de Ofertas
            </a>
            <Dropdown menu={{ items: lpMenuItems }} placement="bottom">
              <a className="text-[14px] cursor-pointer text-neutral-300 hover:text-neutral-100">
                LPs
              </a>
            </Dropdown>
            <Dropdown menu={{ items: backofficeMenuItems }} placement="bottom">
              <a
                onClick={(e) => e.preventDefault()}
                className={`text-[14px] cursor-pointer text-neutral-300 hover:text-neutral-100 ${
                  selectedLink === "faturas" || selectedLink === "produtos"
                    ? "font-bold text-neutral-100"
                    : ""
                }`}
              >
                Backoffice
              </a>
            </Dropdown>
            <Dropdown menu={{ items: toolsMenuItems }} placement="bottom">
              <a
                onClick={(e) => e.preventDefault()}
                className={`text-[14px] cursor-pointer text-neutral-300 hover:text-neutral-100 ${
                  selectedLink === "pj-checker" ||
                  selectedLink === "check-anatel" ||
                  selectedLink === "zap-checker" ||
                  selectedLink === "base2b-empresa" ||
                  selectedLink === "base2b-socio" ||
                  selectedLink === "check-operadora"
                    ? "font-bold text-neutral-100"
                    : ""
                }`}
              >
                Tools
              </a>
            </Dropdown>

            {/* <Dropdown menu={{ items: prospectsMenuItems }} placement="bottom">
              <a
                onClick={(e) => e.preventDefault()}
                className={`text-[14px] cursor-pointer text-neutral-300 hover:text-neutral-100 ${
                  selectedLink === "prospects-pj"
                    ? "font-bold text-neutral-100"
                    : ""
                }`}
              >
                Prospects
              </a>
            </Dropdown> */}

            {/* <Dropdown menu={{ items: managementMenuItems }} placement="bottom">
              <a className="text-[14px] cursor-pointer text-neutral-300 hover:text-neutral-100">
                Gestão
              </a>
            </Dropdown> */}
          </div>

          <div className="flex items-center gap-4">
            {/* <Button
              type="link"
              onClick={() => navigate(`/admin/perfil-usuario/${userID}`)}
              style={{ padding: 0 }}
              className="logout-btn "
            >
              <UserOutlined style={{ color: "#e4e0e0" }} />
            </Button> */}
            <Button
              type="link"
              onClick={handleLogOut}
              style={{ padding: 0 }}
              className="logout-btn "
            >
              <LogoutOutlined style={{ color: "#e4e0e0" }} />
            </Button>
            <style>
              {`
              .logout-btn:hover .anticon {
                color: #ffffff !important;
                font-size: 15px;
              }
            
              `}
            </style>
          </div>
        </div>
      </div>
    </div>
  );
}
