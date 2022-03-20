import { createContext, useState } from 'react';
import { getStorage, wipeUser } from '../helpers';
import { IGlobalContext, ITokens, IUser, IUserAuth } from '../interfaces';

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
        },
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userAuth, setUserAuth] = useState<IUserAuth>(initialAuth);

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

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
      value={{ userAuth, logout, stowTokens, isModalOpen, openModal, closeModal }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
