import React from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS, ME } from '../queries';

const Recommendations = ({ show }) => {
  const booksQuery = useQuery(ALL_BOOKS);
  const meQuery = useQuery(ME);

  if (!show) {
    return null;
  }

  if (booksQuery.loading || meQuery.loading) {
    return <div>loading...</div>;
  }

  const books = booksQuery.data.allBooks;
  const favoriteGenre = meQuery.data.me.favoriteGenre;

  let genres = [];
  books.forEach((book) => {
    book.genres.forEach((genre) => {
      if (!genres.includes(genre)) {
        genres.push(genre);
      }
    });
  });

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((book) => book.genres.includes(favoriteGenre))
            .map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
