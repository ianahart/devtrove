export interface IRegisterResponse {
  email: string;
  username: string;
  password: string;
  confirmpassword: string;
}

export interface IAxiosError<T> {
  data: T;
}
