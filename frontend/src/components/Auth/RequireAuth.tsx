import { useLocation, Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces';
import { getStorage } from '../../helpers';
interface Props {
  children: JSX.Element;
}

const RequireAuth: React.FC<Props> = ({ children }): JSX.Element => {
  const { userAuth } = useContext(GlobalContext) as IGlobalContext;
  const location = useLocation();

  if (userAuth?.access_token && getStorage()?.access_token) {
    return children;
  } else {
    return <Navigate to="/" replace state={{ path: location.pathname }} />;
  }
};

export default RequireAuth;
