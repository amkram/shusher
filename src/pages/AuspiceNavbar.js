// Adapted from auspice.us
// https://github.com/nextstrain/auspice.us

import React from "react";
import { connect } from "react-redux";
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
  this.props.dispatch({type: "PAGE_CHANGE", displayComponent: "splash"});
}

const AuspiceNavBar = ({narrativeTitle, sidebar}) => {
  return (
  <p>Hello</p>
  )
  // if (!sidebar) return null;
  // return (
  //    <NavBarContainer>
  //      <BackToUsher backToUsher={goBack}/>
  //    </NavBarContainer>
  // );
}


export default connect()(AuspiceNavBar);
