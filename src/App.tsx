import React from 'react';
import axios from 'axios';

import {
  UserDataContainer,
  UserDataContextProvider,
  UserDataService,
  UserData,
} from './components/UserData/UserDataContainer';

const service: UserDataService = {
  submitUserData: async (data: UserData) => {
    await axios.post('https://jsonplaceholder.typicode.com/posts', data);
    console.log('sent');
  },
};

function App() {
  return (
    <UserDataContextProvider value={service}>
      <UserDataContainer />
    </UserDataContextProvider>
  );
}

export default App;
