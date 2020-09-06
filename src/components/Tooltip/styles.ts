import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  &:hover span {
    opacity: 1;
    visibility: visible;
  }

  span {
    position: absolute;
    bottom: calc(100% + 12px);
    font-size: 12px;
    width: 250px;
    padding: 5px;
    background: #ff9000;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.4s;
    visibility: hidden;
    color: #312e38;

    &::before {
      content: '';
      border-style: solid;
      border-color: #ff9000 transparent;
      border-width: 6px 6px 0 6px;
      top: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;
