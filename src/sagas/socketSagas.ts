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
  SET_REMOTE_OFFER,
  ANSWER_CALL,
  VideoConnectionActions,
  VideoStreamActions,
  SetLocalStreamMessage,
  SetPeerConnectionMessage,
  ADD_ICE_CANDIDATE,
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
  addIceCandidate,
  setConnectionEstablished,
} from '../redux/actions';
import { RootState } from '../redux/reducers/index';
import {
  select,
  put,
  take,
  fork,
  takeEvery,
  all,
  call,
  apply,
  cancelled,
} from 'redux-saga/effects';
import { eventChannel, EventChannel } from 'redux-saga';
import socketConnection from '../socketConnection';
import {
  PEER_MESSAGE,
  VIDEO_PEER_MESSAGE,
  VIDEO_OFFER,
  VIDEO_ANSWER,
  ICE_CANDIDATE,
} from '../socket/socketActionTypes';
import {
  drawEvent,
  mouseDown,
  mouseUp,
  socketIceCandidate,
  videoOffer,
  videoAnswer,
  SocketEvents,
  VideoSocketEvents,
} from '../socket/socketActions';
import {
  getRemoteStream,
  getPeerConnection,
  getRemoteOffer,
  getCallRequestSent,
  getIceCandidate,
} from '../redux/selectors';
import { SET_REMOTE_STREAM } from '../redux/actionTypes';

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
// function createGenericChannel<U, T>(channel: Channel, constant: string, fn: <T, U>(event: T) => U) {
//   return eventChannel(emit => {
//     const eventHandler = <T>(event: T) => {
//       emit(fn(event));
//     };
//     channel.on(constant, eventHandler);
//     const unsubscribe = () => {
//       channel.off(constant);
//     };
//     return unsubscribe;
//   });
// }
// interface GenericChannelConstructor<T, U> {
//   (channel: Channel, constant: string, fn: <T, U>(event: T) => U): any;
// }
// const createVideoChannel: GenericChannelConstructor<
//   SocketMessage,
//   WhiteboardActionTypes
// > = createGenericChannel;

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

export function* addIceCandidateToPeerCandidate() {
  const iceCandidate = yield select(getIceCandidate);
  const peerConnection = yield select(getPeerConnection);
  const candidate = new RTCIceCandidate(iceCandidate);
  debugger;
  peerConnection.addIceCandidate(candidate).catch((e: any) => {
    console.error(e);
  });
  // try {
  //   // yield call([peerConnection, peerConnection.addIceCandidate], candidate);
  //   debugger;
  // } catch (e) {
  //   debugger;
  //   console.log('Error adding ice candidate', e);
  // }
}

function* handleRemoteOffer(channel: Channel) {
  debugger;
  const peerConnection = yield select(getPeerConnection);
  const remoteOffer = yield select(getRemoteOffer);
  if (peerConnection !== undefined && remoteOffer !== undefined) {
    const remoteDescription = new RTCSessionDescription(remoteOffer);
    yield call([peerConnection, peerConnection.setRemoteDescription], remoteDescription);
    const callRequestSent = yield select(getCallRequestSent);
    if (!callRequestSent) {
      const answer = yield call([peerConnection, peerConnection.createAnswer]);
      yield call([peerConnection, peerConnection.setLocalDescription], answer);
      yield fork(pushToVideoSocketChannel, channel, videoAnswer(peerConnection.localDescription));
    }
    yield put(setConnectionEstablished());
  }
}

export function* handleUpdatedVideoData(action: VideoStreamActions, channel: Channel) {
  yield put(action);
  if (action.type == ADD_ICE_CANDIDATE) {
    yield fork(addIceCandidateToPeerCandidate);
  } else if (action.type == SET_REMOTE_OFFER) {
    yield fork(handleRemoteOffer, channel);
  }
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
  const { body } = payload;
  const message: VideoSocketEvents = JSON.parse(body);
  switch (message.type) {
    case VIDEO_OFFER:
    case VIDEO_ANSWER:
      return setRemoteOffer({ remoteOffer: message.content });
    case ICE_CANDIDATE:
      if (message.content != null) {
        return addIceCandidate(message.content);
      }
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
    yield fork(handleUpdatedVideoData, action, channel);
  }
}
// VideoSocketEvents | SocketEvents
function initializePushToChannel<T>(topLevelMessage: string) {
  return function* pushToChannel(channel: Channel, message: T) {
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

// function* handleOnTrack(event: RTCTrackEvent) {
//   const remoteStream = yield select(getRemoteStream);
//   remoteStream.addTrack(event.track);
// }

function createOnTrackChannel(peerConnection: RTCPeerConnection) {
  return eventChannel(emit => {
    const trackHandler = (event: RTCTrackEvent) => {
      emit(event);
    };
    peerConnection.ontrack = trackHandler;
    const unsubscribe = () => {
      peerConnection.close();
    };
    return unsubscribe;
  });
}

function* handleOnTrack(peerConnection: RTCPeerConnection) {
  const trackChannel = yield call(createOnTrackChannel, peerConnection);
  try {
    const event = yield take(trackChannel);
    const track = event.track;
    if (event && event.track) {
      const remoteStream = yield select(getRemoteStream);
      yield call([remoteStream, remoteStream.addTrack], track);
    }
    console.log('Event', event);
  } catch (e) {
    debugger;
  }
}

function createIceCandidateChannel(peerConnection: RTCPeerConnection) {
  return eventChannel(emit => {
    const iceCandidateHandler = (event: RTCPeerConnectionIceEvent) => {
      emit(event);
    };
    peerConnection.onicecandidate = iceCandidateHandler;
    const unsubscribe = () => {
      peerConnection.close();
    };
    return unsubscribe;
  });
}
function* handleIceCandidate(peerConnection: RTCPeerConnection, channel: Channel) {
  const iceCandidateChannnel = yield call(createIceCandidateChannel, peerConnection);
  try {
    const event = yield take(iceCandidateChannnel);
    yield fork(pushToVideoSocketChannel, channel, socketIceCandidate(event));
  } catch (e) {
    if (yield cancelled()) {
      iceCandidateChannnel.close();
    }
  }
}
function* createPeerConnection(stream: MediaStream, channel: Channel) {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.stunprotocol.org' }],
  });
  // pc.ontrack = handleOnTrack;
  yield fork(handleOnTrack, pc);
  yield fork(handleIceCandidate, pc, channel);

  // pc.onicecandidate = handleIceCandidate;
  // const iceCandidateChannnel = yield call(createIceCandidateChannel, pc);
  stream.getTracks().forEach(track => {
    pc.addTrack(track);
  });

  yield put(setPeerConnection({ peerConnection: pc }));
}

function* handleConnectVideo(channel: Channel) {
  const mediaDevices = navigator.mediaDevices;
  const localStream = yield call([mediaDevices, mediaDevices.getUserMedia], {
    audio: false,
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
    yield call([pc, pc.setLocalDescription], offer);
    // pc.setLocalDescription(offer);
    yield fork(pushToVideoSocketChannel, channel, videoOffer(offer));
  }
}

function* handleSetRemoteOffer(channel: Channel) {
  const remoteOffer = yield select(getRemoteOffer);
  const callRequestSent = yield select(getCallRequestSent);
  if (true) {
    const peerConnection = yield select(getPeerConnection);
    const remoteDescription = new RTCSessionDescription(remoteOffer);
    yield call([peerConnection, peerConnection.setRemoteDescription], remoteDescription);
  }
}

export function* watchSetRemoteOffer(channel: Channel) {
  yield takeEvery(SET_REMOTE_OFFER, handleSetRemoteOffer, channel);
}
// export function* watchAnswerRequest(channel: Channel) {
//   yield takeEvery(ANSWER_CALL, handleAnswerCall, channel);
// }

export function* watchCallRequest(channel: Channel) {
  yield takeEvery(CALL, handleCallRequest, channel);
}

export function* watchIceCandidate() {
  const candidate = yield select(getIceCandidate);
  if (candidate != undefined) {
    // do the update stuff
    console.log('Update this!!!');
  }
}

// export function* handleAddIceCandidate(channel: Channel, event: any) {
//   debugger;
//   const candidate = new RTCIceCandidate(event);
//   debugger;
// }
// export function* watchAddIceCandidate(channel: Channel) {
//   while (true) {
//     const action = take(ADD_ICE_CANDIDATE);
//     yield fork(handleAddIceCandidate, channel, action);
//   }
//   debugger;
//   // yield takeEvery(ADD_ICE_CANDIDATE, handleAddIceCandidate, channel, event);
// }

export default function* rootSaga() {
  yield all([
    connectWithChatSocket(whiteboardChannel),
    connectWithVideoChatSocket(videoChannel),
    watchDrawToCanvas(whiteboardChannel),
    watchMouseDown(whiteboardChannel),
    watchMouseUp(whiteboardChannel),
    watchConnectVideo(videoChannel),
    watchCallRequest(videoChannel),
    // watchAnswerRequest(videoChannel),
    watchSetRemoteOffer(videoChannel),
    watchIceCandidate(),
    // watchAddIceCandidate(videoChannel),
  ]);
}
