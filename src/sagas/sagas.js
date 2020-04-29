import { put, takeEvery, all } from "redux-saga/effects";
import { drawToCanvas } from "../redux/actions";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export function* helloSaga() {
  console.log("Hello Sagas!");
}

export function* drawAsync(body) {
  yield delay(1000);
  yield put(drawToCanvas(body.payload));
}

export function* watchDrawAsync() {
  yield takeEvery("DRAW_ASYNC", drawAsync);
}

export default function* rootSaga() {
  yield all([helloSaga(), watchDrawAsync()]);
}
