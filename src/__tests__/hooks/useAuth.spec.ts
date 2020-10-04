import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';

import { useAuth, AuthProvider } from '../../hooks/auth';
import api from '../../services/api';

const mockApi = new MockAdapter(api);

describe('useAuth hook', () => {
  it('Should be able to login user', async () => {
    const apiResponse = {
      user: {
        id: 'abcd',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      token: 'token-123',
    };

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    mockApi.onPost('sessions').reply(200, apiResponse);

    const { result, waitForNextUpdate } = renderHook(useAuth, {
      wrapper: AuthProvider,
    });

    const { signIn } = result.current;

    signIn({ email: 'johndoe@example.com', password: '123456' });

    await waitForNextUpdate();

    expect(result.current.user.email).toEqual(apiResponse.user.email);
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token,
    );
  });

  it('Should be able to get credentials from localstorage', async () => {
    const userData = {
      user: {
        id: 'abcd',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      token: 'token-123',
    };

    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementationOnce(key => {
        switch (key) {
          case '@GoBarber:token':
            return userData.token;
          case '@GoBarber:user':
            return JSON.stringify(userData.user);
          default:
            return null;
        }
      });

    const { result } = renderHook(useAuth, {
      wrapper: AuthProvider,
    });

    expect(getItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toEqual(userData.user);
  });

  it('Should be able to logout user', () => {
    const userData = {
      user: {
        id: 'abcd',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      token: 'token-123',
    };

    jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(key => {
      switch (key) {
        case '@GoBarber:token':
          return userData.token;
        case '@GoBarber:user':
          return JSON.stringify(userData.user);
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(useAuth, {
      wrapper: AuthProvider,
    });

    const { signOut } = result.current;

    act(() => {
      signOut();
    });

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined;
  });

  it('Should be able to update user', () => {
    const updatedUser = {
      id: 'abcd',
      name: 'John Doe Updated',
      email: 'johndoeupdated@example.com',
      avatarUrl: 'image.png',
    };

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(useAuth, {
      wrapper: AuthProvider,
    });

    const { updateUser } = result.current;

    act(() => {
      updateUser(updatedUser);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(updatedUser),
    );
    expect(result.current.user).toEqual(updatedUser);
  });
});
