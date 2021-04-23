import React from 'react';
import SetBirthYear from './SetBirthyear';
import { useQuery } from '@apollo/client';
import { ALL_AUTHORS } from '../queries';

const Authors = (props) => {
  const query = useQuery(ALL_AUTHORS);

  if (!props.show) {
    return null;
  }

  if (query.loading) {
    return <div>loading...</div>;
  }

  const authors = query.data.allAuthors;

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBirthYear authors={authors} />
    </div>
  );
};

export default Authors;
