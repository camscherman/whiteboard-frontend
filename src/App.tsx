import * as React from 'react';
import logo from './logo.svg';
import './App.css';

// import WhiteboardCanvas from "./components/WhiteboardCanvas";
import Whiteboard from './components/Whiteboard';
import VideoCanvas from './components/VideoCanvas';
import Sidebar from './components/SideBar';
import SideBarWrapper from './components/SideBarWrapper';
import BottomBarWrapper from './components/BottomBarWrapper';
import TextEditor from './components/TextEditor';
import Workspace from './components/Workspace';
import NavBar from './components/NavBar';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Workspace />
      {/* <Sidebar /> */}
      {/* <Whiteboard /> */}
    </div>
  );
}

export default App;
