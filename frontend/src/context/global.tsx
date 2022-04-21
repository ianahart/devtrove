import { createContext, useState } from 'react';
import { getStorage, wipeUser } from '../helpers';
import { IGlobalContext, ITokens, IUser, IUserAuth } from '../interfaces';
import { IUpdateProfileFormRequest } from '../interfaces/requests';

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
        },
  };
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const updateUser = (user: IUpdateProfileFormRequest) => {
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
        updateUser,
        closeUserMenu,
        setUserAuth,
        userAuth,
        interceptorsLoaded,
        setInterceptorsLoaded,
        logout,
        setIsSearchOpen,
        isSearchOpen,
        stowTokens,
        handleIsSearchOpen,
        isModalOpen,
        openModal,
        closeModal,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
