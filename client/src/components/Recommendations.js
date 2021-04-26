import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { BOOKS_BY_GENRE, ME } from '../queries';

const Recommendations = ({ show }) => {
  const [genre, setGenre] = useState('');
  const [books, setBooks] = useState(null);

  const [getMeQuery, meQuery] = useLazyQuery(ME);
  const [getBooksQuery, booksQuery] = useLazyQuery(BOOKS_BY_GENRE);

  useEffect(() => {
    getMeQuery();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (meQuery.data) {
      const favoriteGenre = meQuery.data.me.favoriteGenre;
      setGenre(favoriteGenre);
    }
  }, [meQuery]);

  useEffect(() => {
    getBooksQuery({ variables: { genre } });
  }, [genre]); // eslint-disable-line

  useEffect(() => {
    if (booksQuery.data) {
      setBooks(booksQuery.data.allBooks);
    }
  }, [booksQuery]);

  if (!show) {
    return null;
  }

  if (booksQuery.error || meQuery.error) {
    return `Error! ${booksQuery.error.message} ${meQuery.error.message}`;
  }

  if (booksQuery.loading || meQuery.loading) {
    return <div>loading...</div>;
  }

  return genre && books ? (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{genre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : null;
};

export default Recommendations;
