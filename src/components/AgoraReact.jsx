import React, { useState } from 'react';
import { RemoteUser, useJoin } from 'agora-rtc-react';

const licenseKey =
  '454f2f58fb0318da7929459e8ec3425a39cdaf82061cfb02e899bb7341d22779c30e8aea9246718c';
const appId = '4dc42fcbafad47ad9ae33c9879a5db6c';
const token =
  '007eJxTYPA7/WJburXu+T0sixLbJW89XvvQrGfl9na9/fwbL4o2uz9XYDBJSTYxSktOSkxLTDExT0yxTEw1Nk62tDC3TDRNSTJLnrWvKq0hkJHBJWQlCyMDBIL4LAy5iZl5DAwA+WUh5Q==';
const channel = 'main';

function AgoraReact() {
  const [calling, setCalling] = useState(false); // Is calling
  useJoin({ appid: appId, channel: channel, token: token }, calling);
  return (
    <>
      <div className="room">
        <div className="join-room">
          <button
            className={`join-channel ${!appId || !channel ? 'disabled' : ''}`}
            disabled={!appId || !channel}
            onClick={() => setCalling(true)}
          >
            <span>Join Channel</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default AgoraReact;
