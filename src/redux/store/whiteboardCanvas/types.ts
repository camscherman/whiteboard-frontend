// import {
//   DRAW_TO_CANVAS,
//   DRAW_ASYNC,
//   MOUSE_DOWN,
//   MOUSE_UP,
//   REMOTE_MOUSE_DOWN,
//   REMOTE_MOUSE_UP,
// } from "./actionTypes";

import { REMOTE_DRAW_TO_CANVAS } from "../../actionTypes";

export const SET_LOCAL_STREAM = "SET_LOCAL_STREAM";
export const SET_REMOTE_STREAM = "SET_REMOTE_STREAM";
export const MOUSE_DOWN = "MOUSE_DOWN";
export const MOUSE_UP = "MOUSE_UP";
export const REMOTE_MOUSE_DOWN = "REMOTE_MOUSE_DOWN";
export const REMOTE_MOUSE_UP = "REMOTE_MOUSE_UP";
export const DRAW_TO_CANVAS = "DRAW_TO_CANVAS";
export const DRAW_ASYNC = "DRAW_ASYNC";
export const EMPTY_ACTION = "EMPTY_ACTION";

export interface DrawMessage {
  x: number;
  y: number;
  prevX?: number;
  prevY?: number;
}

export interface RemoteDrawMessage {
  remoteX: number;
  remoteY: number;
  prevRemoteX?: number;
  prevRemoteY?: number;
}

export interface WhiteboardCanvasState {
  x: number;
  y: number;
  prevX?: number;
  prevY?: number;
  remoteX: number;
  remoteY: number;
  prevRemoteX?: number;
  prevRemoteY?: number;
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
  payload: RemoteDrawMessage;
}

interface SendRemoteMouseUpAction {
  type: typeof REMOTE_MOUSE_UP;
}

interface SendDrawAction {
  type: typeof DRAW_TO_CANVAS;
  payload: DrawMessage;
}

interface SendRemoteDrawAction {
  type: typeof REMOTE_DRAW_TO_CANVAS;
  payload: RemoteDrawMessage;
}
interface EmptyAction {
  type: typeof EMPTY_ACTION;
}

export type WhiteboardActionTypes =
  | SendDrawAction
  | SendRemoteDrawAction
  | SendMouseDownAction
  | SendMouseUpAction
  | SendRemoteMouseDownAction
  | SendRemoteMouseUpAction
  | EmptyAction;
