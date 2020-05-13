import * as React from 'react';
import WhiteboardCanvas from './WhiteboardCanvas';
import styled from 'styled-components';
import { getSidebarOpen } from '../redux/selectors';
import { useSelector } from 'react-redux';

const WhiteboardDiv = styled.div`
  border-color: ${props =>
    props.className === 'whiteboard open' ? `blue` : `rgba(100, 200, 100, 0.2)`};
  transition: border-color 1s;
  border-width: 0.5px;
  height: 500px;
  width: 650px;
  border-style: dashed;
  margin-top: 120px;
  margin-left: 30px;
`;

export default function Whiteboard() {
  const sideBarOpen = useSelector(getSidebarOpen);
  // const dispatch = useDispatch();
  return (
    <WhiteboardDiv className={sideBarOpen ? 'whiteboard open' : 'whiteboard'}>
      <WhiteboardCanvas />
    </WhiteboardDiv>
  );
}
