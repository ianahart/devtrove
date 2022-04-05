export type InputEntryType = {
  field: {
    border: string;
    color: string;
    width: string;
    backgroundColor: string;
    _focus: {
      boxShadow: string;
    };
  };
};

export type LanguageCrud = (icon: DevIcon, languages: DevIcon[]) => void;

export type DevIcon = {
  id: number | string;
  name: string;
  snippet: string;
  user_id?: number;
};

export type TAvatar<T> = {
  data: T | Blob | null;
  url: string | null;
};

export type ButtonEntryType = {
  backgroundColor: string;
  minWidth: string[];
  transition: string;
  cursor: string;
  textTransform: string;
  color: string;
  _hover: {
    backgroundColor: string;
  };
};
