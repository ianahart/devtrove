import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import { devtroveTheme } from './theme/devtroveTheme';
import GlobalContextProvider from './context/global';
import PostsContextProvider from './context/posts';
import GroupsContextProvider from './context/groups';
ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={devtroveTheme}>
      <GlobalContextProvider>
        <PostsContextProvider>
          <GroupsContextProvider>
            <App />
          </GroupsContextProvider>
        </PostsContextProvider>
      </GlobalContextProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
