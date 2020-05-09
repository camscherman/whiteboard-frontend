import { RootState } from "./reducers/index";
import { WhiteboardCanvasState } from "./store/whiteboardCanvas/types";
// import {VideoStreamState} from "./store/videoStreams/types";

export const getWhiteboardCanvasState = (
  store: RootState
): WhiteboardCanvasState => store.whiteboardCanvas;

export const getX = (store: RootState): number =>
  getWhiteboardCanvasState(store).x;

export const getY = (store: RootState): number =>
  getWhiteboardCanvasState(store).y;

export const getPrevX = (store: RootState): number | undefined =>
  getWhiteboardCanvasState(store).prevX;

export const getPrevY = (store: RootState): number | undefined =>
  getWhiteboardCanvasState(store).prevY;

export const getLocalDrawing = (store: RootState): boolean =>
  getWhiteboardCanvasState(store).localDrawing;

export const getRemoteDrawing = (store: RootState): boolean =>
  getWhiteboardCanvasState(store).remoteDrawing;
