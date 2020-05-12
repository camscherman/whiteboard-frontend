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
import { REMOTE_DRAW_TO_CANVAS } from "../actionTypes";

const initialState: WhiteboardCanvasState = {
  x: 0,
  y: 0,
  prevX: 0,
  prevY: 0,
  remoteX: 0,
  remoteY: 0,
  prevRemoteX: 0,
  prevRemoteY: 0,
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
        remoteX: action.payload.remoteX,
        remoteY: action.payload.remoteY,
        prevRemoteX: action.payload.remoteX,
        prevRemoteY: action.payload.remoteY,
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
    case REMOTE_DRAW_TO_CANVAS:
      return {
        ...state,
        remoteX: action.payload.remoteX,
        remoteY: action.payload.remoteY,
        prevRemoteX: action.payload.prevRemoteX,
        prevRemoteY: action.payload.prevRemoteY,
      };
    case EMPTY_ACTION:
      return state;
    default:
      return state;
  }
}
