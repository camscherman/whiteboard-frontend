import { DRAW_EVENT, MOUSE_DOWN, MOUSE_UP } from "./socketActionTypes";
import { DrawMessage } from "../redux/store/whiteboardCanvas/types";

export interface SocketDrawMessage {
  currentX: number;
  currentY: number;
  previousX?: number;
  previousY?: number;
}

interface SocketDrawEvent {
  type: typeof DRAW_EVENT;
  content: SocketDrawMessage;
}

interface SocketMouseDownEvent {
  type: typeof MOUSE_DOWN;
  content: DrawMessage;
}

interface SocketMouseUpEvent {
  type: typeof MOUSE_UP;
}

export const drawEvent = (payload: DrawMessage): SocketDrawEvent => {
  const { prevX, prevY, x, y } = payload;
  return {
    type: DRAW_EVENT,
    content: {
      previousX: prevX,
      previousY: prevY,
      currentX: x,
      currentY: y,
    },
  };
};

export const mouseDown = (payload: DrawMessage): SocketMouseDownEvent => {
  return {
    type: MOUSE_DOWN,
    content: payload,
  };
};

export const mouseUp = (): SocketMouseUpEvent => {
  return {
    type: MOUSE_UP,
  };
};

export type SocketEvents =
  | SocketMouseUpEvent
  | SocketMouseDownEvent
  | SocketDrawEvent;
