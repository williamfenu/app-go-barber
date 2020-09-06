import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  *{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    outline: none;
  }

  body{
    -webkit-font-smoothing: antialiased;
    background: #312E38;
    color: #fff;
  }

  body, input, button {
    font-family: "Roboto Slab", serif;
    font-size: 16px;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
  }

  button {
    cursor: pointer;
  }
`;
