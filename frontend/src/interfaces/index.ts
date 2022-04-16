import { InputEntryType } from '../types';

export interface ICommentUser {
  avatar_url: string;
  email: string;
  handle: string;
  id: number;
}

export interface IComment {
  code_snippet: string;
  created_at: string;
  edited: boolean;
  cur_user_liked: boolean;
  likes_count: number;
  language: string;
  id: number;
  post_id: number;
  readable_date: string;
  text: string;
  user: ICommentUser;
}

export interface ISelectLanguage {
  id: number;
  value: string;
  alias: string;
}

export interface IPost {
  author: string;
  cover_image: string;
  snippet: string;
  details_url: string;
  comments_count: number;
  upvotes_count: number;
  cur_user_voted: boolean;
  id: number;
  logo: string;
  min_to_read: string;
  published_date: string;
  tags: string[];
  title: string;
  slug: string;
}

export interface ITokens {
  access_token: string;
  refresh_token: string;
}

export interface IFormField {
  name: string;
  value: string;
  error: string;
}

export interface ILoginForm {
  email: IFormField;
  password: IFormField;
}

export interface IProfileForm {
  first_name: IFormField;
  last_name: IFormField;
  email: IFormField;
  handle: IFormField;
  job_title: IFormField;
  company: IFormField;
  bio: IFormField;
  twitter: IFormField;
  website: IFormField;
  github: IFormField;
}

export interface IRegisterForm {
  email: IFormField;
  username: IFormField;
  password: IFormField;
  confirmpassword: IFormField;
}

export interface IUser {
  logged_in?: boolean;
  id?: number | null;
  handle?: string | null;
}

export interface IUserAuth {
  user: {
    logged_in?: boolean;
    id?: number | null;
    handle?: string | null;
    avatar_url?: string | null;
  };
  refresh_token: ITokens['refresh_token'] | null | string;
  access_token: ITokens['access_token'] | null | string;
}

export interface IGlobalContext {
  isModalOpen: boolean;
  isUserMenuShowing: boolean;
  interceptorsLoaded: boolean;
  toggleUserMenu: () => void;
  closeUserMenu: () => void;
  openModal: () => void;
  closeModal: () => void;
  stowTokens: (tokens: ITokens, user: IUser) => void;
  logout: () => void;
  userAuth: IUserAuth;
  setUserAuth: (userAuth: IUserAuth) => void;
  setInterceptorsLoaded: (loaded: boolean) => void;
}

export interface IInputTheme {
  variants: {
    inputEntry: InputEntryType;
  };
}

export interface ILinkTheme {
  baseStyle: {
    _focus: { boxShadow: string; textDecoration: string };
    _hover: { textDecoration: 'none' };
  };
}
