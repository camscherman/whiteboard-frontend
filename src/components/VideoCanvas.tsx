import * as React from 'react';

import styled, { ThemeProvider } from 'styled-components';
const Button = styled.button`
  color: 'blue';
`;
const VideoDiv = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: yellow;
  z-index: -100;
`;

export default function VideoCanvas() {
  return (
    <VideoDiv>
      <div className="parent-container"></div>
    </VideoDiv>
  );
}
