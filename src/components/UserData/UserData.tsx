import React, { useState } from 'react';
import styled from 'styled-components';

interface UserDataProps {
  name: string;
  setName: (name: string) => void;
  birthDate: string;
  setBirthDate: (date: string) => void;
  favoriteColor: string;
  setFavoriteColor: (color: string) => void;
  colors: string[];
  addColor: (color: string) => void;
  canSubmit: boolean;
  submit: () => void;
}

export function UserData(props: UserDataProps) {
  const {
    name,
    setName,
    birthDate,
    setBirthDate,
    favoriteColor,
    setFavoriteColor,
    submit,
    colors,
    addColor,
    canSubmit,
  } = props;

  const [newColor, setNewColor] = useState('');

  function handleAddColor() {
    addColor(newColor);
    setFavoriteColor(newColor);
    setNewColor('');
  }

  return (
    <Wrapper>
      <Row>
        <label>User name</label>
        <input
          type="text"
          value={name}
          data-testid="name"
          onChange={(e) => setName(e.target.value)}
        />
      </Row>

      <Row>
        <label>Birth date</label>
        <input
          type="date"
          value={birthDate}
          data-testid="birthdate"
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </Row>

      <Row>
        <label>Favorite Color</label>
        <select
          data-testid="favorite-color"
          value={favoriteColor}
          onChange={(e) => setFavoriteColor(e.target.value)}
        >
          {colors.map((color) => (
            <option value={color} key={color}>
              {color}
            </option>
          ))}
          <option value="other">Other...</option>
        </select>
      </Row>

      {favoriteColor === 'other' && (
        <Row>
          <label>Enter color</label>
          <input
            data-testid="new-color"
            type="text"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
          />
          <button
            data-testid="add-color"
            disabled={!newColor || colors.includes(newColor)}
            onClick={handleAddColor}
          >
            Add
          </button>
        </Row>
      )}

      <Row>
        <button data-testid="submit" disabled={!canSubmit} onClick={submit}>
          Submit
        </button>
      </Row>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  margin: 8px;
`;

const Row = styled.div`
  margin-bottom: 16px;
  > input,
  > select {
    margin: 0 8px;
  }
`;
