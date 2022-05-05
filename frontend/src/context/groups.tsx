import { useCallback, createContext, useState } from 'react';
import { IGroup, IGroupsContext, IPagination } from '../interfaces';
import { IGroupIndexRequest } from '../interfaces/requests';
import axios, { AxiosError } from 'axios';
import { http } from '../helpers';

export const GroupsContext = createContext<IGroupsContext | null>(null);

const GroupsContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [groupPag, setGroupPag] = useState<IPagination>({ has_next: false, page: 1 });

  const getGroups = useCallback(async () => {
    try {
      const response = await http.get<IGroupIndexRequest>('/groups/?page=0');
      setGroups(response.data.groups);
      console.log(response.data.pagination, 'initial');
      setGroupPag((prevState) => ({ ...prevState, ...response.data.pagination }));
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        console.log(e.response?.data);
      }
    }
  }, []);

  const pagGroups = async () => {
    try {
      const response = await http.get<IGroupIndexRequest>(
        `/groups/?page=${groupPag.page}`
      );
      console.log(response);
      setGroups((prevState) => [...groups, ...response.data.groups]);
      console.log(response.data.pagination, '  load more');
      setGroupPag((prevState) => ({ ...prevState, ...response.data.pagination }));
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
    <GroupsContext.Provider value={{ groupPag, addGroup, groups, getGroups, pagGroups }}>
      {children}
    </GroupsContext.Provider>
  );
};

export default GroupsContextProvider;
