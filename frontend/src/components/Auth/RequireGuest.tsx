import { useLocation, Navigate } from 'react-router-dom';
import { getStorage } from '../../helpers';
interface Props {
  children: JSX.Element;
}

const RequireGuest: React.FC<Props> = ({ children }): JSX.Element => {
  const location = useLocation();
  const guestRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const storage = getStorage();
  if (storage === undefined && guestRoutes.includes(location.pathname)) {
    return children;
  } else {
    return <Navigate to="/" replace state={{ path: location.pathname }} />;
  }
};

export default RequireGuest;
