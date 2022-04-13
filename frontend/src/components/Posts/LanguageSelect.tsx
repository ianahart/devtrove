import { Select } from '@chakra-ui/react';
import { selectLanguages } from '../../helpers';
import { ILanguageSelectProps } from '../../interfaces';
const LanguageSelect = ({ handleSelectLanguage }: ILanguageSelectProps) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleSelectLanguage(e.target.value);
  };
  return (
    <Select
      onChange={handleOnChange}
      borderColor="purple.secondary"
      color="purple.secondary"
      alignSelf="flex-end"
      width="200px"
      placeholder="Language"
    >
      {selectLanguages.map(({ id, value, alias }) => {
        return (
          <option key={id} value={value}>
            {alias}
          </option>
        );
      })}
    </Select>
  );
};

export default LanguageSelect;
