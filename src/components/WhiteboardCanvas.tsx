import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mouseUp, mouseDown, drawToCanvas } from "../redux/actions";
import {
  getLocalDrawing,
  getPrevX,
  getPrevY,
  getRemoteDrawing,
  getX,
  getY,
} from "../redux/selectors";
// const HOOK_SVG =
//   "m129.03125 63.3125c0-34.914062-28.941406-63.3125-64.519531-63.3125-35.574219 0-64.511719 28.398438-64.511719 63.3125 0 29.488281 20.671875 54.246094 48.511719 61.261719v162.898437c0 53.222656 44.222656 96.527344 98.585937 96.527344h10.316406c54.363282 0 98.585938-43.304688 98.585938-96.527344v-95.640625c0-7.070312-4.640625-13.304687-11.414062-15.328125-6.769532-2.015625-14.082032.625-17.960938 6.535156l-42.328125 64.425782c-4.847656 7.390625-2.800781 17.3125 4.582031 22.167968 7.386719 4.832032 17.304688 2.792969 22.160156-4.585937l12.960938-19.71875v42.144531c0 35.582032-29.863281 64.527344-66.585938 64.527344h-10.316406c-36.714844 0-66.585937-28.945312-66.585937-64.527344v-162.898437c27.847656-7.015625 48.519531-31.773438 48.519531-61.261719zm-97.03125 0c0-17.265625 14.585938-31.3125 32.511719-31.3125 17.929687 0 32.511719 14.046875 32.511719 31.3125 0 17.261719-14.582032 31.3125-32.511719 31.3125-17.925781 0-32.511719-14.050781-32.511719-31.3125zm0 0";
// const HOOK_PATH = new Path2D(HOOK_SVG);
// const SCALE = 0.3;
// const OFFSET = 80;
interface DrawLocation {
  currX: number;
  currY: number;
  prevX: number;
  prevY: number;
}

function draw(ctx: CanvasRenderingContext2D | null, location: DrawLocation) {
  const { prevX, prevY, currX, currY } = location;
  if (ctx !== null) {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
  }
}

export default function WhiteboardCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const prevX = useSelector(getPrevX);
  const prevY = useSelector(getPrevY);
  const localDrawing = useSelector(getLocalDrawing);
  const remoteDrawing = useSelector(getRemoteDrawing);
  const x = useSelector(getX);
  const y = useSelector(getY);
  const dispatch = useDispatch();

  useEffect(() => {
    if (localDrawing || remoteDrawing) {
      const canvas = canvasRef.current;
      if (canvas !== null && prevX !== undefined && prevY !== undefined) {
        const ctx = canvas.getContext("2d");
        draw(ctx, { currX: x, currY: y, prevX: prevX, prevY: prevY });
      }
    }
  });

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={(e) => {
        // dispatch mouse down and coordinates
        // setPrevX(e.clientX);
        // setPrevY(e.clientY);
        // setIsMouseDown(true);
        dispatch(mouseDown({ x: e.clientX, y: e.clientY }));
      }}
      tabIndex={-1}
      // TODO: Add keydown event listener to parent element and make it work...
      // onKeyDown={(e) => {
      //   if (e.keyCode === 17) {
      //     console.log("here");
      //     dispatch(mouseDown({ x: e.clientX, y: e.clientY }));
      //   }
      // }}
      onMouseUp={() => {
        dispatch(mouseUp());
      }}
      onKeyUp={() => {
        console.log("Up");
        dispatch(mouseUp());
      }}
      onMouseMove={(e) => {
        if (!remoteDrawing && localDrawing) {
          dispatch(
            drawToCanvas({ prevX: x, prevY: y, x: e.clientX, y: e.clientY })
          );
        }
        // const x = e.clientX;
        // const y = e.clientY;
        // if (isMouseDown) {
        //   draw(ctx, {
        //     currX: x,
        //     currY: y,
        //     prevX: prevX,
        //     prevY: prevY,
        //   });
        //   setPrevX(x);
        //   setPrevY(y);
        // }
      }}
    />
  );
}
