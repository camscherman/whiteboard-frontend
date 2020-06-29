import { NotePadActions, NotePadState, POST_NOTE } from '../store/notePad/types';

const initialState: NotePadState = {
  notes: ['test note'],
};

export default function (state = initialState, action: NotePadActions): NotePadState {
  switch (action.type) {
    case POST_NOTE:
      return { ...state, notes: [action.payload, ...state.notes] };
    default:
      return state;
  }
}
