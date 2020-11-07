import { combineReducers } from 'redux';
import videoStreams from './videoStreams';
import whiteboardCanvas from './whiteboardCanvas';
import dashboard from './dashboard';
import notePad from './notePad';
const rootReducer = combineReducers({ dashboard, videoStreams, whiteboardCanvas, notePad });

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
