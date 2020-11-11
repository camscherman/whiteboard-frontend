import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  connectVideo,
  callRequestSent,
  callAnswer,
  joinCall,
  disconnectVideo,
} from '../redux/actions';
import { getLocalStream, getRemoteOffer, getRemoteStream, getJoinedCall } from '../redux/selectors';

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
  visibility: ${props =>
    props.className != undefined && props.className.includes('hidden') ? 'hidden' : 'visible'};

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

const RemoteVideoStream = styled(VideoStream)``;

export default function VideoCanvas() {
  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  const remoteVideoRef = React.useRef<HTMLVideoElement>(null);
  const dispatch = useDispatch();
  const localVideoStream = useSelector(getLocalStream);
  const remoteVideoStream = useSelector(getRemoteStream);
  const remoteOffer = useSelector(getRemoteOffer);
  const joinedCall = useSelector(getJoinedCall);
  const dispatchCall = () => {
    dispatch(callRequestSent());
    dispatch(joinCall());
  };

  const unsetVideoStream = (videoElement: HTMLVideoElement) => {
    (videoElement.srcObject as MediaStream).getTracks().forEach(track => track.stop());
  };

  useEffect(() => {
    const localVideo = localVideoRef.current;
    const remoteVideo = remoteVideoRef.current;
    if (localVideo != null && localVideoStream != undefined) {
      localVideo.srcObject = localVideoStream;
    }
    if (remoteVideo != null && remoteVideoStream != undefined) {
      remoteVideo.srcObject = remoteVideoStream;
    }
    if (!joinedCall && remoteOffer != null && localVideo != null && localVideo.srcObject != null) {
      unsetVideoStream(localVideo);
    }
    if (
      !joinedCall &&
      remoteOffer != null &&
      remoteVideo != null &&
      remoteVideo.srcObject != null
    ) {
      unsetVideoStream(remoteVideo);
    }
    // TODO - dispatch closePeerConnectionAction (calls peerConnection.close() then sets it to undefined)
  });

  // const dispatchDisconnect = () => {
  //   const localVideo = localVideoRef.current;
  //   const remoteVideo = remoteVideoRef.current;
  //   if (localVideo != null && localVideo.srcObject != null) {
  //     unsetVideoStream(localVideo);
  //   }
  //   if (remoteVideo != null) {
  //     unsetVideoStream(remoteVideo);
  //   }
  //   dispatch(disconnectVideo());
  // };

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
        <ConnectionButton onClick={() => dispatchCall()}>Join</ConnectionButton>
        <ConnectionButton onClick={() => dispatch(disconnectVideo())}>Disconnect</ConnectionButton>
        <ConnectionButton
          onClick={() => dispatch(callAnswer())}
          className={remoteOffer == undefined ? 'hidden' : ''}
        >
          Answer
        </ConnectionButton>
      </ControlsRow>
      <VideoContainer>
        <RemoteVideoStream
          ref={remoteVideoRef}
          id={'remote-stream'}
          autoPlay
          height={'500px'}
          width={'650px'}
        />
      </VideoContainer>
      <BottomSection>
        <VideoRow>
          <LocalVideoContainer>
            <LocalVideoStream
              ref={localVideoRef}
              id={'local-stream'}
              autoPlay
              muted
              height={'100px'}
              width={'130px'}
            />
          </LocalVideoContainer>
        </VideoRow>
      </BottomSection>
    </VideoDiv>
  );
}
