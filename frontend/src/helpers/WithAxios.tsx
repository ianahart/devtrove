import { useMemo, useEffect, useState } from 'react';
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
  const [isLoaded, setLoaded] = useState(false);
  const { logout, setUserAuth } = useContext(GlobalContext) as IGlobalContext;
  useMemo(() => {
    const reqInterceptorId = http.interceptors.request.use(
      (config) => {
        if (getStorage()?.access_token) {
          // @ts-ignore
          config.headers.Authorization = `Bearer ${getStorage()?.access_token}`;
        }
        //                else {
        //          // @ts-ignore
        //          config.headers.Authorization = 'Bearer ';
        //        }
        //
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptorId = http.interceptors.response.use(
      (res) => {
        return res;
      },
      async (error) => {

        const originalRequest = error.config;
        const notAuthenticated =
          error.response?.data?.code === 'bad_authorization_header' ||
          error.response?.data?.detail?.toLowerCase() ===
            'authentication credentials were not provided.';
        if (error.response?.status === 401 && notAuthenticated) {
          setLoaded(true);
        } else if (
          error.response?.status === 401 &&
          error.response?.data?.dir === 'no refresh'
        ) {
          setLoaded(true);
        } else if (
          error.response.status === 401 &&
          originalRequest.url.includes('auth/refresh/')
        ) {
          return Promise.reject(error);
        } else if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const storage = getStorage();
          if (storage?.refresh_token) {
            const response = await http.post(`auth/refresh/`, {
              refresh: storage.refresh_token,
            });

            const user = JSON.parse(localStorage.getItem('user') || '{}');

            user.access_token = response.data.access;
            localStorage.setItem('user', JSON.stringify(user));
            const access_token: string = response.data.access;
            //@ts-ignore
            setUserAuth((prevState: IUserAuth) => ({
              ...prevState,
              access_token: access_token,
            }));
            return http(originalRequest);
          }
        }
        if (error.response.status === 403 || error.response.status === 401) {
          logout();
          setLoaded(true);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      http.interceptors.response.eject(resInterceptorId);
      http.interceptors.request.eject(reqInterceptorId);
    };
  }, [setUserAuth, logout, setLoaded]);
  useEffect(() => {
    if (isLoaded) {
      console.log('Are you running? You shouldnt be... WithAxios.tsx');
      navigate('/');
      setLoaded(false);
    }
  }, [navigate, isLoaded]);
  return children;
};

export default WithAxios;
