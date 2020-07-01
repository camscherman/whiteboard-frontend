import * as React from 'react';
import styled from 'styled-components';
import BottomBar from './BottonBar';
import VerticalClearPane from './VerticalClearPane';
import { useSelector } from 'react-redux';
import { getBottomBarOpen } from '../redux/selectors';

const BottomWrapperDiv = styled.div`
  background-color: transparent;
  display: flex;
  width: 100%;
  height: calc(100vh - 120px);
  position: absolute;
  top: 120px;
  flex-direction: column;
  z-index: ${props => (props.className != 'undefined' && props.className == 'open' ? 2 : 1)};
`;

export default function BottomBarWrapper() {
  const bottomBarOpen = useSelector(getBottomBarOpen);
  return (
    <BottomWrapperDiv className={bottomBarOpen ? 'open' : 'closed'}>
      <VerticalClearPane />
      <BottomBar />
    </BottomWrapperDiv>
  );
}
