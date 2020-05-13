import * as React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../redux/actions';
import { getSidebarOpen } from '../redux/selectors';
import Whiteboard from './Whiteboard';

const SidebarDiv = styled.div`
  background-color: ${props => (props.className === 'sidebar open' ? 'white' : 'rgba(0,0,0,0.7)')};
  height: 100vh;
  margin-left: auto;
  width: ${props => (props.className === 'sidebar open' ? `calc(100vw - 25px)` : '5vw')};
  transition: width 1s, background-color 1s linear 0.5s;
  display: flex;
  border-left: solid rgba(0, 0, 0, 0.7) 0.5px;
`;

const OpenIcon = styled.i`
  margin-top: 50px;
  font-size: 45px;
  color: ${props => (props.className === 'fas fa-angle-double-left rotate' ? 'black' : 'white')};
  transform: rotate(0deg);
  transition: all 1s;
  transform: ${props =>
    props.className === 'fas fa-angle-double-left rotate' ? `rotate(-180deg)` : ''};
`;

const IconDiv = styled.i`
  margin-top: 50px;
  height: 45px;
  width: 45px;
  margin-left: 10px;
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
      <IconDiv>
        <OpenIcon
          className={sideBarOpen ? 'fas fa-angle-double-left rotate' : 'fas fa-angle-double-left'}
          onClick={() => {
            dispatch(toggleSidebar());
          }}
        ></OpenIcon>
      </IconDiv>
      <Whiteboard />
    </SidebarDiv>
  );
}
