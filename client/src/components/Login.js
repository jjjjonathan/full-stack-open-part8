import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../queries';

const Login = ({ show, setError, setToken, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.token;
      setToken(token);
      localStorage.setItem('libraryUserToken', token);
    }
  }, [result.data]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!show) {
    return null;
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('Logging in', username);
    login({ variables: { username, password } });
    setUsername('');
    setPassword('');
    setPage('authors');
  };

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">username:</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <label htmlFor="password">password:</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
