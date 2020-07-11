import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import {
  UserDataContextProvider,
  UserDataContainer,
  UserDataService,
} from './UserDataContainer';
import { supressConsoleErrors } from '../../testutils';

let service: UserDataService;
let submitUserData: any;

beforeEach(() => {
  submitUserData = jest.fn().mockResolvedValue(undefined);
  service = {
    submitUserData,
  };
});

describe('rendering', () => {
  test('renders user data component', () => {
    const { getByText } = render(
      <UserDataContextProvider value={service}>
        <UserDataContainer />
      </UserDataContextProvider>,
    );

    const el = getByText(/user name/i);
    expect(el).toBeInTheDocument();
  });

  test('throws when rendered without provider', () => {
    supressConsoleErrors(() => {
      const container = () => render(<UserDataContainer />);
      expect(container).toThrow();
    });
  });
});

describe("componet's valid state", () => {
  let usernameInput: any;
  let userBDInput: any;
  let colorSelect: any;
  let submit: any;
  let getByTestId: any;

  beforeEach(() => {
    const el = render(
      <UserDataContextProvider value={service}>
        <UserDataContainer />
      </UserDataContextProvider>,
    );
    getByTestId = el.getByTestId;

    usernameInput = getByTestId('name');
    userBDInput = getByTestId('birthdate');
    colorSelect = getByTestId('favorite-color');
    submit = getByTestId('submit');
  });

  test('valid when all fields are filled', async () => {
    await userEvent.type(userBDInput, '1990-01-01');
    await userEvent.selectOptions(colorSelect, 'red');

    expect(submit).toBeDisabled();

    await userEvent.type(usernameInput, 'John');
    expect(submit).toBeEnabled();
  });

  test('invalid state when invalid date', async () => {
    await userEvent.type(userBDInput, 'not-a-date');
    await userEvent.selectOptions(colorSelect, 'red');
    await userEvent.type(usernameInput, 'John');

    expect(submit).toBeDisabled();
  });

  test('invalid state when no color typed', async () => {
    await userEvent.type(userBDInput, '1990-01-01');
    await userEvent.selectOptions(colorSelect, 'other');
    await userEvent.type(usernameInput, 'John');

    const addColorButton = getByTestId('add-color');

    expect(addColorButton).toBeDisabled();
    expect(submit).toBeDisabled();
  });

  test('invalid state when typed existing color', async () => {
    await userEvent.type(userBDInput, '1990-01-01');
    await userEvent.selectOptions(colorSelect, 'other');
    await userEvent.type(usernameInput, 'John');

    const newColorInput = getByTestId('new-color');
    const addColorButton = getByTestId('add-color');

    await userEvent.type(newColorInput, 'red');
    expect(addColorButton).toBeDisabled();
    expect(submit).toBeDisabled();
  });

  test('valid state when typed new color', async () => {
    await userEvent.type(userBDInput, '1990-01-01');
    await userEvent.selectOptions(colorSelect, 'other');
    await userEvent.type(usernameInput, 'John');

    const newColorInput = getByTestId('new-color');
    const addColorButton = getByTestId('add-color');

    await userEvent.type(newColorInput, 'purple');
    expect(addColorButton).toBeEnabled();
    expect(submit).toBeDisabled();
  });

  test('adds option', async () => {
    await userEvent.type(userBDInput, '1990-01-01');
    await userEvent.selectOptions(colorSelect, 'other');
    await userEvent.type(usernameInput, 'John');
    expect(colorSelect.options.length).toBe(4);

    const newColorInput = getByTestId('new-color');
    const addColorButton = getByTestId('add-color');

    await userEvent.type(newColorInput, 'purple');
    act(() => {
      userEvent.click(addColorButton);
    });

    expect(colorSelect.options.length).toBe(5);
    expect(colorSelect.value).toBe('purple');
    expect(submit).toBeEnabled();
  });
});

describe('integration', () => {
  test('make api call with default color', async () => {
    const { getByTestId } = render(
      <UserDataContextProvider value={service}>
        <UserDataContainer />
      </UserDataContextProvider>,
    );

    const usernameInput = getByTestId('name');
    await userEvent.type(usernameInput, 'John');

    const userBDInput = getByTestId('birthdate');
    await userEvent.type(userBDInput, '1990-01-01');

    const colorSelect = getByTestId('favorite-color');
    await userEvent.selectOptions(colorSelect, 'red');

    const submit = getByTestId('submit');
    await userEvent.click(submit);

    expect(submitUserData).toBeCalledWith({
      name: 'John',
      favoriteColor: 'red',
      birthDate: new Date('1990-01-01'),
    });
  });

  test('make api call with different color', async () => {
    const { getByTestId } = render(
      <UserDataContextProvider value={service}>
        <UserDataContainer />
      </UserDataContextProvider>,
    );

    const usernameInput = getByTestId('name');
    await userEvent.type(usernameInput, 'John');

    const userBDInput = getByTestId('birthdate');
    await userEvent.type(userBDInput, '1990-01-01');

    const colorSelect = getByTestId('favorite-color');
    await userEvent.selectOptions(colorSelect, 'other');

    const newColorInput = getByTestId('new-color');
    const addColorButton = getByTestId('add-color');
    const submit = getByTestId('submit');

    await userEvent.type(newColorInput, 'purple');
    act(() => {
      userEvent.click(addColorButton);
    });
    await userEvent.click(submit);

    expect(submitUserData).toBeCalledWith({
      name: 'John',
      favoriteColor: 'purple',
      birthDate: new Date('1990-01-01'),
    });
  });
});
