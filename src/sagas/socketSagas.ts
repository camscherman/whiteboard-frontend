import {
  MOUSE_DOWN,
  MOUSE_UP,
  DRAW_TO_CANVAS,
  WhiteboardActionTypes,
} from "../redux/store/whiteboardCanvas/types";
import { Socket, Channel } from "phoenix";
import {
  remoteMouseDown,
  remoteMouseUp,
  drawToCanvas,
  emptyAction,
} from "../redux/actions";
import { RootState } from "../redux/reducers/index";
import {
  select,
  put,
  take,
  fork,
  takeEvery,
  all,
  call,
  apply,
} from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import socketConnection from "../socketConnection";
import { PEER_MESSAGE } from "../socket/socketActionTypes";
import {
  drawEvent,
  mouseDown,
  mouseUp,
  SocketEvents,
} from "../socket/socketActions";

interface SocketMessage {
  body: string;
  type: string;
}
const socket = socketConnection();
const channel = joinChannel(socket, "call:peer2peer");

export const getLocalDrawing = (state: RootState): Boolean =>
  state.whiteboardCanvas.localDrawing;

export const getRemoteDrawing = (state: RootState): Boolean =>
  state.whiteboardCanvas.remoteDrawing;

export function joinChannel(socket: Socket, channelName: string): Channel {
  const channel = socket.channel(channelName, {});
  channel
    .join()
    .receive("ok", (resp) => {
      console.log("Joined successfully", resp);
    })
    .receive("error", (resp) => {
      console.log("Unable to join", resp);
    });

  return channel;
}

export const createSocketChannel = (
  channel: Channel,
  constant: string,
  fn: (event: SocketMessage) => WhiteboardActionTypes
) =>
  // `eventChannel` takes a subscriber function
  // the subscriber function takes an `emit` argument to put messages onto the channel
  eventChannel((emit) => {
    const newDataHandler = (event: SocketMessage) => {
      console.log(event);
      emit(fn(event));
    };

    channel.on(constant, newDataHandler);

    const unsubscribe = () => {
      // channel.off(constant, newDataHandler);
      channel.off(constant);
    };

    return unsubscribe;
  });

function handlePeerMessage(payload: SocketMessage): WhiteboardActionTypes {
  // const localDrawing = yield select(getLocalDrawing);
  const { body } = payload;
  const message = JSON.parse(body);
  switch (message.type) {
    case MOUSE_UP:
      return remoteMouseUp();
    // yield put(remoteMouseUp);
    case MOUSE_DOWN:
      return remoteMouseDown(message.content);
    case "draw-event":
      console.log("REMOTE DRAW");
      const { currentX, currentY, previousX, previousY } = message.content;
      return drawToCanvas({
        x: currentX,
        y: currentY,
        prevX: previousX,
        prevY: previousY,
      });
    default:
      return emptyAction();
  }
}
function* connectWithChatSocket(channel: Channel) {
  // const socket = socket;
  // const channel = yield call(joinChannel, socket, "call:peer2peer");

  const socketChannel = yield call(
    createSocketChannel,
    channel,
    PEER_MESSAGE,
    handlePeerMessage
  );

  while (true) {
    const action = yield take(socketChannel);
    yield fork(handleUpdatedData, action);
  }
}
export function* postDraw(channel: Channel, message: WhiteboardActionTypes) {
  // const message = {
  //   type: "draw-event",
  //   content: {
  //     previousX: prevX,
  //     previousY: prevY,
  //     currentX: x,
  //     currentY: y,
  //   },
  // };
  debugger;
  if (message.type === DRAW_TO_CANVAS) {
    const { payload } = message;
    const localDrawing = yield select(getLocalDrawing);
    const remoteDrawing = yield select(getRemoteDrawing);
    console.log("Local Drawing", localDrawing);
    console.log("Remote Drawing", remoteDrawing);
    if (localDrawing && !remoteDrawing) {
      yield fork(pushToChannel, channel, drawEvent(payload));
    }
  }
}

function* pushToChannel(channel: Channel, message: SocketEvents) {
  const payload = {
    body: JSON.stringify(message),
  };
  yield apply(channel, channel.push, ["peer-message", payload]);
}

export function* postMouseDown(
  channel: Channel,
  message: WhiteboardActionTypes
) {
  if (message.type === MOUSE_DOWN) {
    const { payload } = message;
    yield fork(pushToChannel, channel, mouseDown(payload));
  }
}

export function* postMouseUp(channel: Channel) {
  yield fork(pushToChannel, channel, mouseUp());
}

export function* watchDrawToCanvas(channel: Channel) {
  yield takeEvery(DRAW_TO_CANVAS, postDraw, channel);
}

export function* watchMouseDown(channel: Channel) {
  yield takeEvery(MOUSE_DOWN, postMouseDown, channel);
}

export function* watchMouseUp(channel: Channel) {
  yield takeEvery(MOUSE_UP, postMouseUp, channel);
}

export function* handleUpdatedData(action: WhiteboardActionTypes) {
  yield put(action);
}

export default function* rootSaga() {
  yield all([
    connectWithChatSocket(channel),
    watchDrawToCanvas(channel),
    watchMouseDown(channel),
    watchMouseUp(channel),
  ]);
}
