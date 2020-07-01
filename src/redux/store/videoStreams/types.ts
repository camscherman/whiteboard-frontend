export const SET_LOCAL_STREAM = 'SET_LOCAL_STREAM';
export const SET_REMOTE_STREAM = 'SET_REMOTE_STREAM';
export const CONNECT = 'CONNECT';

export interface VideoStreamState {
  localStream?: MediaStream;
  remoteStream?: MediaStream;
}
export interface SetLocalStreamMessage {
  localStream: MediaStream;
}

export interface SetRemoteStreamMessage {
  remoteStream: MediaStream;
}
interface SetRemoteStreamAction {
  type: typeof SET_REMOTE_STREAM;
  payload: SetRemoteStreamMessage;
}

interface SetLocalStreamAction {
  type: typeof SET_LOCAL_STREAM;
  payload: SetLocalStreamMessage;
}

interface ConnectAction {
  type: typeof CONNECT;
}

export type SetStreamActions = SetLocalStreamAction | SetRemoteStreamAction;
export type VideoConnectionActions = ConnectAction;
