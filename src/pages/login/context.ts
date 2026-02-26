import { AuthService } from "@/services/auth";
import { create } from "zustand";
import { AuthState, ILoginData } from "@/interfaces/login";

const authService = new AuthService();
const initialAuth = authService.getAuthToken();

export const useAuthContext = create<AuthState>((set) => ({
  user: initialAuth?.user ?? null,
  login: async ({ email, senha }: ILoginData) => {
    const res = await authService.login({ email, senha });
    set({ user: res?.user ?? null });
  },
  logout: () => {
    set({ user: null });
    void authService.logout();
  },

  checkAuth: () => {
    const res = authService.getAuthToken();
    set({ user: res?.user ?? null });
  },
}));
