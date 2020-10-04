import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import SignIn from '../../pages/SignIn';

const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({ signIn: mockedSignIn }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({ addToast: mockedAddToast }),
  };
});

describe('Sign In Page', () => {
  beforeEach(() => {
    mockedSignIn.mockClear();
  });

  it('Should be able to SignIn', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const logginButton = getByText('Entrar');

    fireEvent.change(emailInput, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(logginButton);

    await wait(() => {
      expect(mockedSignIn).toHaveBeenCalledTimes(1);
    });
  });

  it('Should not be able to SignIn with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const logginButton = getByText('Entrar');

    fireEvent.change(emailInput, { target: { value: 'no-valid-credentials' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(logginButton);

    await wait(() => {
      expect(mockedSignIn).not.toHaveBeenCalled();
    });
  });

  it('Should be able to display the error toast', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const logginButton = getByText('Entrar');

    fireEvent.change(emailInput, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(logginButton);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
