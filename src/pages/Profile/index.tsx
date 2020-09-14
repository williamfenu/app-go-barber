import React, { useRef, useCallback, ChangeEvent } from 'react';
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { Link } from 'react-router-dom';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, PasswordSection, ProfileImage } from './styles';
import { useToast } from '../../hooks/toast';

interface cadastroProps {
  name: string;
  email: string;
  oldPassword: string;
  password: string;
  confirmationPassword: string;
}

interface ResponseData {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { user, updateUser } = useAuth();
  const history = useHistory();
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
          oldPassword: Yup.string(),
          password: Yup.string().when('oldPassword', {
            is: value => !!value,
            then: Yup.string().required('Necessário informar a nova senha'),
            otherwise: Yup.string(),
          }),
          confirmationPassword: Yup.string().oneOf(
            [Yup.ref('password')],
            'A nova senha e a confirmação não conferem',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.put<ResponseData>('/profile', data);

        updateUser(response.data.user);

        addToast({
          title: 'Perfil Atualizado',
          type: 'success',
          message: 'O perfil foi atualizado com sucesso',
        });

        history.push('/dashboard');
      } catch (err) {
        if (!(err instanceof Yup.ValidationError)) {
          addToast({
            title: 'Erro de atualização',
            type: 'error',
            message: 'Houve problema ao atualizar o perfil',
          });
          return;
        }
        const Errors = getValidationErrors(err);
        formRef.current?.setErrors(Errors);
      }
    },
    [addToast, history, updateUser],
  );

  const handleChangeAvatar = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;
      if (files) {
        const data = new FormData();

        data.append('avatar', files[0]);
        api.patch<ResponseData>('users/avatar', data).then(response => {
          updateUser(response.data.user);

          addToast({
            type: 'success',
            title: 'Alteração de avatar',
            message: 'Avatar Alterado com sucesso!',
          });
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{ name: user.name, email: user.email }}
          onSubmit={handleSubmit}
        >
          <ProfileImage>
            <img src={user.avatarUrl} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleChangeAvatar} />
            </label>
          </ProfileImage>
          <h1>Meu perfil</h1>
          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <PasswordSection>
            <Input
              name="oldPassword"
              icon={FiLock}
              type="password"
              placeholder="Senha atual"
            />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />
            <Input
              name="confirmationPassword"
              icon={FiLock}
              type="password"
              placeholder="Confirmar senha"
            />
          </PasswordSection>
          <Button type="submit">Confirmar Mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
