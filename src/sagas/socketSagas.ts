import {
  MOUSE_DOWN,
  MOUSE_UP,
  DRAW_TO_CANVAS,
  WhiteboardActionTypes,
  RemoteDrawMessage,
} from '../redux/store/whiteboardCanvas/types';
import {
  CONNECT,
  LOCAL_DISCONNECT,
  CALL,
  JOIN_CALL,
  SET_REMOTE_OFFER,
  TRY_BEGIN_CALL,
  VideoStreamActions,
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
  tryBeginCall,
  remoteDisconnectVideo,
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
import { eventChannel } from 'redux-saga';
import socketConnection from '../socketConnection';
import {
  PEER_MESSAGE,
  VIDEO_PEER_MESSAGE,
  VIDEO_OFFER,
  VIDEO_ANSWER,
  JOINING_CALL,
  REMOTE_DISCONNECT_MESSAGE,
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
  joiningCall,
  sendRemoteDisconnect,
} from '../socket/socketActions';
import {
  getRemoteStream,
  getPeerConnection,
  getRemoteOffer,
  getCallRequestSent,
  getIceCandidate,
} from '../redux/selectors';

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

  peerConnection.addIceCandidate(candidate).catch((e: any) => {
    console.error(e);
  });
}

function* handleRemoteOffer(channel: Channel) {
  const peerConnection = yield select(getPeerConnection);
  const remoteOffer = yield select(getRemoteOffer);
  if (peerConnection !== undefined && remoteOffer !== undefined) {
    const remoteDescription = new RTCSessionDescription(remoteOffer);
    yield call([peerConnection, peerConnection.setRemoteDescription], remoteDescription);
    // const callRequestSent = yield select(getCallRequestSent);x
    if (['have-remote-offer', 'have-local-pranswer'].includes(peerConnection.signalingState)) {
      const answer = yield call([peerConnection, peerConnection.createAnswer]);
      yield call([peerConnection, peerConnection.setLocalDescription], answer);
      yield fork(pushToVideoSocketChannel, channel, videoAnswer(peerConnection.localDescription));
    }
    yield put(setConnectionEstablished());
  }
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

export function* watchCallRequest(channel: Channel) {
  yield takeEvery(CALL, handleCallRequest, channel);
}

export function* handleUpdatedVideoData(action: VideoStreamActions, channel: Channel) {
  yield put(action);
  if (action.type == ADD_ICE_CANDIDATE) {
    yield fork(addIceCandidateToPeerCandidate);
  } else if (action.type == SET_REMOTE_OFFER) {
    yield fork(handleRemoteOffer, channel);
  } else if (action.type == TRY_BEGIN_CALL) {
    const requestSent = yield select(getCallRequestSent);
    if (requestSent) {
      yield fork(handleCallRequest, channel);
    }
  }
}

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
      } else {
        return emptyVideoAction();
      }
    case REMOTE_DISCONNECT_MESSAGE:
      return remoteDisconnectVideo();
    case JOINING_CALL:
      return tryBeginCall();
    default:
      return emptyVideoAction();
  }
}

function* connectWithChatSocket(channel: Channel) {
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

export function* postDraw(channel: Channel, message: WhiteboardActionTypes) {
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
  } catch (e) {}
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

function* remoteDisconnectReceived() {}
/*
  function unsetVideoStream(videoElement) {
  if (videoElement.srcObject) {
    videoElement.srcObject.getTracks().forEach((track) => track.stop());
  }
  videoElement.removeAttribute("src");
  videoElement.removeAttribute("srcObject");
}

async function disconnect() {
  connectButton.disabled = false;
  disconnectButton.disabled = true;
  callButton.disabled = true;
  unsetVideoStream(localVideo);
  unsetVideoStream(remoteVideo);
  remoteStream = new MediaStream();
  setVideoStream(remoteVideo, remoteStream);
  peerConnection.close();
  peerConnection = null;
  pushPeerMessage("disconnect", {});
}

*/

function* handleDisconnectVideo(channel: Channel) {
  console.log('DISCONNECTYY!');
  yield fork(pushToVideoSocketChannel, channel, sendRemoteDisconnect());
}

export function* watchDisconnectVideo(channel: Channel) {
  yield takeEvery(LOCAL_DISCONNECT, handleDisconnectVideo, channel);
}

function* handleJoinRequest(channel: Channel) {
  yield fork(pushToVideoSocketChannel, channel, joiningCall());
}

export function* watchJoinRequest(channel: Channel) {
  yield takeEvery(JOIN_CALL, handleJoinRequest, channel);
}

export function* watchIceCandidate() {
  const candidate = yield select(getIceCandidate);
  if (candidate != undefined) {
    // do the update stuff
    console.log('Update this!!!');
  }
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
    watchJoinRequest(videoChannel),
    watchDisconnectVideo(videoChannel),
    // watchAnswerRequest(videoChannel),
    // watchSetRemoteOffer(videoChannel),
    watchIceCandidate(),
    // watchAddIceCandidate(videoChannel),
  ]);
}
