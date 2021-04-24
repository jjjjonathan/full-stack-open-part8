import React, { useState } from 'react';
import Select from 'react-select';
import { useMutation } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const SetBirthYear = ({ authors }) => {
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!localStorage.getItem('libraryUserToken')) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    editAuthor({
      variables: { name, setBornTo: Number(born) },
    });
    setName('');
    setBorn('');
  };

  const options = authors.map((author) => ({
    value: author.name,
    label: author.name,
  }));

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ width: 300, marginBottom: 10 }}>
          <Select
            name="name"
            value={{ name, label: name }}
            onChange={({ value }) => {
              setName(value);
            }}
            options={options}
          />
        </div>
        <label htmlFor="born">born</label>
        <input
          name="born"
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
