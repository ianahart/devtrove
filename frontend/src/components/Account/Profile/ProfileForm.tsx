import { Box, Button, Heading, Icon, Text } from '@chakra-ui/react';
import { useState, useContext } from 'react';
import { AiOutlineCloseCircle, AiOutlineTwitter, AiOutlineGithub } from 'react-icons/ai';
import axios, { AxiosError } from 'axios';
import { http } from '../../../helpers';
import FormInput from '../../Forms/FormInput';
import FileUploader from '../../Forms/FileUploader';
import { TAvatar } from '../../../types';
import { IProfileForm, IGlobalContext } from '../../../interfaces';
import { IUpdateUserRequest } from '../../../interfaces/requests';
import FormTextarea from '../../Forms/FormTextarea';
import { GlobalContext } from '../../../context/global';
import Languages from './Languages';
import { DevIcon } from '../../../types/index';

const ProfileForm = () => {
  const initialForm = {
    email: { name: 'email', value: '', error: '' },
    handle: { name: 'handle', value: '', error: '' },
    last_name: { name: 'last_name', value: '', error: '' },
    first_name: { name: 'first_name', value: '', error: '' },
    job_title: { name: 'job_title', value: '', error: '' },
    company: { name: 'company', value: '', error: '' },
    bio: { name: 'bio', value: '', error: '' },
    website: { name: 'website', value: '', error: '' },
    github: { name: 'github', value: '', error: '' },
    twitter: { name: 'twitter', value: '', error: '' },
  };
  const { userAuth } = useContext(GlobalContext) as IGlobalContext;
  const [isLoaded, setIsLoaded] = useState(false);
  const [avatar, setAvatar] = useState<TAvatar<File>>({ data: null, url: null });
  const [languages, setLanguages] = useState<DevIcon[]>([]);
  const [form, setForm] = useState(initialForm);
  const [avatarError, setAvatarError] = useState({ msg: '', active: false });
  const saveAvatar = (fileObj: TAvatar<File>) => {
    setAvatar(fileObj);
  };

  const addLanguage = (language: DevIcon) => {
    setLanguages((prevState) => [...prevState, language]);
  };

  const removeLanguage = (selectedLanguage: DevIcon) => {
    const filteredLanguages = [...languages].filter(
      (language) => language.id !== selectedLanguage.id
    );
    setLanguages(filteredLanguages);
  };

  const handleAvatarError = (error: string, active: boolean) => {
    setAvatarError({ msg: error, active });
  };

  const applyValidationMessages = <T extends Array<object | []>>(data: T) => {
    if (!data) return;
    data
      .filter((error) => Object.keys(error).length > 0)
      .forEach((error, index) => {
        const [key, value] = Object.entries(error)[0];
        if (key === 'avatar') {
          handleAvatarError(value[0], true);
        } else {
          setForm((prevState) => ({
            ...prevState,
            [key]: { ...prevState[key as keyof IProfileForm], error: value[0] },
          }));
        }
      });
  };

  const captureInput = (name: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof IProfileForm], value },
    }));
  };

  const pullFormValues = (form: IProfileForm) => {
    const formValues: { [key: string]: string } = {};
    for (const [key, field] of Object.entries({ ...form })) {
      formValues[key] = field.value;
    }
    return formValues;
  };

  const prepareFormData = () => {
    const formValues = pullFormValues(form);
    const formData = new FormData();
    if (avatar.data) {
      formData.append('avatar', avatar.data);
    }
    formData.append('form', JSON.stringify(formValues));
    formData.append('languages', JSON.stringify(languages));
    return formData;
  };

  const clearPrevErrors = () => {
    const clearedForm: IProfileForm = Object.assign({}, form);
    for (let outerKey in clearedForm) {
      clearedForm[outerKey as keyof IProfileForm]['error'] = '';
    }
    setForm(clearedForm);
    setAvatarError({ msg: '', active: false });
  };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      if (avatarError.active) return;

      const formData = prepareFormData();
      const clearedForm: IProfileForm = Object.assign({}, form);
      clearPrevErrors();

      const response = await http.patch<IUpdateUserRequest>(
        `account/${userAuth.user.id}/`,
        formData,
        {
          headers: { 'content-type': 'multipart/form-data' },
        }
      );
      if (response.status === 200) {
        console.log(response);
        setIsLoaded(true);
      }
    } catch (e: unknown | AxiosError) {
      setIsLoaded(false);
      if (axios.isAxiosError(e)) {
        console.log(e);
        console.log(e.response);
        applyValidationMessages(e.response?.data?.errors);
      }
    }
  };
  const handleClearAvatar = (avatar: TAvatar<File>, error: string, active: boolean) => {
    setAvatar(avatar);
    handleAvatarError(error, active);
  };

  return (
    <>
      <Box as="header" p="0.5rem">
        <Heading p="0.5rem" as="h3" fontSize="24px" color="#FFF">
          Edit Profile
        </Heading>
        <Text
          fontWeight="100"
          color="text.primary"
          lineHeight="1.6"
          mt="1rem"
          width="300px"
          fontSize="14px"
        >
          All profile information is completely optional and will not effect your
          experience on the site.
        </Text>
      </Box>
      <Box maxWidth={['100%', '100%', '980px']} margin="0 auto">
        <form onSubmit={handleOnSubmit} id="profileForm" encType="multipart/form-data">
          <Box my="3rem" display="flex" justifyContent="center" position="relative">
            <FileUploader
              handleAvatarError={handleAvatarError}
              avatar={avatar}
              saveAvatar={saveAvatar}
            />
            {avatar?.url && (
              <Icon
                onClick={() => handleClearAvatar({ data: null, url: null }, '', false)}
                cursor="pointer"
                role="button"
                as={AiOutlineCloseCircle}
                color="#FFF"
                height="30px"
                width="30px"
              />
            )}
          </Box>
          {avatarError.active && (
            <Text my="0.5rem" textAlign="center" fontSize="16px" color="purple.secondary">
              {avatarError.msg}
            </Text>
          )}

          <Text my="0.5rem" fontSize="22px" color="purple.secondary">
            Basic
          </Text>
          <Box
            my="3rem"
            width="100%"
            alignItems={['center']}
            flexDir={['column', 'column', 'row']}
            justifyContent={['space-around']}
            margin="0 auto"
            display="flex"
          >
            <Box width={['100%', '100%', '45%']}>
              <FormInput
                id="first_name"
                type="text"
                active={true}
                value={form.first_name.value}
                captureInput={captureInput}
                error={form.first_name.error}
                label="First Name:"
                name="first_name"
              />
            </Box>
            <Box width={['100%', '100%', '45%']}>
              <FormInput
                id="last_name"
                type="text"
                active={true}
                value={form.last_name.value}
                captureInput={captureInput}
                error={form.last_name.error}
                label="Last Name:"
                name="last_name"
              />
            </Box>
          </Box>
          <Box my="3rem">
            <FormInput
              id="handle"
              type="text"
              active={true}
              value={form.handle.value}
              captureInput={captureInput}
              error={form.handle.error}
              label="Username:"
              name="handle"
            />
          </Box>
          <Box my="3rem">
            <FormInput
              id="email"
              type="email"
              active={true}
              value={form.email.value}
              captureInput={captureInput}
              helperText="* Changing your email will log you out. You can log back in with your new email."
              error={form.email.error}
              label="Email:"
              name="email"
            />
          </Box>
          <Text my="0.5rem" fontSize="22px" color="purple.secondary">
            About
          </Text>
          <Box my="3rem">
            <FormInput
              id="job_title"
              type="text"
              active={true}
              value={form.job_title.value}
              captureInput={captureInput}
              error={form.job_title.error}
              label="Job Title:"
              name="job_title"
            />
          </Box>
          <Box my="3rem">
            <FormInput
              id="company"
              type="text"
              active={true}
              value={form.company.value}
              captureInput={captureInput}
              error={form.company.error}
              label="Company:"
              name="company"
            />
          </Box>
          <Box my="3rem">
            <FormTextarea
              id="bio"
              value={form.bio.value}
              active={true}
              captureInput={captureInput}
              error={form.bio.error}
              label="Bio:"
              name="bio"
            />
          </Box>
          <Box my="3rem">
            <Languages
              myIcons={languages}
              removeLanguage={removeLanguage}
              addLanguage={addLanguage}
            />
          </Box>
          <Text my="0.5rem" fontSize="22px" color="purple.secondary">
            Socials
          </Text>

          <Box my="3rem">
            <Icon
              fontSize="24px"
              as={AiOutlineTwitter}
              mb="0.5rem"
              color="purple.secondary"
            />
            <FormInput
              id="twitter"
              type="text"
              active={true}
              value={form.twitter.value}
              captureInput={captureInput}
              error={form.twitter.error}
              label="Twitter:"
              name="twitter"
            />
          </Box>
          <Box display="flex" flexDir="column" my="3rem">
            <Icon
              fontSize="24px"
              as={AiOutlineGithub}
              mb="0.5rem"
              color="purple.secondary"
            />
            <FormInput
              id="github"
              type="text"
              active={true}
              value={form.github.value}
              captureInput={captureInput}
              error={form.github.error}
              label="Github:"
              name="github"
            />
          </Box>
          <Box my="3rem">
            <FormInput
              id="website"
              type="text"
              active={true}
              value={form.website.value}
              captureInput={captureInput}
              error={form.website.error}
              label="Website:"
              name="website"
            />
          </Box>

          <Box my="1rem">
            <Button
              _hover={{ backgroundColor: '#C42CB0' }}
              type="submit"
              width="120px"
              color="#FFF"
              bg="purple.secondary"
            >
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default ProfileForm;
