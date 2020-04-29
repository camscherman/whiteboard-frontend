import {
  SET_LOCAL_STREAM,
  SET_REMOTE_STREAM,
  VideoStreamState,
  SetStreamActions,
} from "../store/videoStreams/types";

const initialState: VideoStreamState = {
  localStream: "",
  remoteStream: "",
};

export default function (
  state = initialState,
  action: SetStreamActions
): VideoStreamState {
  switch (action.type) {
    case SET_LOCAL_STREAM:
      return { ...state };
    case SET_REMOTE_STREAM:
      return { ...state };
    default:
      return state;
  }
}
