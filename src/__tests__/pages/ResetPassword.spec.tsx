import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import ResetPassword from '../../pages/ResetPassword';

const mockedAddToast = jest.fn();
const mockedPush = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: React.ReactNode }) => children,
    useLocation: () => ({ search: { replace: jest.fn() } }),
    useHistory: () => ({ push: mockedPush }),
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

describe('Reset Password Page', () => {
  beforeEach(() => {
    mockedAddToast.mockClear();
    mockedPush.mockClear();
  });

  it('Should be able to reset the password', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordInput = getByPlaceholderText('Senha');
    const confirmationPasswordInput = getByPlaceholderText(
      'Confirmação da senha',
    );
    const logginButton = getByText('Alterar senha');

    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.change(confirmationPasswordInput, {
      target: { value: '123456' },
    });
    fireEvent.click(logginButton);

    await wait(() => {
      expect(mockedPush).toHaveBeenCalledWith('/');
    });
  });

  it('Should not be able to reset the password when the password and the confirmation password are different', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordInput = getByPlaceholderText('Senha');
    const confirmationPasswordInput = getByPlaceholderText(
      'Confirmação da senha',
    );
    const logginButton = getByText('Alterar senha');

    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.change(confirmationPasswordInput, {
      target: { value: '999999' },
    });
    fireEvent.click(logginButton);

    await wait(() => {
      expect(mockedPush).not.toHaveBeenCalledWith();
    });
  });

  it('Should be able to display the error toast', async () => {
    mockedPush.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const passwordInput = getByPlaceholderText('Senha');
    const confirmationPasswordInput = getByPlaceholderText(
      'Confirmação da senha',
    );
    const logginButton = getByText('Alterar senha');

    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.change(confirmationPasswordInput, {
      target: { value: '123456' },
    });
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
