import * as React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../redux/actions';
import { getSidebarOpen } from '../redux/selectors';

const SidebarDiv = styled.div`
  background-color: rgba(100, 200, 100, 0.2);
  height: 100vh;
  margin-left: auto;
  width: ${props => (props.className === 'sidebar open' ? '100vw' : '10vw')};
  transition-property: width;
  transition-duration: 1s;
  display: flex;
`;

const OpenButton = styled.button`
  background-color: blue;
  height: 35px;
  margin-top: 50px;
  margin-left: 10px;
  width: 80%;
  padding: 5px;
  border-radius: 5px;
  color: white;
  opacity: 100%;
  font-size: 1.2rem;
  border-color: white;
  border-style: solid;
`;

export default function SideBar() {
  const sideBarOpen = useSelector(getSidebarOpen);
  const dispatch = useDispatch();
  return (
    <SidebarDiv className={sideBarOpen ? 'sidebar open' : 'sidebar'}>
      <OpenButton
        onClick={() => {
          dispatch(toggleSidebar());
        }}
      >
        Open
      </OpenButton>
    </SidebarDiv>
  );
}
