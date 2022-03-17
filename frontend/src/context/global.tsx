import { createContext, useState } from 'react';
import { IGlobalContext } from '../interfaces';

export const GlobalContext = createContext<IGlobalContext | null>(null);

const GlobalContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  return (
    <GlobalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
