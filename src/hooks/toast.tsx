import React, { createContext, useState, useCallback, useContext } from 'react';
import { uuid } from 'uuidv4';

import Toast from '../components/ToastContainer';

export interface ToastContent {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastContextData {
  addToast(commingtoast: Omit<ToastContent, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const [toasts, setToast] = useState<ToastContent[]>([]);

  const addToast = useCallback(
    (commingToast: Omit<ToastContent, 'id'>): void => {
      const id = uuid();
      const obj: ToastContent = { id, ...commingToast };
      setToast(state => [...state, obj]);
    },
    [],
  );

  const removeToast = useCallback((id: string): void => {
    setToast(state => state.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <Toast toasts={toasts} />
    </ToastContext.Provider>
  );
};

const useToast = (): ToastContextData => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

export { ToastProvider, useToast };
