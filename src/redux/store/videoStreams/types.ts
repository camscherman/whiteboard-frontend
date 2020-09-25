export const SET_LOCAL_STREAM = 'SET_LOCAL_STREAM';
export const SET_REMOTE_STREAM = 'SET_REMOTE_STREAM';
export const SET_PEER_CONNECTION = 'SET_PEER_CONNECTION';
export const CONNECT = 'CONNECT';
export const CALL = 'CALL';
export const CALL_SENT = 'CALL_SENT';
export const ANSWER_CALL = 'ANSWER_CALL';
export const SET_REMOTE_OFFER = 'SET_REMOTE_OFFER';
export const ADD_ICE_CANDIDATE = 'ADD_ICE_CANDIDATE';
export const SET_CONNECTION_ESTABLISHED = 'SET_CONNECTION_ESTABLISHED';

export const EMPTY_VIDEO_ACTION = 'EMPTY_ACTION';

export interface VideoStreamState {
  localStream?: MediaStream;
  remoteStream?: MediaStream;
  peerConnection?: RTCPeerConnection;
  remoteOffer?: RTCSessionDescriptionInit;
  iceCandidate?: RTCIceCandidate;
  callRequestSent: boolean;
  remoteConnectionEstablished: boolean;
}
export interface SetLocalStreamMessage {
  localStream: MediaStream;
}

export interface SetRemoteStreamMessage {
  remoteStream: MediaStream;
}

export interface SetPeerConnectionMessage {
  peerConnection: RTCPeerConnection;
}

export interface SetRemoteOfferMessage {
  remoteOffer: RTCSessionDescriptionInit;
}
interface SetRemoteStreamAction {
  type: typeof SET_REMOTE_STREAM;
  payload: SetRemoteStreamMessage;
}

interface SetLocalStreamAction {
  type: typeof SET_LOCAL_STREAM;
  payload: SetLocalStreamMessage;
}

interface SetPeerConnectionAction {
  type: typeof SET_PEER_CONNECTION;
  payload: SetPeerConnectionMessage;
}
interface SetConnectionEstablishedAction {
  type: typeof SET_CONNECTION_ESTABLISHED;
}

interface SetRemoteOfferAction {
  type: typeof SET_REMOTE_OFFER;
  payload: SetRemoteOfferMessage;
}

interface ConnectAction {
  type: typeof CONNECT;
}

interface CallAction {
  type: typeof CALL;
}

interface CallSentAction {
  type: typeof CALL_SENT;
}

interface AnswerAction {
  type: typeof ANSWER_CALL;
}

interface EmptyVideoAction {
  type: typeof EMPTY_VIDEO_ACTION;
}
interface AddIceCandidateAction {
  type: typeof ADD_ICE_CANDIDATE;
  payload: RTCIceCandidate;
}

export type VideoStreamActions =
  | SetLocalStreamAction
  | SetRemoteStreamAction
  | SetPeerConnectionAction
  | SetRemoteOfferAction
  | CallSentAction
  | AddIceCandidateAction
  | SetConnectionEstablishedAction
  | EmptyVideoAction;
export type VideoConnectionActions = ConnectAction | CallAction | AnswerAction;
