import React, { useRef, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';

import logo from '../../assets/go-barber-logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';

interface IResetPassword {
  password: string;
  confirmationPassword: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const location = useLocation();
  const history = useHistory();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: IResetPassword): Promise<void> => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          password: Yup.string().required('A senha é obrigatória'),
          confirmationPassword: Yup.string().oneOf(
            [Yup.ref('password')],
            'O passwords não são iguais',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const token = location.search.replace('?token=', '');

        await api.post('/password/reset', {
          password: data.password,
          confirmationPassword: data.confirmationPassword,
          token,
        });

        addToast({
          title: 'Troca de senha efetuada com sucesso',
          type: 'success',
          message: 'A troca de senha foi realizada com sucesso',
        });

        history.push('/');
      } catch (err) {
        if (!(err instanceof Yup.ValidationError)) {
          addToast({
            title: 'Erro de autenticação',
            type: 'error',
            message: 'Houve problema ao autenticar',
          });
          return;
        }
        const Errors = getValidationErrors(err);
        formRef.current?.setErrors(Errors);
      }
    },
    [addToast, history, location.search],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="go-barber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Alterar senha</h1>
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="senha"
            />

            <Input
              name="confirmationPassword"
              icon={FiLock}
              type="password"
              placeholder="Confirmação da senha"
            />
            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
