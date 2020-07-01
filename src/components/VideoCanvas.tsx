import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectVideo } from '../redux/actions';
import { getLocalStream } from '../redux/selectors';

import styled from 'styled-components';
const ConnectionButton = styled.button`
  background-color: #2b2d2f;
  height: 40px;
  color: white;
  font-family: 'Avenir Next';
  font-size: 18px;
  font-weight: 400;
  min-width: 80px;
  border-color: white;
  border-radius: 3px;
  border-style: solid;
  padding: 5px 10px 5px 10px;
  z-index: 2;
  margin-left: 80px;
  transition: all 0.5s;
  margin-top: 10px;

  &:hover {
    background-color: red;
    border-color: black;
    color: black;
  }
`;
const VideoDiv = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #ff0000;
`;

const ControlsRow = styled.div`
  width: 100%;
  padding: 5px 15px 5px 15px;
  height: 65px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  margin-top: 45px;
`;

const VideoContainer = styled.div`
  border-color: black;
  border-width: 0.5px;
  height: 500px;
  width: 650px;
  border-style: dashed;
  margin-left: 100px;
  margin-top: 120px;
  position: absolute;
  top: 0px;
`;

const VideoRow = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  position: fixed;
  top: 620px;
  margin-top: 5px;
`;

const LocalVideoContainer = styled.div`
  border-color: black;
  border-width: 0.5px;
  height: 100px;
  width: 130px;
  border-style: dashed;
  margin-left: 100px;
`;

const BottomSection = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 620px;
`;
const VideoStream = styled.video``;

const LocalVideoStream = styled(VideoStream)`
  transform: scaleX(-1);
`;

export default function VideoCanvas() {
  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  const dispatch = useDispatch();
  const localVideoStream = useSelector(getLocalStream);

  useEffect(() => {
    const localVideo = localVideoRef.current;
    if (localVideo != null && localVideoStream != undefined) {
      localVideo.srcObject = localVideoStream;
    }
  });

  return (
    <VideoDiv>
      <ControlsRow>
        <ConnectionButton
          onClick={() => {
            dispatch(connectVideo());
          }}
        >
          Connect
        </ConnectionButton>
        <ConnectionButton>Call</ConnectionButton>
        <ConnectionButton>Disconnect</ConnectionButton>
      </ControlsRow>
      <VideoContainer></VideoContainer>
      <BottomSection>
        <VideoRow>
          <LocalVideoContainer>
            <LocalVideoStream
              ref={localVideoRef}
              id={'local-stream'}
              autoPlay
              height={'100px'}
              width={'130px'}
            />
          </LocalVideoContainer>
        </VideoRow>
      </BottomSection>
    </VideoDiv>
  );
}
