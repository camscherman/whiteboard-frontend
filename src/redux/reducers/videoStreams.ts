import {
  SET_LOCAL_STREAM,
  SET_REMOTE_STREAM,
  SET_PEER_CONNECTION,
  VideoStreamState,
  VideoStreamActions,
  SET_REMOTE_OFFER,
} from '../store/videoStreams/types';

const initialState: VideoStreamState = {
  localStream: undefined,
  remoteStream: undefined,
  peerConnection: undefined,
  remoteOffer: undefined,
  remoteConnectionEstablished: false,
};

export default function (state = initialState, action: VideoStreamActions): VideoStreamState {
  switch (action.type) {
    case SET_LOCAL_STREAM:
      return { ...state, localStream: action.payload.localStream };
    case SET_REMOTE_STREAM:
      return { ...state, remoteStream: action.payload.remoteStream };
    case SET_PEER_CONNECTION:
      return { ...state, peerConnection: action.payload.peerConnection };
    case SET_REMOTE_OFFER:
      return { ...state, remoteOffer: action.payload.remoteOffer };
    default:
      return state;
  }
}
