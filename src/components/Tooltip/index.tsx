import React from 'react';

import { Container } from './styles';

interface TooltipProps {
  text: string;
  className?: string;
}

const ToolTip: React.FC<TooltipProps> = ({ children, className, text }) => {
  return (
    <Container className={className}>
      <span>{text}</span>
      {children}
    </Container>
  );
};

export default ToolTip;
