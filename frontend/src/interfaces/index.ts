import { InputEntryType, DevIcon } from '../types';
import { IUpdateProfileFormRequest, IUpdateSettingRequest } from './requests';

export interface IMessage {
  avatar_url: string;
  handle: string;
  message: string;
  readable_date: string;
  room: string;
  user: number;
}

export interface IGroupData {
  title: string;
  cover_image: string;
  post_id: number | null;
  host: number | null;
  slug: string;
  user_id: number | null;
  count: string;
  group_id: number | null;
  id: number | null;
  group_title: string;
}

export interface IInvite {
  host: number;
  id: number;
  handle: string;
}

export interface ISearchResult {
  cover_image: string;
  title: string;
  author: string;
  slug: string;
  id: number;
}

export interface IInvitation {
  accepted: boolean;
  avatar_url: string;
  group: number;
  title: string;
  handle: string;
  host: number;
  pk: number;
  user: number;
}

export interface IPagination {
  has_next: boolean;
  page: number;
}

export interface ICheckedPost {
  id: number;
  checked: boolean;
}

export interface ICoverFormProps {
  postId: number | null;
}

export interface CreateTag {
  id: string;
  tag: string;
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

export interface IPasswordFormContainerProps {
  endpoint: string;
  refresh_token: string;
  btnText: string;
  title: string;
  helperText: string;
  extraField: boolean;
}

export interface IPasswordForm {
  newpassword: IFormField;
  confirmpassword: IFormField;
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
    is_checked: false;
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
  is_checked: boolean;
  comments_count: number;
  type: string;
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
  preferred_language: boolean;
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
    preferred_language?: boolean;
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

export interface IGroup {
  id: number;
  avatar: string;
  group_user: number;
  host: number;
  post: number;
  title: string;
  group_id: string;
}

export interface IGroupUser {
  avatar_url: string;
  group_id: string;
  host: number;
  group_user: number;
  id: number;
  post: number;
  title: string;
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
  updateSetting: (theme: string, name: string) => void;
  openModal: () => void;
  closeModal: () => void;
  stowTokens: (tokens: ITokens, user: IUser) => void;
  updatePreferredLanguage: (data: boolean, name: string) => void;
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
  updateCheckedPost: (id: number, checked: boolean) => void;
  pagination: { page: number; has_next: boolean };
  scrape: () => void;
  clearPosts: () => void;
  paginatePosts: () => void;
  bookmark: (a: number, b: number, c: string) => void;
  toggleCheckAllPosts: (checked: boolean) => void;
  addToReadHistory: (user: number, post: number, tags: string[]) => void;
  deleteCheckedPosts: (ids: number[]) => void;
  setIsLoaded: (loaded: boolean) => void;
  checkedPostsList: () => number[];
  setPosts: (posts: any) => void;
  someCheckedPosts: () => boolean;
  isLoaded: boolean;
  updatePostUpvote: (a: number, b: string) => void;
  fetchPosts: () => void;
}

export interface IGroupsContext {
  groups: IGroup[];
  addGroup: (group: IGroup) => void;
  getGroups: () => void;
  pagGroups: () => void;
  groupError: string;
  resetGroups: () => void;
  disbandGroup: (groupdId: string, userIds: number[]) => void;
  removeGroup: (groupId: string, userId: number) => void;
  groupPag: IPagination;
  getInvitations: () => void;
  invitations: IInvitation[];
  pagInvitations: () => void;
  invitationPag: IPagination;
  resetInvitations: () => void;
  denyInvitation: (id: number) => void;
  acceptInvitation: (groupId: number, userId: number, invitationId: number) => void;
}
