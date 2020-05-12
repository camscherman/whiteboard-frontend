import * as React from 'react';
import styled from 'styled-components';
import ClearPane from './ClearPane';
import SideBar from './SideBar';

const WrapperDiv = styled.div`
  background-color: transparent;
  display: flex;
  width: 100%;
  height: 100vh;
`;

export default function MainWrapper() {
  return (
    <WrapperDiv>
      <ClearPane />
      <SideBar />
    </WrapperDiv>
  );
}
