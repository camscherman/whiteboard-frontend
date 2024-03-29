import {
  DRAW_TO_CANVAS,
  MOUSE_DOWN,
  MOUSE_UP,
  REMOTE_MOUSE_DOWN,
  REMOTE_MOUSE_UP,
  WhiteboardActionTypes,
  DrawMessage,
  RemoteDrawMessage,
  EMPTY_ACTION,
} from './store/whiteboardCanvas/types';

import {
  SET_LOCAL_STREAM,
  SET_REMOTE_STREAM,
  CONNECT,
  EMPTY_VIDEO_ACTION,
  VideoStreamActions,
  SetRemoteStreamMessage,
  SetPeerConnectionMessage,
  SetLocalStreamMessage,
  VideoConnectionActions,
  SET_PEER_CONNECTION,
  RESET_VIDEO_STREAM_STATE,
  SET_CONNECTION_ESTABLISHED,
  CALL,
  JOIN_CALL,
  LOCAL_DISCONNECT,
  REMOTE_DISCONNECT,
  SET_REMOTE_OFFER,
  SetRemoteOfferMessage,
  ANSWER_CALL,
  CALL_SENT,
  ADD_ICE_CANDIDATE,
  TRY_BEGIN_CALL,
} from './store/videoStreams/types';

import { NotePadActions, POST_NOTE } from './store/notePad/types';

import {
  DashboardActionTypes,
  TOGGLE_SIDEBAR,
  TOGGLE_SIDEBAR_DARK,
  TOGGLE_BOTTOMBAR_OPEN,
  TOGGLE_BOTTOMBAR_DARK,
} from './store/dashboard/types';
import { REMOTE_DRAW_TO_CANVAS } from './actionTypes';
export const drawToCanvas = ({ x, y, prevX, prevY }: DrawMessage): WhiteboardActionTypes => ({
  type: DRAW_TO_CANVAS,
  payload: { x, y, prevX, prevY },
});

export const remoteDrawToCanvas = ({
  remoteX,
  remoteY,
  prevRemoteX,
  prevRemoteY,
}: RemoteDrawMessage): WhiteboardActionTypes => ({
  type: REMOTE_DRAW_TO_CANVAS,
  payload: { remoteX, remoteY, prevRemoteX, prevRemoteY },
});

export const mouseDown = ({ x, y }: DrawMessage): WhiteboardActionTypes => ({
  type: MOUSE_DOWN,
  payload: { x, y },
});

export const mouseUp = (): WhiteboardActionTypes => ({
  type: MOUSE_UP,
});

export const remoteMouseUp = (): WhiteboardActionTypes => ({
  type: REMOTE_MOUSE_UP,
});

export const remoteMouseDown = ({
  remoteX,
  remoteY,
}: RemoteDrawMessage): WhiteboardActionTypes => ({
  type: REMOTE_MOUSE_DOWN,
  payload: { remoteX, remoteY },
});

export const emptyAction = (): WhiteboardActionTypes => ({
  type: EMPTY_ACTION,
});

export const emptyVideoAction = (): VideoStreamActions => ({
  type: EMPTY_VIDEO_ACTION,
});

export const setLocalStream = (message: SetLocalStreamMessage): VideoStreamActions => ({
  type: SET_LOCAL_STREAM,
  payload: message,
});
export const setRemoteStream = (message: SetRemoteStreamMessage): VideoStreamActions => ({
  type: SET_REMOTE_STREAM,
  payload: message,
});

export const connectVideo = (): VideoConnectionActions => ({
  type: CONNECT,
});

export const disconnectVideo = (): VideoStreamActions => ({
  type: LOCAL_DISCONNECT,
});

export const remoteDisconnectVideo = (): VideoStreamActions => ({
  type: REMOTE_DISCONNECT,
});

export const resetVideoStreamState = (): VideoStreamActions => ({
  type: RESET_VIDEO_STREAM_STATE,
});

export const callRequest = (): VideoConnectionActions => ({
  type: CALL,
});

export const joinCall = (): VideoConnectionActions => ({
  type: JOIN_CALL,
});

export const callRequestSent = (): VideoStreamActions => ({
  type: CALL_SENT,
});
export const callAnswer = (): VideoConnectionActions => ({
  type: ANSWER_CALL,
});

export const addIceCandidate = (candidate: RTCIceCandidate): VideoStreamActions => ({
  type: ADD_ICE_CANDIDATE,
  payload: candidate,
});

export const tryBeginCall = (): VideoStreamActions => ({
  type: TRY_BEGIN_CALL,
});

export const setPeerConnection = (message: SetPeerConnectionMessage): VideoStreamActions => ({
  type: SET_PEER_CONNECTION,
  payload: message,
});

export const setRemoteOffer = (message: SetRemoteOfferMessage): VideoStreamActions => ({
  type: SET_REMOTE_OFFER,
  payload: message,
});

export const setConnectionEstablished = (): VideoStreamActions => ({
  type: SET_CONNECTION_ESTABLISHED,
});
export const toggleSidebar = (): DashboardActionTypes => ({
  type: TOGGLE_SIDEBAR,
});

export const toggleSidebarDark = (): DashboardActionTypes => ({
  type: TOGGLE_SIDEBAR_DARK,
});

export const toggleBottomBarOpen = (): DashboardActionTypes => ({
  type: TOGGLE_BOTTOMBAR_OPEN,
});

export const toggleBottomBarDark = (): DashboardActionTypes => ({
  type: TOGGLE_BOTTOMBAR_DARK,
});

export const postNotePadNote = (note: string): NotePadActions => ({
  type: POST_NOTE,
  payload: note,
});
