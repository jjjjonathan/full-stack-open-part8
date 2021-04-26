import { useSubscription, useApolloClient } from '@apollo/client';
import React, { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import Login from './components/Login';
import NewBook from './components/NewBook';
import Recommendations from './components/Recommendations';
import { BOOK_ADDED, ALL_BOOKS } from './queries';

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null); // eslint-disable-line no-unused-vars

  const client = useApolloClient();

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map((b) => b.id).includes(object.id);

    const dataInStore = client.readQuery({ query: ALL_BOOKS });
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) },
      });
    }
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      window.alert(`${addedBook.title} by ${addedBook.author.name} added`);
      updateCacheWith(addedBook);
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
