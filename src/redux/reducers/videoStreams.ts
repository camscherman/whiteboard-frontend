import {
  SET_LOCAL_STREAM,
  SET_REMOTE_STREAM,
  SET_PEER_CONNECTION,
  VideoStreamState,
  VideoStreamActions,
  SET_REMOTE_OFFER,
  CALL_SENT,
  TRY_BEGIN_CALL,
  ADD_ICE_CANDIDATE,
  SET_CONNECTION_ESTABLISHED,
  DISCONNECT,
} from '../store/videoStreams/types';

const initialState: VideoStreamState = {
  localStream: undefined,
  remoteStream: undefined,
  peerConnection: undefined,
  remoteOffer: undefined,
  iceCandidate: undefined,
  callRequestSent: false,
  joinedCall: false,
  remoteConnectionEstablished: false,
};

export default function (state = initialState, action: VideoStreamActions): VideoStreamState {
  switch (action.type) {
    case SET_LOCAL_STREAM:
      return { ...state, localStream: action.payload.localStream };
    case TRY_BEGIN_CALL:
      return { ...state, joinedCall: true };
    case SET_REMOTE_STREAM:
      return { ...state, remoteStream: action.payload.remoteStream };
    case DISCONNECT:
      return { ...state, joinedCall: false };
    case SET_PEER_CONNECTION:
      return { ...state, peerConnection: action.payload.peerConnection };
    case CALL_SENT:
      return { ...state, callRequestSent: true };
    case SET_REMOTE_OFFER:
      return { ...state, remoteOffer: action.payload.remoteOffer };
    case SET_CONNECTION_ESTABLISHED:
      return { ...state, remoteConnectionEstablished: true };
    case ADD_ICE_CANDIDATE:
      if (action.payload.candidate != null) {
        return { ...state, iceCandidate: action.payload };
      }
    default:
      return state;
  }
}
