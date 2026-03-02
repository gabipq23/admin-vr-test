export interface IUser {
  id: number;
  name: string;
  email: string;
  nome?: string;
  perfil?: string;
}

export interface AuthState {
  user: IUser | null;
  login: (data: ILoginData) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export interface ILoginData {
  email: string;
  password: string;
}
