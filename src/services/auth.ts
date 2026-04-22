import { apiPurchase } from "../configs/api";
import { LocalStorageKeys, LocalStorageService } from "./storage";
interface ILoginRequest {
  email: string;
  password: string;
}

interface ILoginApiResponse {
  success: boolean;
  // token: string;
  admin: {
    id: number;
    name: string;
    email: string;
  };
}

interface ILoginResponse {
  // token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

class AuthService {
  async login({ email, password }: ILoginRequest): Promise<ILoginResponse> {
    const response = await apiPurchase.post<ILoginApiResponse>(
      "/benefits/vr/auth/login",
      {
        email,
        password,
      },
    );

    const { success, admin } = response.data;

    if (!success || !admin) {
      throw new Error("Falha na autenticação. Verifique suas credenciais.");
    }

    const localStorageService = new LocalStorageService();
    // localStorageService.setItem(LocalStorageKeys.accessToken, token);
    localStorageService.setItem(LocalStorageKeys.user, JSON.stringify(admin));

    return { user: admin };
  }

  // getAuthToken(): ILoginResponse | null {
  //   const localStorageService = new LocalStorageService();
  //   const token = localStorageService.getItem(LocalStorageKeys.accessToken);
  //   const user = localStorageService.getItem(LocalStorageKeys.user);

  //   if (token && user) {
  //     return { token, user: JSON.parse(user) as ILoginResponse["user"] };
  //   }

  //   return null;
  // }

  getCachedUser() {
    const raw = localStorage.getItem("vr@user");
    return raw ? JSON.parse(raw) : null;
  }

  async me() {
    const cached = this.getCachedUser();
    if (cached) return { user: cached };
    throw new Error("No session endpoint and no cached user.");
  }

  async logout() {
    await apiPurchase.post("/benefits/vr/auth/logout");
    localStorage.removeItem("vr@user");
  }
}

export { AuthService };
