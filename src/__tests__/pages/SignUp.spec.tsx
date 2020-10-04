import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import SignUp from '../../pages/SignUp';

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

jest.mock('../../services/api', () => {
  return {
    post: () => jest.fn(),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({ addToast: mockedAddToast }),
  };
});

describe('Sign Up Page', () => {
  beforeEach(() => {
    mockedSignIn.mockClear();
  });

  it('Should be able to SignUp', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameInput = getByPlaceholderText('Nome');
    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const logginButton = getByText('Cadastrar');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(logginButton);

    await wait(() => {
      expect(mockedSignIn).toHaveBeenCalledTimes(1);
    });
  });

  it('Should not be able to SignUp with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameInput = getByPlaceholderText('Nome');
    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const logginButton = getByText('Cadastrar');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
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

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const nameInput = getByPlaceholderText('Nome');
    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const logginButton = getByText('Cadastrar');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
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
