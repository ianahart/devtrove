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
