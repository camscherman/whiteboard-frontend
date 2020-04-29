import { DRAW_EVENT, MOUSE_DOWN, MOUSE_UP } from "./socketActionTypes";

export const drawEvent = (payload) => {
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

export const mouseDown = (payload) => {
  return {
    type: MOUSE_DOWN,
    content: payload,
  };
};

export const mouseUp = (payload) => {
  return {
    type: MOUSE_UP,
    content: payload,
  };
};
