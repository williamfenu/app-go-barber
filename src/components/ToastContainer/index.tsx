import React from 'react';

import { useTransition } from 'react-spring';
import { ToastContent } from '../../hooks/toast';
import Toast from './Toast';

import { Container } from './styles';

interface ToastProps {
  toasts: ToastContent[];
}

const ToastContainer: React.FC<ToastProps> = ({ toasts }) => {
  const toastWithTransitions = useTransition(toasts, toast => toast.id, {
    from: { right: '-120%', opacity: '0' },
    enter: { right: '0%', opacity: '1' },
    leave: { right: '-120%', opacity: '0' },
  });
  return (
    <Container>
      {toastWithTransitions.map(({ item, key, props }) => (
        <Toast key={key} toast={item} style={props} />
      ))}
    </Container>
  );
};

export default ToastContainer;
