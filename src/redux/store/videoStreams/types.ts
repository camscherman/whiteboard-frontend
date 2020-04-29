export const SET_LOCAL_STREAM = "SET_LOCAL_STREAM";
export const SET_REMOTE_STREAM = "SET_REMOTE_STREAM";

export interface VideoStreamState {
  localStream?: string;
  remoteStream?: string;
}
export interface SetLocalStreamMessage {
  localStream: string;
}

export interface SetRemoteStreamMessage {
  remoteStream: string;
}
interface SetRemoteStreamAction {
  type: typeof SET_REMOTE_STREAM;
  payload: VideoStreamState;
}

interface SetLocalStreamAction {
  type: typeof SET_LOCAL_STREAM;
  payload: VideoStreamState;
}

export type SetStreamActions = SetLocalStreamAction | SetRemoteStreamAction;
