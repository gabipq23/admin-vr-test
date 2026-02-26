import { Button, ConfigProvider, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./context";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
interface ILoginForm {
  email: string;
  senha: string;
}

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const { control, handleSubmit } = useForm<ILoginForm>();

  const mutation = useMutation<void, Error, ILoginForm>({
    mutationFn: (data: ILoginForm) => login(data),
    onSuccess: () => {
      navigate("/admin/pedidos-aparelhos-pj");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.erro ||
        "Erro ao realizar login";

      toast.error(`${errorMessage}`);

      console.error("Erro ao consultar produtos:", error);
    },
  });

  function onSubmit(data: ILoginForm) {
    mutation.mutate(data);
  }

  return (
    <div className=" flex flex-col items-center bg-neutral-100 justify-center h-screen ">
      <div className="flex flex-col md:w-[400px] lg:w-[400px] bg-[#a3a3a3]  justify-start gap-10 shadow-lg  rounded-lg p-6 h-[400px]">
        <div className="flex justify-center items-center">

          <img
            src="\assets\logo-vr.png"
            className="h-18 hover:cursor-pointer"
          ></img>
        </div>
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
              Button: {
                colorBorder: "#029d23",
                colorText: "#029d23",
                colorPrimary: "#029d23",
                colorPrimaryHover: "#883fa2",
              },
            },
          }}
        >
          <div className="flex flex-col gap-2">
            <form
              onSubmit={handleSubmit((data) => {
                onSubmit(data);
              })}
              className="flex flex-col gap-5"
            >
              <p className="text-[14px] text-neutral-200">Email: </p>

              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input {...field} placeholder="Digite seu email" />
                )}
              />
              <p className="text-[14px] text-neutral-200">Senha: </p>

              <Controller
                name="senha"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input.Password {...field} placeholder="Digite sua senha" />
                )}
              />
              <div className="flex justify-center mt-4">
                <Button variant="outlined" color="green" htmlType="submit">
                  Entrar
                </Button>
              </div>
            </form>
          </div></ConfigProvider>
      </div>
    </div>
  );
}
