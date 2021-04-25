import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState('');

  const query = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  }

  if (query.loading) {
    return <div>loading...</div>;
  }

  const books = query.data.allBooks;

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
      <h2>books</h2>
      {genreFilter ? (
        <p>
          in genre <strong>{genreFilter}</strong>
        </p>
      ) : null}
      <table style={{ marginBottom: 15 }}>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((book) =>
              genreFilter ? book.genres.includes(genreFilter) : true
            )
            .map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <button
        onClick={() => {
          setGenreFilter('');
        }}
      >
        <strong>view all</strong>
      </button>
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => {
            setGenreFilter(genre);
          }}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default Books;
