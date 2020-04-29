// import {
//   DRAW_TO_CANVAS,
//   DRAW_ASYNC,
//   MOUSE_DOWN,
//   MOUSE_UP,
//   REMOTE_MOUSE_DOWN,
//   REMOTE_MOUSE_UP,
// } from "./actionTypes";

export const SET_LOCAL_STREAM = "SET_LOCAL_STREAM";
export const SET_REMOTE_STREAM = "SET_REMOTE_STREAM";
export const MOUSE_DOWN = "MOUSE_DOWN";
export const MOUSE_UP = "MOUSE_UP";
export const REMOTE_MOUSE_DOWN = "REMOTE_MOUSE_DOWN";
export const REMOTE_MOUSE_UP = "REMOTE_MOUSE_UP";
export const DRAW_TO_CANVAS = "DRAW_TO_CANVAS";
export const DRAW_ASYNC = "DRAW_ASYNC";

export interface DrawMessage {
  x: number;
  y: number;
  prevX?: number;
  prevY?: number;
}

export interface WhiteboardCanvasState {
  x: number;
  y: number;
  prevX?: number;
  prevY?: number;
  localDrawing: boolean;
  remoteDrawing: boolean;
}
interface SendMouseDownAction {
  type: typeof MOUSE_DOWN;
  payload: DrawMessage;
}

interface SendMouseUpAction {
  type: typeof MOUSE_UP;
}

interface SendRemoteMouseDownAction {
  type: typeof REMOTE_MOUSE_DOWN;
  payload: DrawMessage;
}

interface SendRemoteMouseUpAction {
  type: typeof REMOTE_MOUSE_UP;
}

interface SendDrawAction {
  type: typeof DRAW_TO_CANVAS;
  payload: DrawMessage;
}

export type WhiteboardActionTypes =
  | SendDrawAction
  | SendMouseDownAction
  | SendMouseUpAction
  | SendRemoteMouseDownAction
  | SendRemoteMouseUpAction;
