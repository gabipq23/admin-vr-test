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
      key: "loja-vr",
      label: (
        <a
          href="https://getempresas.com.br/vr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          VR
        </a>
      ),
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


  const prospectsMenuItems: MenuProps["items"] = [
    {
      key: "prospects-pj",
      label: (
        <span
          onClick={() => {
            setSelectedLink("prospects-pj");
            navigate(`/admin/prospects-pj`);
          }}
        >
          PJ
        </span>
      ),
    },
    {
      key: "prospects-pf",
      label: (
        <span
          onClick={() => {
            setSelectedLink("prospects-pf");
            navigate(`/admin/prospects-pf`);
          }}
        >
          PF
        </span>
      ),
    },
  ];

  return (
    <div className="relative z-2">
      <div className="">
        <div className="flex  justify-between items-center p-2 bg-[#b3b3b3] px-6 md:px-10 lg:px-14">
          <div className="flex items-center gap-8">
            <Dropdown menu={{ items: ordersMenuItems }} placement="bottom">
              <a
                onClick={(e) => e.preventDefault()}
                className={`text-[14px] cursor-pointer text-[#008a1e] hover:text-[#029d23] ${selectedLink === "pedidos-aparelhos"
                  ? "font-bold text-[#029d23]"
                  : ""
                  }`}
              >
                Pedidos
              </a>
            </Dropdown>



            <Dropdown menu={{ items: prospectsMenuItems }} placement="bottom">
              <a
                onClick={(e) => e.preventDefault()}
                className={`text-[14px] cursor-pointer text-[#008a1e] hover:text-[#029d23] ${selectedLink === "prospects-pj"
                  ? "font-bold text-[#029d23]"
                  : ""
                  }`}
              >
                Prospects
              </a>
            </Dropdown>

            <a
              onClick={() => {
                setSelectedLink("contatos");
                navigate(`/admin/contatos`);
              }}
              className={`text-[14px] cursor-pointer text-[#008a1e] hover:text-[#029d23] ${selectedLink === "contatos" ? "font-bold text-[#029d23]" : ""
                }`}
            >
              Mensagens
            </a>

            <Dropdown menu={{ items: chatsMenuItems }} placement="bottom">
              <a className="text-[14px] cursor-pointer text-[#008a1e] hover:text-[#029d23]">
                Chatter
              </a>
            </Dropdown>


            <Dropdown menu={{ items: lpMenuItems }} placement="bottom">
              <a className="text-[14px] cursor-pointer text-[#008a1e] hover:text-[#029d23]">
                LPs
              </a>
            </Dropdown>

            <Dropdown menu={{ items: toolsMenuItems }} placement="bottom">
              <a
                onClick={(e) => e.preventDefault()}
                className={`text-[14px] cursor-pointer text-[#008a1e] hover:text-[#029d23] ${selectedLink === "pj-checker" ||
                  selectedLink === "check-anatel" ||
                  selectedLink === "zap-checker" ||
                  selectedLink === "base2b-empresa" ||
                  selectedLink === "base2b-socio" ||
                  selectedLink === "check-operadora"
                  ? "font-bold text-[#029d23]"
                  : ""
                  }`}
              >
                Tools
              </a>
            </Dropdown>

            {/* <Dropdown menu={{ items: prospectsMenuItems }} placement="bottom">
              <a
                onClick={(e) => e.preventDefault()}
                className={`text-[14px] cursor-pointer text-[#008a1e] hover:text-[#029d23] ${
                  selectedLink === "prospects-pj"
                    ? "font-bold text-[#029d23]"
                    : ""
                }`}
              >
                Prospects
              </a>
            </Dropdown> */}

            {/* <Dropdown menu={{ items: managementMenuItems }} placement="bottom">
              <a className="text-[14px] cursor-pointer text-[#008a1e] hover:text-[#029d23]">
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
