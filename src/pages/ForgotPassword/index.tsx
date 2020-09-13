import React, { useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiMail } from 'react-icons/fi';
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

interface ForgotPasswordFormDate {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormDate): Promise<void> => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('O campo e-mail é obrigatório')
            .email('É necessário informar um e-mail válido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', { email: data.email });

        addToast({
          title: 'Email de recuperação enviado',
          type: 'success',
          message: `Foi enviado um email de recuperação para ${data.email}`,
        });
      } catch (err) {
        if (!(err instanceof Yup.ValidationError)) {
          addToast({
            title: 'Erro na recuperação de senha',
            type: 'error',
            message: 'Houve problema ao tentar realizar a recuperação de senha',
          });
          return;
        }
        const Errors = getValidationErrors(err);
        formRef.current?.setErrors(Errors);
      } finally {
        setLoading(false);
      }
    },
    [addToast, setLoading],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="go-barber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Button type="submit" isLoading={loading}>
              Recuperar
            </Button>
          </Form>
          <Link to="/">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
