import {
  MOUSE_DOWN,
  MOUSE_UP,
  DRAW_TO_CANVAS,
  WhiteboardActionTypes,
  RemoteDrawMessage,
} from '../redux/store/whiteboardCanvas/types';
import {
  CONNECT,
  CALL,
  VideoConnectionActions,
  VideoStreamActions,
  SetLocalStreamMessage,
  SetPeerConnectionMessage,
} from '../redux/store/videoStreams/types';
import { Socket, Channel } from 'phoenix';
import {
  remoteMouseDown,
  remoteMouseUp,
  remoteDrawToCanvas,
  emptyAction,
  emptyVideoAction,
  setLocalStream,
  setRemoteStream,
  setPeerConnection,
  setRemoteOffer,
} from '../redux/actions';
import { RootState } from '../redux/reducers/index';
import { select, put, take, fork, takeEvery, all, call, apply } from 'redux-saga/effects';
import { eventChannel, EventChannel } from 'redux-saga';
import socketConnection from '../socketConnection';
import { PEER_MESSAGE, VIDEO_PEER_MESSAGE, VIDEO_OFFER } from '../socket/socketActionTypes';
import {
  drawEvent,
  mouseDown,
  mouseUp,
  socketIceCandidate,
  videoOffer,
  SocketEvents,
  VideoSocketEvents,
} from '../socket/socketActions';
import { getRemoteStream, getPeerConnection } from '../redux/selectors';

interface SocketMessage {
  body: string;
  type: string;
}

export function joinChannel(socket: Socket, channelName: string): Channel {
  const channel = socket.channel(channelName, {});
  channel
    .join()
    .receive('ok', resp => {
      console.log('Joined successfully', resp);
    })
    .receive('error', resp => {
      console.log('Unable to join', resp);
    });

  return channel;
}

const socket = socketConnection();
const whiteboardChannel = joinChannel(socket, 'call:peer2peer');
const videoChannel = joinChannel(socket, 'video:peer2peer');

export const getLocalDrawing = (state: RootState): boolean => state.whiteboardCanvas.localDrawing;

export const getRemoteDrawing = (state: RootState): boolean => state.whiteboardCanvas.remoteDrawing;

export const createSocketChannel = (
  channel: Channel,
  constant: string,
  fn: (event: SocketMessage) => WhiteboardActionTypes
) =>
  // `eventChannel` takes a subscriber function
  // the subscriber function takes an `emit` argument to put messages onto the channel
  eventChannel(emit => {
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

export const createVideoSocketChannel = (
  channel: Channel,
  constant: string,
  fn: (event: SocketMessage) => VideoStreamActions
) =>
  eventChannel(emit => {
    const newDataHandler = (event: SocketMessage) => {
      emit(fn(event));
    };
    channel.on(constant, newDataHandler);
    const unsubscribe = () => {
      // channel.off(constant, newDataHandler);
      channel.off(constant);
    };

    return unsubscribe;
  });
// Notes: Can not get this to work --- Debug later
function createGenericChannel<U, T>(channel: Channel, constant: string, fn: <T, U>(event: T) => U) {
  return eventChannel(emit => {
    const eventHandler = <T>(event: T) => {
      emit(fn(event));
    };
    channel.on(constant, eventHandler);
    const unsubscribe = () => {
      channel.off(constant);
    };
    return unsubscribe;
  });
}
interface GenericChannelConstructor<T, U> {
  (channel: Channel, constant: string, fn: <T, U>(event: T) => U): any;
}
const createVideoChannel: GenericChannelConstructor<
  SocketMessage,
  WhiteboardActionTypes
> = createGenericChannel;

const SOCKET_DRAW_EVENT = 'draw-event';
interface SocketDrawMessage {
  type: typeof SOCKET_DRAW_EVENT;
  content: RemoteDrawMessageContent;
}

interface SocketMouseDownMessage {
  type: typeof MOUSE_DOWN;
  content: SocketMouseDownContent;
}
interface SocketMouseDownContent {
  remoteX: number;
  remoteY: number;
}

interface SocketMouseUpMessage {
  type: typeof MOUSE_UP;
}

interface RemoteDrawMessageContent {
  currentX: number;
  currentY: number;
  previousX: number;
  previousY: number;
}
type SocketMessageBody = SocketDrawMessage | SocketMouseDownMessage | SocketMouseUpMessage;

function handlePeerMessage(payload: SocketMessage): WhiteboardActionTypes {
  // const localDrawing = yield select(getLocalDrawing);
  const { body } = payload;
  const message: SocketMessageBody = JSON.parse(body);
  switch (message.type) {
    case MOUSE_UP:
      return remoteMouseUp();
    // yield put(remoteMouseUp);
    case MOUSE_DOWN:
      const { remoteX, remoteY } = message.content;
      const payload: RemoteDrawMessage = { remoteX, remoteY };
      return remoteMouseDown(payload);
    case SOCKET_DRAW_EVENT:
      console.log('REMOTE DRAW');
      const { currentX, currentY, previousX, previousY } = message.content;
      return remoteDrawToCanvas({
        remoteX: Number(currentX),
        remoteY: Number(currentY),
        prevRemoteX: Number(previousX),
        prevRemoteY: Number(previousY),
      });
    default:
      return emptyAction();
  }
}
export function* handleUpdatedData(action: WhiteboardActionTypes) {
  yield put(action);
}

export function* handleUpdatedVideoData(action: VideoConnectionActions) {
  yield put(action);
}
/*

async function answerCall(offer) {
  receiveRemote(offer);
  let answer = await peerConnection.createAnswer();
  peerConnection
    .setLocalDescription(answer)
    .then(() =>
      pushPeerMessage("video-answer", peerConnection.localDescription)
    );
}

function receiveRemote(offer) {
  let remoteDescription = new RTCSessionDescription(offer);
  peerConnection.setRemoteDescription(remoteDescription);
}
*/

function handleVideoPeerMessage(payload: SocketMessage): VideoStreamActions {
  debugger;
  const { body } = payload;
  const message: VideoSocketEvents = JSON.parse(body);
  switch (message.type) {
    case VIDEO_OFFER:
      return setRemoteOffer({ remoteOffer: message.content });
    default:
      return emptyVideoAction();
  }
}
// Connect with the call_channel to post draw messages
function* connectWithChatSocket(channel: Channel) {
  // const socket = socket;
  // const channel = yield call(joinChannel, socket, "call:peer2peer");

  const socketChannel = yield call(createSocketChannel, channel, PEER_MESSAGE, handlePeerMessage);

  while (true) {
    const action = yield take(socketChannel);
    yield fork(handleUpdatedData, action);
  }
}

// Connect with the video_chat channel to handle video connections
function* connectWithVideoChatSocket(channel: Channel) {
  const socketChannel = yield call(
    createVideoSocketChannel,
    channel,
    VIDEO_PEER_MESSAGE,
    handleVideoPeerMessage
  );
  while (true) {
    const action = yield take(socketChannel);
    yield fork(handleUpdatedVideoData, action);
  }
}
// VideoSocketEvents | SocketEvents
function initializePushToChannel<T>(topLevelMessage: string) {
  return function* pushToChannel(channel: Channel, message: T) {
    debugger;
    const payload = {
      body: JSON.stringify(message),
    };
    yield apply(channel, channel.push, [topLevelMessage, payload]);
  };
}
const pushToSocketChannel = initializePushToChannel<SocketEvents>('peer-message');
const pushToVideoSocketChannel = initializePushToChannel<VideoSocketEvents>(VIDEO_PEER_MESSAGE);

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
  if (message.type === DRAW_TO_CANVAS) {
    const { payload } = message;
    const localDrawing = yield select(getLocalDrawing);
    const remoteDrawing = yield select(getRemoteDrawing);
    console.log('Local Drawing', localDrawing);
    console.log('Remote Drawing', remoteDrawing);
    if (localDrawing && !remoteDrawing) {
      yield fork(pushToSocketChannel, channel, drawEvent(payload));
    }
  }
}

export function* postMouseDown(channel: Channel, message: WhiteboardActionTypes) {
  if (message.type === MOUSE_DOWN) {
    const { payload } = message;
    yield fork(pushToSocketChannel, channel, mouseDown(payload));
  }
}

export function* postMouseUp(channel: Channel) {
  yield fork(pushToSocketChannel, channel, mouseUp());
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

function* handleOnTrack(event: RTCTrackEvent) {
  const remoteStream = yield select(getRemoteStream);
  remoteStream.addTrack(event.track);
}

function handleIceCandidate(channel: Channel) {
  // if (!!event.candidate) {
  //   pushPeerMessage('ice-candidate', event.candidate);
  // }
  return function* (event: RTCPeerConnectionIceEvent) {
    yield fork(pushToSocketChannel, channel, socketIceCandidate(event));
  };
}

function* createPeerConnection(stream: MediaStream, channel: Channel) {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.stunprotocol.org' }],
  });
  pc.ontrack = handleOnTrack;
  pc.onicecandidate = handleIceCandidate(channel);
  stream.getTracks().forEach(track => pc.addTrack(track));
  yield put(setPeerConnection({ peerConnection: pc }));
}

function* handleConnectVideo(channel: Channel) {
  const mediaDevices = navigator.mediaDevices;
  const localStream = yield call([mediaDevices, mediaDevices.getUserMedia], {
    audio: true,
    video: true,
  });
  const remoteStream = new MediaStream();
  yield fork(createPeerConnection, localStream, channel);
  yield put(setLocalStream({ localStream: localStream }));
  yield put(setRemoteStream({ remoteStream: remoteStream }));
}

export function* watchConnectVideo(channel: Channel) {
  yield takeEvery(CONNECT, handleConnectVideo, channel);
}

function* handleCallRequest(channel: Channel) {
  const pc: RTCPeerConnection | undefined = yield select(getPeerConnection);
  if (pc != undefined) {
    const offer: RTCSessionDescriptionInit = yield call([pc, pc.createOffer]);
    pc.setLocalDescription(offer);
    yield fork(pushToVideoSocketChannel, channel, videoOffer(offer));
  }
}

export function* watchCallRequest(channel: Channel) {
  yield takeEvery(CALL, handleCallRequest, channel);
}

export default function* rootSaga() {
  yield all([
    connectWithChatSocket(whiteboardChannel),
    connectWithVideoChatSocket(videoChannel),
    watchDrawToCanvas(whiteboardChannel),
    watchMouseDown(whiteboardChannel),
    watchMouseUp(whiteboardChannel),
    watchConnectVideo(videoChannel),
    watchCallRequest(videoChannel),
  ]);
}
