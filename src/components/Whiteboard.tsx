import * as React from 'react';
import WhiteboardCanvas from './WhiteboardCanvas';
import styled from 'styled-components';
import { getSidebarDark } from '../redux/selectors';
import { useSelector } from 'react-redux';

const WhiteboardDiv = styled.div`
  border-color: ${props =>
    props.className != undefined && props.className.includes('light') ? `black` : `white`};
  transition: border-color 1s;
  border-width: 1.5px;
  height: 500px;
  width: 650px;
  border-style: solid;
  margin-top: 120px;
  margin-left: 0px;
`;

export default function Whiteboard() {
  const sideBarDark = useSelector(getSidebarDark);
  // const dispatch = useDispatch();
  return (
    <WhiteboardDiv className={sideBarDark ? 'whiteboard dark' : 'whiteboard light'}>
      <WhiteboardCanvas />
    </WhiteboardDiv>
  );
}
