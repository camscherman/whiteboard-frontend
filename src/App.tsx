import * as React from 'react';
import logo from './logo.svg';
import './App.css';

// import WhiteboardCanvas from "./components/WhiteboardCanvas";
import Whiteboard from './components/Whiteboard';
import VideoCanvas from './components/VideoCanvas';
import Sidebar from './components/SideBar';
import NavBar from './components/NavBar';
import MainWrapper from './components/MainWrapper';

function App() {
  return (
    <div className="App">
      <NavBar />
      <VideoCanvas />
      <MainWrapper />
      {/* <Sidebar /> */}
      {/* <Whiteboard /> */}
    </div>
  );
}

export default App;
