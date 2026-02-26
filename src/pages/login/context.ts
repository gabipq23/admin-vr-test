import { AuthService } from "@/services/auth";
import { create } from "zustand";
import { AuthState, ILoginData } from "@/interfaces/login";

const authService = new AuthService();
const initialAuth = authService.getAuthToken();

export const useAuthContext = create<AuthState>((set, _get, state) => ({
  user: initialAuth?.user ?? null,
  login: async ({ email, senha }: ILoginData) => {
    const res = await authService.login({ email, senha });
    set({ user: res?.user ?? null });
  },
  logout: () => {
    authService.logout();
    set(state.getInitialState());
  },

  checkAuth: () => {
    const res = authService.getAuthToken();
    set({ user: res?.user ?? null });
  },
}));
