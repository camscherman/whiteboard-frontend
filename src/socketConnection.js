import { Socket } from "phoenix";

export default function connectToSocket() {
  const socket = new Socket("ws:localhost:4000/socket");
  socket.connect();
  console.log("connected to socket");
  return socket;
}
