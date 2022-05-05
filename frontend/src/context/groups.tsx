import { useCallback, createContext, useState } from 'react';
import { IInvite, IGroup, IGroupsContext, IPagination, IInvitation } from '../interfaces';
import { IAllInvitationsRequest, IGroupIndexRequest } from '../interfaces/requests';
import axios, { Axios, AxiosError } from 'axios';
import { http } from '../helpers';

export const GroupsContext = createContext<IGroupsContext | null>(null);

const GroupsContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [groupError, setGroupError] = useState('');
  const [invitationError, setInvitationError] = useState('');
  const [groupPag, setGroupPag] = useState<IPagination>({ has_next: false, page: 1 });
  const [invitations, setInvitations] = useState<IInvitation[]>([]);
  const [invitationPag, setInvitationPag] = useState<IPagination>({
    has_next: false,
    page: 1,
  });

  /**Groups*/
  const resetGroups = () => {
    setGroups([]);
    setGroupPag({ has_next: false, page: 1 });
  };

  const getGroups = useCallback(async () => {
    try {
      const response = await http.get<IGroupIndexRequest>('/groups/?page=0');
      setGroups(response.data.groups);
      setGroupPag((prevState) => ({ ...prevState, ...response.data.pagination }));
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setGroupError(e.response?.data.error);
      }
    }
  }, []);

  const pagGroups = async () => {
    try {
      const response = await http.get<IGroupIndexRequest>(
        `/groups/?page=${groupPag.page}`
      );
      setGroups((prevState) => [...groups, ...response.data.groups]);
      setGroupPag((prevState) => ({ ...prevState, ...response.data.pagination }));
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setGroupError(e.response?.data.error);
      }
    }
  };

  const addGroup = (group: IGroup) => {
    setGroups((prevState) => [...prevState, group]);
  };

  /**Invitations*/
  const resetInvitations = () => {
    setInvitations([]);
    setInvitationPag({ has_next: false, page: 1 });
  };

  const getInvitations = useCallback(async () => {
    try {
      const response = await http.get<IAllInvitationsRequest>('/invitations/');
      setInvitations((prevState) => [...prevState, ...response.data.invitations]);
      setInvitationPag((prevState) => ({ ...prevState, ...response.data.pagination }));
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setInvitationError(e.response?.data.error);
      }
    }
  }, []);
  const pagInvitations = async () => {
    try {
      if (!invitationPag.has_next) return;
      const response = await http.get<IAllInvitationsRequest>(
        `/invitations/?page=${invitationPag.page}`
      );
      setInvitations((prevState) => [...prevState, ...response.data.invitations]);
      setInvitationPag((prevState) => ({ ...prevState, ...response.data.pagination }));
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        console.log(e.response);
        setGroupError(e.response?.data.error);
      }
    }
  };

  return (
    <GroupsContext.Provider
      value={{
        resetGroups,
        groupPag,
        addGroup,
        groups,
        getGroups,
        pagGroups,
        resetInvitations,
        invitationPag,
        getInvitations,
        invitations,
        pagInvitations,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
};

export default GroupsContextProvider;
