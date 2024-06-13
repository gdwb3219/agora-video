// src/components/VideoCall.js
import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import '../css/VideoCall.css';

const APP_ID = '4dc42fcbafad47ad9ae33c9879a5db6c'; // Agora 콘솔에서 확인한 App ID
const CHANNEL_NAME = 'testChannel'; // 사용할 채널 이름
const TOKEN = null; // 필요하지 않으면 null

function VideoCall({ isOperator }) {
  console.log('나는 비디오 콜을 실행했지!!!', isOperator);
  const client = useRef(null);
  const localContainer = useRef(null);
  const remoteContainer = useRef(null);
  const [remoteUsers, setRemoteUsers] = useState([]);

  useEffect(() => {
    console.log('isOperator 와드111111', isOperator);
    const initAgora = async () => {
      console.log('isOperator 와드22222', isOperator);
      // Agora 클라이언트 초기화
      client.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      let UID = await client.current.join(APP_ID, CHANNEL_NAME, TOKEN, null);
      console.log(
        UID,
        'client UID 이려나???------------------------------------------------------------------------------'
      );

      if (!isOperator) {
        console.log('isOperator 와드33333', isOperator);
        // 로컬 오디오 및 비디오 트랙 생성 (관리자는 생략)
        const [microphoneTrack, cameraTrack] =
          await AgoraRTC.createMicrophoneAndCameraTracks();

        // 비디오 트랙을 재생 및 게시
        console.log(
          localContainer.current,
          'local Container UID 이려나???------------------------------------------------------------------------------'
        );
        cameraTrack.play(localContainer.current);
        await client.current.publish([microphoneTrack, cameraTrack]);
      }

      // 원격 사용자가 참가할 때 처리
      client.current.on('user-published', handleUserPublished);
      // 원격 사용자가 떠날 때 처리
      client.current.on('user-unpublished', handleUserUnpublished);
      //
      client.current.on('user-joined', handleJoined);
      //
      client.current.on('user-left', handleUserLeft);
    };

    initAgora();
    console.log('잘되고 있나 ###############################################');

    return () => {
      if (!isOperator) {
        client.current.localTracks.forEach((track) => track.stop());
      }
      client.current?.leave();
    };
  }, [isOperator]);

  const handleUserPublished = async (user, mediaType) => {
    await client.current.subscribe(user, mediaType);
    console.log('구독 성공!', user, mediaType);
    if (mediaType === 'video') {
      const remoteVideoContainer = document.createElement('div');
      remoteVideoContainer.id = user.uid.toString();
      // remoteVideoContainer.style.width = '400px';
      // remoteVideoContainer.style.height = '300px';
      remoteContainer.current.appendChild(remoteVideoContainer);
      user.videoTrack.play(remoteVideoContainer);
    }
    if (mediaType === 'audio') {
      user.audioTrack.play();
    }
  };

  const handleUserUnpublished = async (user) => {
    console.log('User Unpublished', user.uid);
    const remoteVideoContainer = document.getElementById(user.uid.toString());
    if (remoteVideoContainer) {
      remoteVideoContainer.remove();
    }
  };

  const handleJoined = async (user) => {
    console.log('User Joined:', user.uid);
    // 원격 사용자가 참가했을 때 해당 사용자를 상태로 관리
    setRemoteUsers((prevUsers) => [...prevUsers, user]);
  };

  const handleUserLeft = async (user) => {
    console.log('User Left', user.uid);
    setRemoteUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
    const remoteVideoContainer = document.getElementById(user.uid.toString());
    if (remoteVideoContainer) {
      remoteVideoContainer.remove();
    }
  };

  const handleLeave = async () => {
    // console.log(client.current.localTracks, "로컬 트랙이 지금 뭐가 있어?")
    client.current.localTracks.forEach((track) => track.stop());
    // await client.leave();
  };

  console.log('나는 비디오 콜을 실행했었지!!');

  return (
    <>
      <button onClick={handleLeave}>Leave</button>
      <div className="video-call">
        <div className="local-area">
          <p>Local Users</p>
          <div className="local-container">
            {!isOperator && (
              <div ref={localContainer} className="local-container"></div>
            )}
          </div>
        </div>
        <div className="remote-area">
          <p>Remote User</p>
          <div ref={remoteContainer} className="remote-container">
            {/* Render remote users */}
            {remoteUsers.map((user) => (
              <div
                key={user.uid}
                id={`user-${user.uid}`}
                style={{ width: '400px', height: '300px' }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoCall;
