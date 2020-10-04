import React, { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiMail, FiUser, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import logo from '../../assets/go-barber-logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';

interface cadastroProps {
  name: string;
  email: string;
  password: string;
}

interface ResponseData {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { signIn } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: cadastroProps): Promise<void> => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('O campo nome é obrigatório'),
          email: Yup.string()
            .required('O campo e-mail é obrigatório')
            .email('É necessário informar um e-mail válido'),
          password: Yup.string().min(
            6,
            'A senha deve ter mais de 6 caracteres',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post<ResponseData>('/users', data);

        signIn({ email: data.email, password: data.password });
        addToast({
          title: 'Cadastro realizado com sucesso',
          type: 'success',
          message: 'O cadastro foi realizado com sucesso!',
        });
      } catch (err) {
        if (!(err instanceof Yup.ValidationError)) {
          addToast({
            title: 'Erro de cadastro',
            type: 'error',
            message: 'Houve problema ao cadastrar o usuário',
          });
          return;
        }
        const Errors = getValidationErrors(err);
        formRef.current?.setErrors(Errors);
      }
    },
    [addToast, signIn],
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logo} alt="go-barber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu Cadastro</h1>
            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />
            <Button type="submit">Cadastrar</Button>
          </Form>
          <Link to="/">
            <FiLogIn />
            Voltar para o logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignIn;
