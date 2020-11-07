export const POST_NOTE = 'POST_NOTE';

export interface NotePadState {
  notes: Array<string>;
}

export interface PostNoteAction {
  type: typeof POST_NOTE;
  payload: string;
}

export type NotePadActions = PostNoteAction;
