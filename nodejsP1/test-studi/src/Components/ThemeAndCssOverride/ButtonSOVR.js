import React from 'react';
import styled from 'styled-components/macro';

const ButtonStyled = styled.button`
  padding: 1rem 2rem;
  margin: 4rem 1rem;
  border: 0;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  background-color: #E5E5E5;
  color: #404040;
`;

const CallToClick = styled(ButtonStyled)`
  background-color: #ff4757;
  color: #f5f5f5;
`;

const ButtonSOVR = () => {
  return (
    <>
      <ButtonStyled>
        Click me
      </ButtonStyled>

      <CallToClick>
        Call to click
      </CallToClick>
    </>
  );
};

export default ButtonSOVR;