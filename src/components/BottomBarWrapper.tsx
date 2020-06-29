import * as React from 'react';
import styled from 'styled-components';
import BottomBar from './BottonBar';
import VerticalClearPane from './VerticalClearPane';

const BottomWrapperDiv = styled.div`
  background-color: transparent;
  display: flex;
  width: 100%;
  height: calc(100vh - 120px);
  position: absolute;
  top: 120px;
  flex-direction: column;
  z-index: 1;
`;

export default function BottomBarWrapper() {
  return (
    <BottomWrapperDiv>
      <VerticalClearPane />
      <BottomBar />
    </BottomWrapperDiv>
  );
}
