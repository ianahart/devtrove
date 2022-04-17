import { IconType } from 'react-icons';
import { DevIcon, InputEntryType, ButtonEntryType, TAvatar } from '../types';
import { LanguageCrud, Like } from '../types/index';
import { PlacementWithLogical } from '@chakra-ui/react';
import { IPost, IFormField, IComment } from '.';

export interface ICommentProps {
  post: IPost;
  commentsLoaded: boolean;
  comments: IComment[];
  handlePagination: () => void;
  handleCommentOperation: () => void;
  likeComment: (a: Like) => void;
  unlikeComment: (a: number) => void;
  syncEdit: (id: number) => void;
}

export interface ISingleCommentProps {
  comment: IComment;
  handleCommentOperation: () => void;
  syncEdit: (id: number) => void;
  likeComment: (a: Like) => void;
  unlikeComment: (a: number) => void;
}

export interface IFileUploaderProps {
  saveAvatar: (file: TAvatar<File>) => void;
  avatar: TAvatar<File>;
  handleAvatarError: (error: string, active: boolean) => void;
}

export interface IActionsProps {
  id: number;
  slug: string;
  updatePostUpvote?: (id: number, dir: string) => void | undefined;
  comments_count: number;
  upvotes_count: number;
  cur_user_voted: boolean;
}

export interface ILanguageSelectProps {
  handleSelectLanguage: (language: string) => void;
}

export interface IPostProps {
  post: IPost;
  updatePostUpvote?: (id: number, dir: string) => void | undefined;
}

export interface IPostsProps {
  posts: IPost[];
  updatePostUpvote: (id: number, dir: string) => void;
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
  writeMode: string;
  clearCommentError: () => void;
  addComment: () => void;
  editComment: () => void;
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