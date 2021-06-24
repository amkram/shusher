// Adapted from auspice.us
// https://github.com/nextstrain/auspice.us

import React from "react";
import styled from 'styled-components';
import BackToUsher from '../components/BackToUsher';

const NavBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Title = styled.a`
  padding: 0px;
  color: #000;
  text-decoration: none;
  color: ${(props) => props.theme.color};
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
`;

const goBack = () => {
  console.log('going back')
//  window.goBack = true;
}

const AuspiceNavBar = ({narrativeTitle, sidebar}) => {
  if (!sidebar) return null;
  return (
     <NavBarContainer>
       <BackToUsher backToUsher={goBack}/>
     </NavBarContainer>
  );
}


export default AuspiceNavBar;
