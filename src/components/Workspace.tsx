import * as React from 'react';
import SideBarWrapper from './SideBarWrapper';
import BottomBarWrapper from './BottomBarWrapper';
import VideoCanvas from './VideoCanvas';
import styled from 'styled-components';

const WorkspaceDiv = styled.div``;

export default function Workspace() {
  return (
    <WorkspaceDiv>
      <VideoCanvas />
      <SideBarWrapper />
      <BottomBarWrapper />
    </WorkspaceDiv>
  );
}
