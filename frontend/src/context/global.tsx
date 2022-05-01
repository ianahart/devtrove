import { createContext, useState } from 'react';
import { getStorage, wipeUser } from '../helpers';
import { IGlobalContext, ITokens, IUser, IUserAuth } from '../interfaces';
import { IUpdateProfileFormRequest, IUpdateSettingRequest } from '../interfaces/requests';

export const GlobalContext = createContext<IGlobalContext | null>(null);

const GlobalContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  const storage = getStorage();
  const initialAuth = {
    access_token: storage ? storage.access_token : '',
    refresh_token: storage ? storage.refresh_token : '',
    user: storage
      ? storage.user
      : {
          logged_in: false,
          handle: '',
          id: null,
          avatar_url: '',
          setting_id: null,
          theme: '',
          preferred_language: false,
        },
  };
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isUserMenuShowing, setIsUserMenuShowing] = useState(false);
  const [userAuth, setUserAuth] = useState<IUserAuth>(initialAuth);
  const [interceptorsLoaded, setInterceptorsLoaded] = useState(false);

  const handleIsSearchOpen = () => {
    setIsSearchOpen((prevState) => !prevState);
  };

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  const toggleUserMenu = () => {
    setIsUserMenuShowing((prevState) => !prevState);
  };

  const closeUserMenu = () => {
    setIsUserMenuShowing(false);
  };
  const updatePreferredLanguage = (data: boolean, name: string) => {
    setUserAuth((prevState) => ({
      ...prevState,
      user: { ...prevState.user, preferred_language: !prevState.user.preferred_language },
    }));
    updateSetting(data, 'preferred_language');
  };

  const updateSetting = (data: string | boolean, name: string) => {
    const user = JSON.parse(localStorage.getItem('user') ?? '');
    if (data || typeof data === 'boolean') {
      user.user[name] = data;
    }
    localStorage.setItem('user', JSON.stringify(user));
  };

  const updateUser = (user: IUpdateProfileFormRequest) => {
    console.log(user);
    setUserAuth((prevState) => ({
      ...prevState,
      user: user.user_auth.user,
    }));

    let userLoc = JSON.parse(localStorage.getItem('user') || '{}');

    if (userLoc) {
      userLoc.user = user.user_auth.user;
      localStorage.setItem('user', JSON.stringify(userLoc));
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUserAuth(Object.assign({}, wipeUser));
  };
  const stowTokens = (tokens: ITokens, user: IUser) => {
    localStorage.setItem('user', JSON.stringify({ ...tokens, user }));
    setTheme(user.theme);
    setUserAuth((prevState) => ({
      ...prevState,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user,
    }));
  };
  return (
    <GlobalContext.Provider
      value={{
        isUserMenuShowing,
        toggleUserMenu,
        setTheme,
        updateUser,
        closeUserMenu,
        updateSetting,
        setUserAuth,
        userAuth,
        interceptorsLoaded,
        setInterceptorsLoaded,
        logout,
        setIsSearchOpen,
        isSearchOpen,
        updatePreferredLanguage,
        stowTokens,
        handleIsSearchOpen,
        isModalOpen,
        theme,
        openModal,
        closeModal,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
