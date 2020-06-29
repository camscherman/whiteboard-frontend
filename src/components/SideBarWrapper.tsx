import * as React from 'react';
import styled from 'styled-components';
import ClearPane from './ClearPane';
import SideBar from './SideBar';
import { useSelector } from 'react-redux';
import { getSidebarOpen } from '../redux/selectors';

const SideWrapperDiv = styled.div`
  background-color: transparent;
  display: flex;
  width: 100%;
  height: 100vh;
  z-index: ${props => (props.className != undefined && props.className.includes('open') ? 2 : 1)};
  position: absolute;
  top: 0px;
`;

export default function SideBarWrapper() {
  const sideBarOpen = useSelector(getSidebarOpen);
  return (
    <SideWrapperDiv className={sideBarOpen ? 'open' : 'closed'}>
      <ClearPane />
      <SideBar />
    </SideWrapperDiv>
  );
}
