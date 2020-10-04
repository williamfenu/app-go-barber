import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import Input from '../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField: () => ({
      fieldName: 'email',
      registerField: jest.fn(),
      error: '',
      defaultValue: '',
    }),
  };
});

describe('Input component', () => {
  it('should be able to render input', () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    );
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });

  it('should be able to highlight input on focus', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );
    const inputElement = getByPlaceholderText('E-mail');
    const containerInput = getByTestId('input-container');

    fireEvent.focus(inputElement);

    expect(containerInput).toHaveStyle('border-color: #ff9000');
    expect(containerInput).toHaveStyle('color: #ff9000');
  });

  it('should be able to highlight back to the original color input on blur', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );
    const inputElement = getByPlaceholderText('E-mail');
    const containerInput = getByTestId('input-container');

    fireEvent.blur(inputElement);

    await wait(() => {
      expect(containerInput).not.toHaveStyle('border-color: #ff9000');
      expect(containerInput).not.toHaveStyle('color: #ff9000');
    });
  });

  it('should be able to keep the highlight color input if it is filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );
    const inputElement = getByPlaceholderText('E-mail');
    const containerInput = getByTestId('input-container');

    fireEvent.change(inputElement, {
      target: { value: 'johndoe@example.com' },
    });

    fireEvent.blur(inputElement);

    await wait(() => {
      expect(containerInput).toHaveStyle('color: #ff9000');
    });
  });
});
