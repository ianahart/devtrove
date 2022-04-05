import { useLocation, Navigate } from 'react-router-dom';
import { getStorage } from '../../helpers';
interface Props {
  children: JSX.Element;
}

const RequireAuth: React.FC<Props> = ({ children }): JSX.Element => {
  const location = useLocation();

  if (getStorage()?.access_token) {
    return children;
  } else {
    return <Navigate to="/" replace state={{ path: location.pathname }} />;
  }
};

export default RequireAuth;
