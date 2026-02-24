import { IContact } from "@/interfaces/contacts";
import { Button, ConfigProvider, Pagination } from "antd";
import { useNavigate } from "react-router-dom";

const getMobileRow = (title: string, value: any) => {
  return (
    <div className="flex justify-between">
      <span className="font-semibold text-[#666]">{title}:</span>
      <span className="text-right">{value}</span>
    </div>
  );
};

function MobileCard({
  contacts,
  setSelectedContact,
  showModal,
  currentPage,
  pageSize,
  totalItems,
}: {
  contacts: IContact[] | undefined;
  setSelectedContact: (order: IContact) => void;
  showModal: () => void;
  currentPage: number;
  pageSize: number;
  totalItems: number;
}) {
  const navigate = useNavigate();
  return (
    <>
      <div className="block md:hidden">
        {Array.isArray(contacts) &&
          contacts?.map((contact: IContact, index: number) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-4 mb-4 text-[14px] flex flex-col gap-2"
            >
              {getMobileRow("ID do Pedido", contact.id)}
              {getMobileRow("Nome", contact.nome)}
              {getMobileRow("Email", contact.email)}
              {getMobileRow("CNPJ", contact.cnpj)}
              {getMobileRow("Assunto", contact.assunto)}
              {getMobileRow("Data de Criação", contact.data_criacao)}

              <div className="flex justify-center mt-2">
                <Button
                  onClick={() => {
                    setSelectedContact(contact);
                    showModal();
                  }}
                  color="purple"
                  variant="link"
                  className="w-full"
                >
                  Ver mais
                </Button>
              </div>
            </div>
          ))}
      </div>
      <div className="flex justify-center mt-4 md:hidden">
        <ConfigProvider
          theme={{
            components: {
              Pagination: {
                colorPrimaryBorder: "#660099",
                colorPrimary: "#660099",
                colorPrimaryHover: "#550088",
              },
            },
          }}
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            showSizeChanger={true}
            onChange={(page, pageSize) => {
              const params = new URLSearchParams(window.location.search);
              params.set("page", page.toString());
              params.set("limit", pageSize.toString());
              navigate(`?${params.toString()}`);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </ConfigProvider>
      </div>
    </>
  );
}

export default MobileCard;
