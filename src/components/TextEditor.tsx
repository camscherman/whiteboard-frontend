import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import { getNotePadNotes } from '../redux/selectors';
import { postNotePadNote } from '../redux/actions';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import parse from 'html-react-parser';

// const QuillBase = <ReactQuill theme="snow" value={props.value} onChange={props.setValue} />;
const TextEdit = styled(ReactQuill)`
  height: 65px;
  border-radius: 5px;
`;

const EditorElement = styled.div`
  margin-top: auto;
  width: 620px;
  height: 100px;
  margin-bottom: 20px;
`;

const NotePadElement = styled.div`
  height: calc(100vh - 280px);
  margin-top: 115px;
  border: solid 1px #ccc;
  border-radius: 5px;
  width: 618px;
  display: flex;
  overflow: scroll;
  flex-direction: column-reverse;
  margin-bottom: auto;
  transition: 1s;
`;

const NoteElement = styled.div`
  margin: 5px;
  border-bottom: solid 1px #ccc;
  padding: 5px;
  text-align: left;
  font-size: 14px;
  font-family: 'Helvetica Neue';
  color: #363636;
`;

const NotePadDiv = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 400px;
`;

export default function TextEditor() {
  const [value, setValue] = useState('');
  const dispatch = useDispatch();
  const notes = useSelector(getNotePadNotes);

  const submitOnReturnKey = (e: KeyboardEvent): void => {
    if (e.keyCode === 13 && !e.shiftKey) {
      dispatch(postNotePadNote(value));
      setValue('');
    }
  };

  const noteElements = notes.map((item, index) => (
    <NoteElement key={index}>{parse(`${item}`)}</NoteElement>
  ));
  return (
    <NotePadDiv>
      <NotePadElement>{noteElements}</NotePadElement>
      <EditorElement>
        <TextEdit value={value} onChange={setValue} onKeyDown={submitOnReturnKey} />
      </EditorElement>
    </NotePadDiv>
  );
}
