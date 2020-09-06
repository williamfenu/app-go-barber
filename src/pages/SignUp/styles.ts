import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

import backgroundSignUp from '../../assets/sign-up-background.png';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`;

const animation = keyframes`
  from{
    transform: translateX(50px);
    opacity: 0;
  }
  to {
    transform: translateX(0px)
    opacity: 1;
  }
`;

export const Content = styled.div`
  display: flex;
  place-content: center;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: 700px;
`;

export const AnimationContainer = styled.div`
  animation: 1s ${animation};
  display: flex;
  place-content: center;
  flex-direction: column;
  align-items: center;

  form {
    margin: 80px 0px 30px;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }

    > a {
      text-decoration: none;
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }

  > a {
    text-decoration: none;
    color: #ff9000;
    display: flex;
    align-items: center;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, '#ff9000')};
    }

    svg {
      margin-right: 16px;
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${backgroundSignUp}) no-repeat center;
  background-size: cover;
`;
