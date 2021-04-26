import { useSubscription, useApolloClient } from '@apollo/client';
import React, { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import Login from './components/Login';
import NewBook from './components/NewBook';
import Recommendations from './components/Recommendations';
import { BOOK_ADDED } from './queries';

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null); // eslint-disable-line no-unused-vars

  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const newBook = subscriptionData.data.bookAdded;
      console.log(newBook);
      window.alert(
        `${newBook.title} by ${newBook.author.name} added just now!`
      );
    },
  });

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('libraryUserToken');
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!localStorage.getItem('libraryUserToken') ? (
          <button onClick={() => setPage('login')}>login</button>
        ) : (
          <span>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommendations')}>
              recommendations
            </button>
            <button onClick={handleLogout}>logout</button>
          </span>
        )}
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <Login
        show={page === 'login'}
        setToken={setToken}
        setError={(error) => console.log(error)}
        setPage={setPage}
      />

      <NewBook show={page === 'add'} setPage={setPage} />

      <Recommendations show={page === 'recommendations'} />
    </div>
  );
};

export default App;
