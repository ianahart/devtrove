import { InputEntryType, ButtonEntryType } from '../types';

export interface IFormField {
  name: string;
  value: string;
  error: string;
}

export interface ILoginForm {
  email: IFormField;
  password: IFormField;
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

export interface IEntryInputProps {
  label: string;
  id: string;
  helperText?: string;
  type: string;
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
}

export interface IGlobalContext {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export interface IInputTheme {
  variants: {
    inputEntry: InputEntryType;
  };
}

export interface IButtonTheme {
  baseStyle: { _focus: { boxShadow: string } };
  variants: {
    entryButton: ButtonEntryType;
  };
}

export interface ILinkTheme {
  baseStyle: {
    _focus: { boxShadow: string; textDecoration: string };
    _hover: { textDecoration: 'none' };
  };
}
