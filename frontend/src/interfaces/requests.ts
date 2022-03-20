import { ITokens, IUser } from '.';

export interface IRegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmpassword: string;
}

export interface ILogoutRequest {
  id: number;
}

export interface ILoginRequest {
  message?: string;
  tokens: ITokens;
  user: IUser;
}

export interface IAxiosError<T> {
  data: T;
}
