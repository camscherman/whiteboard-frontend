import * as React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, toggleSidebarDark } from '../redux/actions';
import { getSidebarOpen, getSidebarDark, getBottomBarOpen } from '../redux/selectors';
import Whiteboard from './Whiteboard';
import TextEditor from './TextEditor';

function sideBarWidth(className: string): string {
  if (className.includes('hidden')) {
    return '0px';
  } else if (className.includes('open')) {
    return 'calc(100vw - 20px)';
  } else {
    return '70px';
  }
}

const SidebarDiv = styled.div`
  background-color: ${props =>
    props.className != undefined && !props.className.includes('dark')
      ? 'rgba(0,0,0,0)'
      : 'rgba(0,0,45,0.6)'};
  height: 100vh;
  margin-left: auto;
  width: ${props => props.className != undefined && sideBarWidth(props.className)};
  transition: width 1s, background-color 1s linear 0.5s;
  display: flex;
  border-left: solid rgba(0, 0, 0, 0.7) 0.5px;
  overflow: hidden;
`;

const InteractiveIcon = styled.i`
  margin-top: 5px;
  font-size: 45px;
  color: ${props =>
    props.className != undefined && props.className.includes('dark') ? 'white' : 'black'};
  transform: rotate(0deg);
  transition: all 1s;
  transform: ${props =>
    props.className === 'fas fa-angle-double-left rotate' ? `rotate(-180deg)` : ''};
`;
const AdjustIcon = styled(InteractiveIcon)`
  font-size: 40px;
  margin-top: 5px;
`;

const OpenIcon = styled(InteractiveIcon)`
  transform: rotate(0deg);
  transition: all 1s;
  transform: ${props =>
    props.className != undefined && props.className.includes('rotate') ? `rotate(-180deg)` : ``};
`;

const IconDiv = styled.div`
  margin-top: 50px;
  height: 55px;
  width: 55px;
  margin-left: 10px;
  padding: 5px;
  border: 1.5px;
  border-style: solid;
  border-radius: 10px;
  border-color: ${props =>
    props.className != undefined && props.className.includes('dark') ? 'black' : 'white'};
`;

function setSidebarClass(sidebarOpen: boolean, sidebarDark: boolean, bottomBarOpen: boolean) {
  let cls = 'sidebar';
  if (sidebarOpen) {
    cls = cls + ' open';
  }
  if (sidebarDark) {
    cls = cls + ' dark';
  }
  if (bottomBarOpen) {
    cls = cls + ' hidden';
  }
  return cls;
}

function setOpenIconClass(sidebarOpen: boolean, sidebarDark: boolean) {
  let cls = 'fas fa-angle-double-left';
  if (sidebarOpen) {
    cls += ' rotate';
  }
  if (sidebarDark) {
    cls += ' dark';
  }
  return cls;
}

export default function SideBar() {
  const sideBarOpen = useSelector(getSidebarOpen);
  const sideBarDark = useSelector(getSidebarDark);
  const bottomBarOpen = useSelector(getBottomBarOpen);
  const dispatch = useDispatch();
  return (
    <SidebarDiv className={setSidebarClass(sideBarOpen, sideBarDark, bottomBarOpen)}>
      <IconDiv className={sideBarDark ? 'light' : 'dark'}>
        <OpenIcon
          className={setOpenIconClass(sideBarOpen, sideBarDark)}
          onClick={() => {
            dispatch(toggleSidebar());
            if (sideBarOpen && !sideBarDark) {
              dispatch(toggleSidebarDark());
            } else if (!sideBarOpen) {
              dispatch(toggleSidebarDark());
            }
          }}
        ></OpenIcon>
      </IconDiv>
      <Whiteboard />
      <IconDiv className={sideBarDark ? 'light' : 'dark'}>
        <AdjustIcon
          className={sideBarDark ? 'fas fa-adjust dark' : 'fas fa-adjust'}
          onClick={() => {
            dispatch(toggleSidebarDark());
          }}
        ></AdjustIcon>
      </IconDiv>
      <TextEditor />
    </SidebarDiv>
  );
}
