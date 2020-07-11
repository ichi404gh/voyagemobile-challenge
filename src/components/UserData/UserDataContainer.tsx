import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useCallback,
} from 'react';

import { UserData as UserDataView } from './UserData';

export interface UserDataService {
  submitUserData: (data: UserData) => Promise<void>;
}

const UserDataContext = createContext<UserDataService | undefined>(undefined);

export const UserDataContextProvider = UserDataContext.Provider;

function useUserDataContext() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('<UserDataContainer> must be wrapped by <UserDataContext>');
  }

  return context;
}

export interface UserData {
  name: string;
  birthDate: Date;
  favoriteColor: string;
}

export function UserDataContainer() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [favoriteColor, setFavoriteColor] = useState('blue');
  const [colors, setColors] = useState(['red', 'blue', 'yellow']);

  const [canSubmit, setCanSubmit] = useState(false);
  const { submitUserData } = useUserDataContext();

  useEffect(() => {
    const birthDateAsDate = new Date(birthDate);
    const isValidDate =
      birthDateAsDate instanceof Date && !isNaN(+birthDateAsDate);

    const canSubmit = !!name && isValidDate && favoriteColor !== 'other';

    setCanSubmit(canSubmit);
  }, [name, birthDate, favoriteColor]);

  const addColor = useCallback(
    (color) => setColors((oldColors) => [...oldColors, color]),
    [],
  );

  async function handleSubmit() {
    if (canSubmit) {
      await submitUserData({
        name: name,
        birthDate: new Date(birthDate),
        favoriteColor: favoriteColor,
      });
    }
  }

  return (
    <UserDataView
      name={name}
      setName={setName}
      birthDate={birthDate}
      setBirthDate={setBirthDate}
      favoriteColor={favoriteColor}
      setFavoriteColor={setFavoriteColor}
      colors={colors}
      addColor={addColor}
      canSubmit={canSubmit}
      submit={handleSubmit}
    />
  );
}
