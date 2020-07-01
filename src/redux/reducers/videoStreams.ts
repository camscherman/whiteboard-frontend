import {
  SET_LOCAL_STREAM,
  SET_REMOTE_STREAM,
  VideoStreamState,
  SetStreamActions,
} from '../store/videoStreams/types';

const initialState: VideoStreamState = {
  localStream: undefined,
  remoteStream: undefined,
};

export default function (state = initialState, action: SetStreamActions): VideoStreamState {
  switch (action.type) {
    case SET_LOCAL_STREAM:
      return { ...state, localStream: action.payload.localStream };
    case SET_REMOTE_STREAM:
      return { ...state, remoteStream: action.payload.remoteStream };
    default:
      return state;
  }
}
