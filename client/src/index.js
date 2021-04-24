import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

import { setContext } from 'apollo-link-context';
import { ALL_AUTHORS, ALL_BOOKS } from './queries';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('libraryUserToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    },
  };
});

const httpLink = new HttpLink({ uri: 'http://localhost:4000' });

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

client.query({ query: ALL_AUTHORS }).then((response) => {
  console.log(response.data);
});
client.query({ query: ALL_BOOKS }).then((response) => {
  console.log(response.data);
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
