import axios from 'axios';
import { IUserAuth } from '../interfaces';

export const http = axios.create({
  // Change in production
  baseURL: 'http://localhost:3000/api/v1/',
});

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

export const devIcons = [
  { id: 1, name: 'JavaScript', snippet: 'devicon-javascript-plain colored' },
  { id: 2, name: 'Swift', snippet: 'devicon-swift-plain colored' },
  { id: 3, name: 'C', snippet: 'devicon-c-plain colored' },
  { id: 4, name: 'Kotlin', snippet: 'devicon-kotlin-plain colored' },
  { id: 5, name: 'php', snippet: 'devicon-php-plain colored' },
  { id: 6, name: 'css', snippet: 'devicon-css3-plain colored' },
  { id: 7, name: 'Java', snippet: 'devicon-java-plain colored' },
  { id: 8, name: 'Ruby', snippet: 'devicon-ruby-plain colored' },
  { id: 9, name: 'Rust', snippet: 'devicon-rust-plain' },
  { id: 10, name: 'Golang', snippet: 'devicon-go-original-wordmark colored' },
  { id: 11, name: 'Python', snippet: 'devicon-python-plain colored' },
  { id: 12, name: 'C#', snippet: 'devicon-csharp-plain colored' },
  { id: 13, name: 'Docker', snippet: 'devicon-docker-plain colored' },
  { id: 14, name: 'C++', snippet: 'devicon-cplusplus-plain colored' },
  { id: 15, name: 'Kubernetes', snippet: 'devicon-kubernetes-plain colored' },
];
