import { createContext, useState } from 'react';
import { IGroup, IGroupsContext } from '../interfaces';
import { IGroupIndexRequest } from '../interfaces/requests';
import axios, { AxiosError } from 'axios';
import { http } from '../helpers';

export const GroupsContext = createContext<IGroupsContext | null>(null);

const GroupsContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [groups, setGroups] = useState<IGroup[]>([]);

  const getGroups = async () => {
    try {
      const response = await http.get<IGroupIndexRequest>('/groups/');
      console.log(response);
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        console.log(e.response?.data);
      }
    }
  };

  const addGroup = (data: IGroup) => {
    setGroups((prevState) => [...prevState, data]);
  };

  return (
    <GroupsContext.Provider value={{ addGroup, groups, getGroups }}>
      {children}
    </GroupsContext.Provider>
  );
};

export default GroupsContextProvider;
