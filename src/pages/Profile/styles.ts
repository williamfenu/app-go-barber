import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  display: block;

  header {
    height: 144px;
    background-color: #28262e;

    display: flex;
    align-items: center;

    div {
      max-width: 1120px;
      margin: 0 auto;
      flex: 1;

      svg {
        color: #999591;
        width: 24px;
        height: 24px;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  place-content: center;
  flex-direction: column;
  align-items: center;
  margin: -176px auto 0;

  width: 100%;
  max-width: 700px;

  form {
    margin: 80px 0px 30px;
    width: 340px;
    text-align: left;
    display: flex;
    flex-direction: column;

    h1 {
      margin-bottom: 24px;
      font-size: 16px;
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

export const PasswordSection = styled.section`
  margin-top: 24px;
`;

export const ProfileImage = styled.div`
  margin-bottom: 32px;
  position: relative;
  align-self: center;

  img {
    width: 176;
    height: 176px;
    border-radius: 50%;
  }

  input {
    display: none;
  }

  label {
    border: none;
    background: #ff9000;
    width: 48px;
    height: 48px;
    cursor: pointer;
    border-radius: 50%;
    position: absolute;
    bottom: 0;
    right: 0;
    transition: background-color 0.2s;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }

    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }
  }
`;
