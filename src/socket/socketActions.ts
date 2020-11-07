import {
  DRAW_EVENT,
  MOUSE_DOWN,
  MOUSE_UP,
  ICE_CANDIDATE,
  VIDEO_OFFER,
  VIDEO_ANSWER,
} from './socketActionTypes';
import { DrawMessage } from '../redux/store/whiteboardCanvas/types';

export interface SocketDrawMessage {
  currentX: number;
  currentY: number;
  previousX?: number;
  previousY?: number;
}

interface SocketDrawEvent {
  type: typeof DRAW_EVENT;
  content: SocketDrawMessage;
}

interface SocketMouseDownEvent {
  type: typeof MOUSE_DOWN;
  content: DrawMessage;
}

interface SocketMouseUpEvent {
  type: typeof MOUSE_UP;
}

interface SocketIceCandidateEvent {
  type: typeof ICE_CANDIDATE;
  content: RTCIceCandidate | null;
}
// Its possible that in the future this message will also contain text describing who the offer is from
//  The receiving party will be able to accept or reject the call
interface VideoOfferEvent {
  type: typeof VIDEO_OFFER;
  content: RTCSessionDescriptionInit;
}

interface VideoAnswerEvent {
  type: typeof VIDEO_ANSWER;
  content: RTCSessionDescriptionInit;
}

export const drawEvent = (payload: DrawMessage): SocketDrawEvent => {
  const { prevX, prevY, x, y } = payload;
  return {
    type: DRAW_EVENT,
    content: {
      previousX: prevX,
      previousY: prevY,
      currentX: x,
      currentY: y,
    },
  };
};

export const mouseDown = (payload: DrawMessage): SocketMouseDownEvent => ({
  type: MOUSE_DOWN,
  content: payload,
});

export const mouseUp = (): SocketMouseUpEvent => ({
  type: MOUSE_UP,
});

export const socketIceCandidate = (event: RTCPeerConnectionIceEvent): SocketIceCandidateEvent => ({
  type: ICE_CANDIDATE,
  content: event.candidate,
});

export const videoOffer = (offer: RTCSessionDescriptionInit): VideoOfferEvent => ({
  type: VIDEO_OFFER,
  content: offer,
});

export const videoAnswer = (answer: RTCSessionDescriptionInit): VideoAnswerEvent => ({
  type: VIDEO_ANSWER,
  content: answer,
});

export type VideoSocketEvents = VideoOfferEvent | VideoAnswerEvent | SocketIceCandidateEvent;

export type SocketEvents = SocketMouseUpEvent | SocketMouseDownEvent | SocketDrawEvent;
