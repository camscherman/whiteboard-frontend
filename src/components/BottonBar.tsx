import * as React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { toggleBottomBarOpen, toggleBottomBarDark } from '../redux/actions';
import { getBottomBarOpen, getBottomBarDark } from '../redux/selectors';

const BottomBarDiv = styled.div`
  background-color: ${props =>
    props.className != undefined && !props.className.includes('dark')
      ? 'rgba(0,0,0,0)'
      : 'rgba(0,0,45,0.6)'};
  border-top: ${props =>
    props.className != undefined && !props.className.includes('dark')
      ? 'solid 0.5px black'
      : 'none'};
  height: ${props =>
    props.className != undefined && props.className.includes('open')
      ? 'calc(100vh - 120px)'
      : '60px'};
  transition: border 1s, background-color 0.5s linear 0.5s, height 1s;
  transition-delay: height 1s;
  width: 100vw;
`;

const IconDiv = styled.div`
  margin-top: 10px;
  height: 35px;
  width: 55px;
  margin-left: 5px;
  padding: 5px;
  border: 1.5px;
  border-style: solid;
  border-radius: 10px;
  border-color: ${props =>
    props.className != undefined && props.className.includes('dark') ? 'white' : 'black'};
  transition: border-color 1s;
`;

const InteractiveIcon = styled.i`
  margin-top: 2px;
  font-size: 35px;
  color: ${props =>
    props.className != undefined && props.className.includes('dark') ? 'white' : 'black'};
  transform: rotate(0deg);
  transition: all 1s;
  transform: ${props =>
    props.className === 'fas fa-angle-double-up rotate' ? `rotate(-180deg)` : ''};
`;
const OpenIcon = styled(InteractiveIcon)`
  transform: rotate(0deg);
  transition: all 1s;
  transform: ${props =>
    props.className != undefined && props.className.includes('rotate') ? `rotate(-180deg)` : ``};
`;

function setIconClass(bottomBarOpen: boolean, bottomBarDark: boolean): string {
  let cls = 'fas fa-angle-double-up';
  if (bottomBarOpen) {
    cls += ' rotate';
  }
  if (bottomBarDark) {
    cls += ' dark';
  }
  return cls;
}

function setBottomBarClass(bottomBarOpen: boolean, bottomBarDark: boolean): string {
  let cls = '';
  if (bottomBarOpen) {
    cls = 'open';
  }
  if (bottomBarDark) {
    cls += ' dark';
  }
  return cls;
}

export default function BottomBar() {
  const dispatch = useDispatch();
  const bottomBarOpen = useSelector(getBottomBarOpen);
  const bottomBarDark = useSelector(getBottomBarDark);
  return (
    <BottomBarDiv className={setBottomBarClass(bottomBarOpen, bottomBarDark)}>
      <IconDiv
        onClick={() => {
          dispatch(toggleBottomBarOpen());
          if (bottomBarOpen && !bottomBarDark) {
            dispatch(toggleBottomBarDark());
          } else if (!bottomBarOpen) {
            dispatch(toggleBottomBarDark());
          }
        }}
        className={bottomBarDark ? 'dark' : ''}
      >
        <OpenIcon className={setIconClass(bottomBarOpen, bottomBarDark)} />
      </IconDiv>
    </BottomBarDiv>
  );
}
