// src/components/VideoCall.js
import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import './VideoCall.css';

const APP_ID = '4dc42fcbafad47ad9ae33c9879a5db6c'; // Agora에서 받은 App ID
const TOKEN = 'Your Agora Token'; // Agora에서 받은 Token (또는 null)
const CHANNEL = 'Your Channel Name'; // 사용할 채널 이름

const VideoCall = ({ isOperator }) => {
  const [localTracks, setLocalTracks] = useState([]);
  const [remoteUsers, setRemoteUsers] = useState({});
  const client = useRef(null);
  const localContainer = useRef(null);
  const remoteContainer = useRef(null);

  useEffect(() => {
    const init = async () => {
      client.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

      await client.current.join(APP_ID, CHANNEL, TOKEN, null);

      if (!isOperator) {
        const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalTracks([microphoneTrack, cameraTrack]);

        localContainer.current.innerHTML = '';
        localContainer.current.appendChild(cameraTrack.play(localContainer.current));

        await client.current.publish([microphoneTrack, cameraTrack]);
      }

      client.current.on('user-published', async (user, mediaType) => {
        await client.current.subscribe(user, mediaType);
        if (mediaType === 'video') {
          const remoteVideoContainer = document.createElement('div');
          remoteVideoContainer.id = user.uid.toString();
          remoteVideoContainer.style.width = '400px';
          remoteVideoContainer.style.height = '300px';
          remoteContainer.current.appendChild(remoteVideoContainer);
          user.videoTrack.play(remoteVideoContainer);
        }
        if (mediaType === 'audio') {
          user.audioTrack.play();
        }
      });

      client.current.on('user-unpublished', (user) => {
        const remoteVideoContainer = document.getElementById(user.uid.toString());
        if (remoteVideoContainer) {
          remoteVideoContainer.remove();
        }
      });
    };

    init();

    return () => {
      localTracks.forEach((track) => track.close());
      client.current?.leave();
    };
  }, [isOperator, localTracks]);

  return (
    <div>
      {!isOperator && <div ref={localContainer} className="local-container"></div>}
      <div ref={remoteContainer} className="remote-container"></div>
    </div>
  );
};

export default VideoCall;
