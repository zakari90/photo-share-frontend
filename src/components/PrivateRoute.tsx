import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/auth-context';

export default function PrivateRoute() {
  const { token } = useContext(AuthContext);

  return token ? <Outlet /> : <Navigate replace to="/login" />;
}
