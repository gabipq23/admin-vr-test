import { AuthService } from "@/services/auth";
import { create } from "zustand";
import { AuthState, ILoginData } from "@/interfaces/login";

const authService = new AuthService();
const initialAuth = authService.getAuthToken();

export const useAuthContext = create<AuthState>((set) => ({
  user: initialAuth?.user ?? null,
  login: async ({ email, password }: ILoginData) => {
    const res = await authService.login({ email, password });
    set({ user: res?.user ?? null });
  },
  logout: () => {
    set({ user: null });
  },

  checkAuth: () => {
    const res = authService.getAuthToken();
    set({ user: res?.user ?? null });
  },
}));
