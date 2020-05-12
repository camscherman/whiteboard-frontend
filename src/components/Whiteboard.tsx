import * as React from 'react';
import WhiteboardCanvas from './WhiteboardCanvas';
import styled from 'styled-components';

const WhiteboardDiv = styled.div`
  position: absolute;
`;

export default function Whiteboard() {
  // const dispatch = useDispatch();
  return (
    <div
      className="parent-container-blue"
      // onKeyDown={(e) => {
      //   if (e.keyCode === 17) {
      //     console.log("here");
      //     dispatch(mouseDown({ x: e.clientX, y: e.clientY }));
      //   }
      // }}
    >
      <WhiteboardCanvas />
    </div>
  );
}
