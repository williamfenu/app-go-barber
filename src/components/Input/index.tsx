import React, {
  useState,
  useEffect,
  useRef,
  InputHTMLAttributes,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { Container, Error } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<InputProps> = ({ icon: Icon, name, ...rest }) => {
  const [isFocused, setFocus] = useState(false);
  const [isFilled, setFilled] = useState(false);
  const { fieldName, registerField, error, defaultValue } = useField(name);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = useCallback(() => {
    setFocus(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocus(false);

    setFilled(!!inputRef.current?.value);
  }, []);

  useEffect(
    () =>
      registerField({
        name: fieldName,
        ref: inputRef.current,
        path: 'value',
      }),
    [fieldName, registerField],
  );

  return (
    <Container
      hasError={!!error}
      filled={isFilled}
      focus={isFocused}
      data-testid="input-container"
    >
      {Icon && <Icon size={20} />}
      <input
        onFocus={handleFocus}
        onBlur={handleBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      />
      {error && (
        <Error text={error}>
          <FiAlertCircle size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Input;
