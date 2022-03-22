import { useMemo } from 'react';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/global';
import { IGlobalContext, IUserAuth } from '../interfaces';
import { getStorage } from '.';
import { http } from '.';

interface IProps {
  children: JSX.Element;
}

const WithAxios: React.FC<IProps> = ({ children }): JSX.Element => {
  const navigate = useNavigate();
  const { logout, setUserAuth, setInterceptorsLoaded } = useContext(
    GlobalContext
  ) as IGlobalContext;
  useMemo(() => {
    const reqInterceptorId = http.interceptors.request.use(
      (config) => {
        if (getStorage()?.access_token) {
          // @ts-ignore
          config.headers.Authorization = `Bearer ${getStorage()?.access_token}`;
        } else {
          // @ts-ignore
          config.headers.Authorization = 'Bearer ';
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptorId = http.interceptors.response.use(
      (res) => {
        return res;
      },
      async (error) => {
        console.log(error.response, 'error');
        const originalRequest = error.config;
        if (error.response.status === 403) {
          logout();
          navigate('/');
        }
        if (
          error.response.status === 401 &&
          originalRequest.url.includes('auth/refresh/')
        ) {
          return Promise.reject(error);
        } else if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const storage = getStorage();

          const response = await http.post(`auth/refresh/`, {
            refresh: storage.refresh_token,
          });
          const user = JSON.parse(localStorage.getItem('user') || '{}');

          user.access_token = response.data.access;
          localStorage.setItem('user', JSON.stringify(user));
          const access_token: string = response.data.access_token;
          //@ts-ignore
          setUserAuth((prevState: IUserAuth) => ({
            ...prevState,
            access_token: access_token,
          }));

          return http(originalRequest);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      http.interceptors.response.eject(resInterceptorId);
      http.interceptors.request.eject(reqInterceptorId);
    };
  }, [setUserAuth, navigate, logout]);
  return children;
};

export default WithAxios;
