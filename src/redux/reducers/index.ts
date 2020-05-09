import { combineReducers } from "redux";
import videoStreams from "./videoStreams";
import whiteboardCanvas from "./whiteboardCanvas";

const rootReducer = combineReducers({ videoStreams, whiteboardCanvas });

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
