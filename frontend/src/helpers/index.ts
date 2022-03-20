import { IUserAuth } from '../interfaces';

export const getStorage = () => {
  const storage = localStorage.getItem('user');
  let user;
  if (storage) {
    user = JSON.parse(storage);
  }
  return user;
};

export const wipeUser: IUserAuth = {
  access_token: '',
  refresh_token: '',
  user: {
    logged_in: false,
    handle: '',
    id: null,
  },
};
