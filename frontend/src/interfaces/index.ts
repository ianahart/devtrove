import { InputEntryType, DevIcon } from '../types';
import { IUpdateProfileFormRequest, IUpdateSettingRequest } from './requests';

export interface ISearchResult {
  cover_image: string;
  title: string;
  author: string;
  slug: string;
  id: number;
}

export interface IHistoryPost {
  user_id: number;
  post_id: number;
  id: number;
  readable_date: string;
  post: {
    cover_image: string;
    author: string;
    logo: string;
    min_to_read: string;
    slug: string;
    title: string;
  };
}

export interface IHistoryPagination {
  read_count: number;
  page: number;
  has_next_page: boolean;
}

export interface ICommentUser {
  avatar_url: string;
  email: string;
  handle: string;
  id: number;
}
export interface IBookmark {
  post: {
    author: string;
    author_pic: string;
    cover_image: string;
    details_url: string;
    id: number;
    logo: string;
    min_to_read: string;
    published_date: string;
    slug: string;
    snippet: string;
    tags: string[];
    title: string;
  };
  post_id: number;
  id: number;
  user_id: number;
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
  cur_user_bookmarked: boolean;
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
  setting_id: number;
  theme: string;
}

export interface ILanguage {
  snippet: string;
  id: number;
  name: string;
  user_id: number;
}

export interface CalendarDatum {
  day: string;
  value: number;
}

export interface IFullUser<T> extends IUser {
  articles_read: number;
  avatar_url: string;
  bio: string;
  company: string;
  first_name: string;
  count_tags: { [key: string]: number };
  dates: { end: string; start: string };
  github: string;
  calendar: CalendarDatum[];
  job_title: string;
  languages: ILanguage[];
  joined: string;
  last_name: string;
  twitter: string;
  website: string;
}
export interface IUserAuth {
  user: {
    logged_in?: boolean;
    id?: number | null;
    handle?: string | null;
    avatar_url?: string | null;
    setting_id?: number | null;
    theme?: string | null;
  };
  refresh_token: ITokens['refresh_token'] | null | string;
  access_token: ITokens['access_token'] | null | string;
}

export interface IUpdateUser {
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

export interface IGlobalContext {
  isModalOpen: boolean;
  isUserMenuShowing: boolean;
  isSearchOpen: boolean;
  interceptorsLoaded: boolean;
  theme: string;
  toggleUserMenu: () => void;
  closeUserMenu: () => void;
  updateUser: (user: IUpdateProfileFormRequest) => void;
  updateSetting: (theme: IUpdateSettingRequest) => void;
  openModal: () => void;
  closeModal: () => void;
  stowTokens: (tokens: ITokens, user: IUser) => void;
  setIsSearchOpen: (isSearchOpen: boolean) => void;
  setTheme: (theme: string) => void;
  logout: () => void;
  userAuth: IUserAuth;
  setUserAuth: (userAuth: IUserAuth) => void;
  setInterceptorsLoaded: (loaded: boolean) => void;
  handleIsSearchOpen: () => void;
}

export interface IPostsContext {
  posts: IPost[];
  postsError: string;
  scrape: () => void;
  clearPosts: () => void;
  bookmark: (a: number, b: number, c: string) => void;
  addToReadHistory: (user: number, post: number, tags: string[]) => void;
  setIsLoaded: (loaded: boolean) => void;
  setPosts: (posts: any) => void;
  isLoaded: boolean;
  updatePostUpvote: (a: number, b: string) => void;
  fetchPosts: () => void;
}
