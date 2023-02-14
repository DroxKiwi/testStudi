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

// Application d'un theme depuis le parent
const CallToClick = styled(ButtonStyled)`
  background-color: ${props => props.theme.brand ?? '#ff4757'};
  color: ${props => props.theme.neutral100 ?? '#F5F5F5'};
`;

const ButtonSOVRtheme = () => {
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

export default ButtonSOVRtheme;