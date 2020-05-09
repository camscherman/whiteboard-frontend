// import {
//   MOUSE_DOWN,
//   MOUSE_UP,
//   REMOTE_MOUSE_DOWN,
//   REMOTE_MOUSE_UP,
//   DRAW_TO_CANVAS,
// } from "../actionTypes";
import {
  MOUSE_DOWN,
  MOUSE_UP,
  REMOTE_MOUSE_DOWN,
  REMOTE_MOUSE_UP,
  DRAW_TO_CANVAS,
  WhiteboardCanvasState,
  WhiteboardActionTypes,
  EMPTY_ACTION,
} from "../store/whiteboardCanvas/types";

const initialState: WhiteboardCanvasState = {
  x: 0,
  y: 0,
  prevX: 0,
  prevY: 0,
  localDrawing: false,
  remoteDrawing: false,
};

export default function (
  state = initialState,
  action: WhiteboardActionTypes
): WhiteboardCanvasState {
  switch (action.type) {
    case MOUSE_DOWN:
      console.log("Mouse down");
      console.log(state);
      return {
        ...state,
        x: action.payload.x,
        y: action.payload.y,
        prevX: action.payload.x,
        prevY: action.payload.y,
        localDrawing: state.remoteDrawing ? false : true,
      };
    case MOUSE_UP:
      return { ...state, localDrawing: false };
    case REMOTE_MOUSE_DOWN:
      return {
        ...state,
        x: action.payload.x,
        y: action.payload.y,
        prevX: action.payload.x,
        prevY: action.payload.y,
        remoteDrawing: state.localDrawing ? false : true,
      };
    case REMOTE_MOUSE_UP:
      return { ...state, remoteDrawing: false };
    case DRAW_TO_CANVAS:
      console.log("draw");
      console.log(state);
      return {
        ...state,
        x: action.payload.x,
        y: action.payload.y,
        prevX: action.payload.prevX,
        prevY: action.payload.prevY,
      };
    case EMPTY_ACTION:
      return state;
    default:
      return state;
  }
}
