import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const SetBirthYear = () => {
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    editAuthor({
      variables: { name, setBornTo: Number(born) },
    });
    setName('');
    setBorn('');
  };

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">name</label>
        <input
          name="name"
          id="name"
          value={name}
          onChange={({ target }) => {
            setName(target.value);
          }}
        />
        <label htmlFor="born">born</label>
        <input
          name="born"
          id="born"
          value={born}
          onChange={({ target }) => {
            setBorn(target.value);
          }}
        />
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default SetBirthYear;
