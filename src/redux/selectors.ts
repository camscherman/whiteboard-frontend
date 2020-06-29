import { RootState } from './reducers/index';
import { WhiteboardCanvasState } from './store/whiteboardCanvas/types';
import { DashboardState } from './store/dashboard/types';
import { NotePadState } from './store/notePad/types';
// import {VideoStreamState} from "./store/videoStreams/types";

export const getWhiteboardCanvasState = (store: RootState): WhiteboardCanvasState =>
  store.whiteboardCanvas;

export const getDashboardState = (store: RootState): DashboardState => store.dashboard;

export const getX = (store: RootState): number => getWhiteboardCanvasState(store).x;

export const getY = (store: RootState): number => getWhiteboardCanvasState(store).y;

export const getPrevX = (store: RootState): number | undefined =>
  getWhiteboardCanvasState(store).prevX;

export const getPrevY = (store: RootState): number | undefined =>
  getWhiteboardCanvasState(store).prevY;

export const getLocalDrawing = (store: RootState): boolean =>
  getWhiteboardCanvasState(store).localDrawing;

export const getRemoteDrawing = (store: RootState): boolean =>
  getWhiteboardCanvasState(store).remoteDrawing;

export const getRemoteX = (store: RootState): number => getWhiteboardCanvasState(store).remoteX;

export const getRemoteY = (store: RootState): number => getWhiteboardCanvasState(store).remoteY;

export const getPrevRemoteX = (store: RootState): number | undefined =>
  getWhiteboardCanvasState(store).prevRemoteX;

export const getPrevRemoteY = (store: RootState): number | undefined =>
  getWhiteboardCanvasState(store).prevRemoteY;

export const getSidebarOpen = (store: RootState): boolean => getDashboardState(store).sidebarOpen;
export const getSidebarDark = (store: RootState): boolean => getDashboardState(store).sidebarDark;
export const getBottomBarOpen = (store: RootState): boolean =>
  getDashboardState(store).bottomBarOpen;

export const getBottomBarDark = (store: RootState): boolean =>
  getDashboardState(store).bottomBarDark;

export const getNotePadState = (store: RootState): NotePadState => store.notePad;
export const getNotePadNotes = (store: RootState): Array<string> => getNotePadState(store).notes;
