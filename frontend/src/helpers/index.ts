import axios from 'axios';
import { nanoid } from 'nanoid';
import { IUserAuth } from '../interfaces';

export const getGroupId = () => {
  let groupId = localStorage.getItem('group_id') || '';
  if (groupId.length) {
    return (groupId = JSON.parse(groupId));
  }
};

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

export const selectLanguages = [
  { id: nanoid(), value: 'shell', alias: 'Shell' },
  { id: nanoid(), value: 'scss', alias: 'SCSS' },
  { id: nanoid(), value: 'sql', alias: 'SQL' },
  { id: nanoid(), value: 'rust', alias: 'Rust' },
  { id: nanoid(), value: 'python', alias: 'Python' },
  { id: nanoid(), value: 'php', alias: 'PHP' },
  { id: nanoid(), value: 'perl', alias: 'Perl' },
  { id: nanoid(), value: 'kotlin', alias: 'Kotlin' },
  { id: nanoid(), value: 'javascript', alias: 'JavaScript' },
  { id: nanoid(), value: 'java', alias: 'Java' },
  { id: nanoid(), value: 'json', alias: 'JSON' },
  { id: nanoid(), value: 'html', alias: 'HTML' },
  { id: nanoid(), value: 'go', alias: 'Go' },
  { id: nanoid(), value: 'elixir', alias: 'Elixir' },
  { id: nanoid(), value: 'cpp', alias: 'C++' },
  { id: nanoid(), value: 'csharp', alias: 'C#' },
  { id: nanoid(), value: 'css', alias: 'CSS' },
];

export const devIcons = [
  { id: nanoid(), name: 'JavaScript', snippet: 'devicon-javascript-plain colored' },
  { id: nanoid(), name: 'Swift', snippet: 'devicon-swift-plain colored' },
  { id: nanoid(), name: 'C', snippet: 'devicon-c-plain colored' },
  { id: nanoid(), name: 'Kotlin', snippet: 'devicon-kotlin-plain colored' },
  { id: nanoid(), name: 'php', snippet: 'devicon-php-plain colored' },
  { id: nanoid(), name: 'css', snippet: 'devicon-css3-plain colored' },
  { id: nanoid(), name: 'Java', snippet: 'devicon-java-plain colored' },
  { id: nanoid(), name: 'Ruby', snippet: 'devicon-ruby-plain colored' },
  { id: nanoid(), name: 'Rust', snippet: 'devicon-rust-plain' },
  { id: nanoid(), name: 'Golang', snippet: 'devicon-go-original-wordmark colored' },
  { id: nanoid(), name: 'Python', snippet: 'devicon-python-plain colored' },
  { id: nanoid(), name: 'C#', snippet: 'devicon-csharp-plain colored' },
  { id: nanoid(), name: 'Docker', snippet: 'devicon-docker-plain colored' },
  { id: nanoid(), name: 'C++', snippet: 'devicon-cplusplus-plain colored' },
  { id: nanoid(), name: 'Kubernetes', snippet: 'devicon-kubernetes-plain colored' },
];
