// src/App.js
import React, { useState } from "react";
import VideoCall from "./components/VideoCall";
import "./App.css";

function App() {
  const [isOperator, setIsOperator] = useState(false);
  const [inCall, setInCall] = useState(false);

  const joinAsUser = () => {
    setIsOperator(false);
    setInCall(true);
  };

  const joinAsOperator = () => {
    setIsOperator(true);
    setInCall(true);
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Agora 1-on-1 Video Call with Monitoring</h1>
      </header>
      {!inCall ? (
        <div className='join-buttons'>
          <button onClick={joinAsUser}>Join as User</button>
          <button onClick={joinAsOperator}>Join as Operator</button>
        </div>
      ) : (
        <VideoCall isOperator={isOperator} />
      )}
    </div>
  );
}

export default App;
