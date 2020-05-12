import { combineReducers } from 'redux';
import videoStreams from './videoStreams';
import whiteboardCanvas from './whiteboardCanvas';
import dashboard from './dashboard';
const rootReducer = combineReducers({ dashboard, videoStreams, whiteboardCanvas });

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
