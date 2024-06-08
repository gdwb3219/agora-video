import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import React, { useState } from "react";

// import "./styles.css";
// import logo from "./logo.png";
export const Basics = () => {
  
  // Define state variables
  const [calling, setCalling] = useState(false); // Is calling
  const [appId, setAppId] = useState(""); // Store the app ID state
  const [channel, setChannel] = useState(""); // Store the channel name state 
  const [token, setToken] = useState(""); // Store the token state 

  // Use app ID, channel name and token to join the channel.
  // Whether to join the channel depends on the status of calling
  useJoin({appid: appId, channel: channel, token: token ? token : null}, calling);

  return (
    <>
      <div className="room">
          <div className="join-room">
            {/* <img alt="agora-logo" className="logo" src={logo} /> */}
            <input
              onChange={e => setAppId(e.target.value)}
              placeholder="<Your app ID>"
              value={appId}
            />
            <input
              onChange={e => setChannel(e.target.value)}
              placeholder="<Your channel Name>"
              value={channel}
            />
            <input
              onChange={e => setToken(e.target.value)}
              placeholder="<Your token>"
              value={token}
            />

            <button
              className={`join-channel ${!appId || !channel ? "disabled" : ""}`}
              disabled={!appId || !channel}
              onClick={() => setCalling(true)}
            >
              <span>Join Channel</span>
            </button>
          </div>
      </div>
    </>
  );
};

export default Basics;
