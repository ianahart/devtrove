import { IconType } from 'react-icons';
import { DevIcon, InputEntryType, ButtonEntryType, TAvatar } from '../types';
import { LanguageCrud } from '../types/index';
import { PlacementWithLogical } from '@chakra-ui/react';
export interface IFileUploaderProps {
  saveAvatar: (file: TAvatar<File>) => void;
  avatar: TAvatar<File>;
  handleAvatarError: (error: string, active: boolean) => void;
}

export interface ICommentUser {
  avatar_url: string;
  email: string;
  handle: string;
  id: number;
}

export interface IComment {
  code_snippet: string;
  created_at: string;
  language: string;
  id: number;
  post_id: number;
  readable_date: string;
  text: string;
  user: ICommentUser;
}

export interface IActionsProps {
  id: number;
  slug: string;
}

export interface ILanguageSelectProps {
  handleSelectLanguage: (language: string) => void;
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
  id: number;
  logo: string;
  min_to_read: string;
  published_date: string;
  tags: string[];
  title: string;
  slug: string;
}

export interface IPostProps {
  post: IPost;
}

export interface IPostsProps {
  posts: IPost[];
}

export interface IMenuItemProps {
  to: string;
  linkText: string;
  icon: IconType;
}

export interface IAccountInnerMenuItemProps extends IMenuItemProps {
  activeTab: string;
  menu?: string;
  handleSetActiveTab: (a: string) => void;
}

export interface ILanguageProps {
  addLanguage: LanguageCrud;
  removeLanguage: LanguageCrud;
  formLoaded: boolean;
  myIcons: DevIcon[];
  icons: DevIcon[];
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

export interface IFooterProps {
  name: string;
  year: number;
}

export interface ICommentFormProps {
  post: IPost;
  codeField: IFormField;
  commentField: IFormField;
  commentError: string;
  language: string;
  clearCommentError: () => void;
  addComment: () => void;
  handleSelectLanguage: (a: string) => void;
  captureInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface IFormInputProps {
  label: string;
  id?: string;
  helperText?: string;
  type: string;
  name: string;
  error: string;
  value: string;
  active?: boolean;
  captureInput: (name: string, value: string) => void;
}

export interface IActionProps {
  icon: IconType;
  label: string;
  placement: PlacementWithLogical | undefined;
  color: string;
}

export interface IFormTextareaProps {
  label: string;
  id: string;
  name: string;
  error: string;
  value: string;
  active?: boolean;
  captureInput: (name: string, value: string) => void;
}

export interface ILogoProps {
  textOne: string;
  textTwo: string;
  height: string;
  width: string;
  fontSize: string;
}

export interface IBasicModalProps {
  children?: React.ReactNode;
  resetForm?: () => void;
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
