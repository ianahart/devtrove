import { ITokens, IUser } from '.';
import { DevIcon } from '../types';
import { IPost, IComment } from '.';
export interface IRegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmpassword: string;
}

export interface IPostRequest {
  data: IPost[];
}

export interface ICommentsRequest {
  message?: string;
  page: number;
  has_next_page: boolean;
  comments: IComment[];
}

export interface ILogoutRequest {
  id: number;
}

export interface IUpdateProfileFormRequest {
  user_auth: {
    user: {
      logged_in?: boolean;
      id?: number | null;
      handle?: string | null;
      avatar_url?: string | null;
    };
  };
}

export interface ILoginRequest {
  message?: string;
  tokens: ITokens;
  user: IUser;
}

export interface IAxiosError<T> {
  data: T;
}
