export interface IUser {
  id: number;
  nome: string;
  email: string;
  perfil: string;
}

export interface AuthState {
  user: IUser | null;
  login: (data: ILoginData) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export interface ILoginData {
  email: string;
  senha: string;
}
