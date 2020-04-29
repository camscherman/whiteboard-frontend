import {
  DRAW_TO_CANVAS,
  MOUSE_DOWN,
  MOUSE_UP,
  REMOTE_MOUSE_DOWN,
  REMOTE_MOUSE_UP,
  WhiteboardActionTypes,
  DrawMessage,
} from "./store/whiteboardCanvas/types";

import {
  SET_LOCAL_STREAM,
  SET_REMOTE_STREAM,
  SetStreamActions,
  SetRemoteStreamMessage,
  SetLocalStreamMessage,
} from "./store/videoStreams/types";

export const drawToCanvas = ({
  x,
  y,
  prevX,
  prevY,
}: DrawMessage): WhiteboardActionTypes => ({
  type: DRAW_TO_CANVAS,
  payload: { x, y, prevX, prevY },
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
  x,
  y,
}: DrawMessage): WhiteboardActionTypes => ({
  type: REMOTE_MOUSE_DOWN,
  payload: { x, y },
});

export const setLocalStream = (
  message: SetLocalStreamMessage
): SetStreamActions => ({
  type: SET_LOCAL_STREAM,
  payload: message,
});
export const setRemoteStream = (
  message: SetRemoteStreamMessage
): SetStreamActions => ({
  type: SET_REMOTE_STREAM,
  payload: message,
});
