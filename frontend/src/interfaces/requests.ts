import { ITokens, IUser } from '.';
import { DevIcon } from '../types';
import { IHistoryPost, IBookmark, IPost, IComment } from '.';
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

export interface IBookmarkRequest {
  bookmarked_posts: IBookmark[];
  message?: string;
  paginator: { page: number; start: number; end: number };
}

export interface IHistoryRequest {
  message?: string;
  pagination: { page: number; has_next_page: boolean };
  previous_posts: IHistoryPost[];
  today_posts: IHistoryPost[];
}
