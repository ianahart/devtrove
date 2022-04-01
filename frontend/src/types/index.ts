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

export type DevIcon = {
  id: number;
  name: string;
  snippet: string;
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
