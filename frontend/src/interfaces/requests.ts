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

export interface IUpdateUserRequest {
  email?: string;
  handle?: string;
  last_name?: string;
  first_name?: string;
  job_title?: string;
  company?: string;
  bio?: string;
  website?: string;
  id?: number;
  github?: string;
  twitter?: string;
  avatar_url?: string;
  avatar?: File;
  languages?: DevIcon[];
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
