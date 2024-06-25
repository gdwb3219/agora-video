import React, { useEffect, useRef, useState } from 'react';
import * as deepar from 'deepar';
import AgoraRTC from 'agora-rtc-sdk-ng';
import '../css/AGRtest.css';

const licenseKey =
  '454f2f58fb0318da7929459e8ec3425a39cdaf82061cfb02e899bb7341d22779c30e8aea9246718c';
const appId = '4dc42fcbafad47ad9ae33c9879a5db6c';
const token =
  '007eJxTYPA7/WJburXu+T0sixLbJW89XvvQrGfl9na9/fwbL4o2uz9XYDBJSTYxSktOSkxLTDExT0yxTEw1Nk62tDC3TDRNSTJLnrWvKq0hkJHBJWQlCyMDBIL4LAy5iZl5DAwA+WUh5Q==';
const channel = 'main';

const effectList = [
  'effects/ray-ban-wayfarer.deepar',
  'effects/viking_helmet.deepar',
  'effects/MakeupLook.deepar',
  'effects/Split_View_Look.deepar',
  'effects/flower_face.deepar',
  'effects/Stallone.deepar',
  'effects/galaxy_background_web.deepar',
  'effects/Humanoid.deepar',
  'effects/Neon_Devil_Horns.deepar',
  'effects/Ping_Pong.deepar',
  'effects/Pixel_Hearts.deepar',
  'effects/Snail.deepar',
  'effects/Hope.deepar',
  'effects/Vendetta_Mask.deepar',
  'effects/Fire_Effect.deepar',
];

function AGRtest() {
  // Log the version. Just in case.
  console.log('Deepar version: ' + deepar.version);
  console.log('Agora version: ' + AgoraRTC.VERSION);

  // useRef 테스트
  const previewElementRef = useRef(null);
  const localUIDref = useRef();
  const remoteStreamsRef = useRef([]);
  const DeepARRef = useRef(null);

  // deep AR 초기화
  const [deepAR, setDeepAR] = useState(null);
  // deep AR ref를 이용한 초기화
  const deepRef = useRef();
  // Agora Engine 초기화

  // ******************************************************
  // state 관리
  // ******************************************************
  const [agoraEngine, setAgoraEngine] = useState(
    new AgoraRTC.createClient({ mode: 'rtc', codec: 'vp9' })
  );
  const [remoteStreams, setRemoteStreams] = useState({});
  const [mainStreamId, setMainStreamId] = useState();
  const [deepARstate, setDeepARstate] = useState();

  // ******************************************************
  const [localUID, setLocalUID] = useState('');

  // const [remoteAudioTrack, setRemoteAudioTrack] = useState();
  // const [remoteVideoTrack, setRemoteVideoTrack] = useState();
  const [remoteId, setRemoteId] = useState();

  // useEffect 내부에서 DeepAR 초기화 및 실행
  useEffect(() => {}, []);

  console.log(deepAR, 'deepAR, 됐나?');

  // 비동기 함수 호출을 위한 useEffect 문
  useEffect(() => {
    console.log('STAY');

    // Deep AR 시작
    const deepARInit = async () => {
      console.log(`${process.env.PUBLIC_URL}/effects`, '엔진 부릉부릉');
      try {
        console.log('Try문 실행됨');
        const deepAREngine = await deepar.initialize({
          licenseKey: licenseKey,
          // 아래 요소는 canvas 또는 video 태그일 것
          // previewElement: document.querySelector('#deepar-screen'),
          previewElement: previewElementRef.current,
          effect: effectList[13],
          // rootPath: `${process.env.PUBLIC_URL}/effects`,
        });
        console.log(deepAREngine, '엔진 부릉부릉');
        setDeepARstate(deepAREngine);
        // console.log('deep ar TRY문', deepAR);
        DeepARRef.current = deepAREngine;
        console.log(DeepARRef.current, '만들었냐???');
      } catch (error) {
        console.error('Failed to init Deep AR', error);
        // document.getElementById('loading-screen').style.display = 'none';
        // document.getElementById('permission-denied-screen').style.display =
        //   'block';
        return;
      }
    };
    deepARInit();
    console.log(DeepARRef.current, '만들었냐???222');
    // console.log(deepAR, 'deepAR 만들었다');

    // useState를 이용한 deep AR 초기화
    // const initializeDeepAR = async () => {
    //   try {
    //     const deepAREngine = await deepar.initialize({
    //       licenseKey: licenseKey,
    //       // 아래 요소는 canvas 또는 video 태그일 것
    //       previewElement: document.querySelector('#deepar-screen'),
    //       effect: effectList[0],
    //       rootPath: './deepar-resources',
    //     });
    //     console.log('deep ar TRY문');
    //   } catch (error) {
    //     console.error(error);
    //     // document.getElementById('loading-screen').style.display = 'none';
    //     // document.getElementById('permission-denied-screen').style.display =
    //     //   'block';
    //     return;
    //   }
    // };

    // ---------------------------------------------------------------------------
    // agoraEngine 유저가 접속했을 때,
    // agoraEngine.on('user-published', async (user, mediaType) => {
    //   console.log('뭐가 되고 있긴 한건가');
    //   await agoraEngine.subscribe(user, mediaType);
    //   user['type'] = mediaType;
    //   const remoteId = user.uid;

    //   if (mediaType == 'video') {
    //     const remoteAudioTrack = user.audioTrack;
    //     const remoteVideoTrack = user.videoTrack;
    //     // 첫번째 remote는 main stream으로 할당
    //     if (Object.keys(remoteStreams).length === 0) {
    //       console.log(remoteStreams, '뭐가 어떻게 되고 있는거냐');
    //       setRemoteStreams((prevStreams) => ({
    //         ...prevStreams,
    //         [remoteId]: user,
    //       }));
    //       setMainStreamId(remoteId);
    //       remoteVideoTrack.play('full-screen-video');
    //     } else {
    //       // mini view에 추가
    //       agoraEngine.setRemoteVideoStreamType(user.uid, 1);
    //       addRemoteStreamMiniView(user);
    //     }
    //   }
    //   if (mediaType == 'audio') {
    //     const remoteAudioTrack = user.audioTrack;
    //     // Play the remote audio track. No need to pass any DOM element.
    //     remoteAudioTrack.play();
    //   }
    //   console.log('Subscribe remote stream successfully: ' + remoteId);
    // });

    // ---------------------------------------------------------------------------

    console.log(deepAR, '외않되?');

    // **************************************************
    // **************************************************
    // 내 기준 방에 다른 유저가 들어왔다.
    const handleUserJoined = async (user, mediaType) => {
      console.log('user 추가!!!', remoteStreamsRef.current);
      console.log('UID 추가할껀데, 그 전에 정보좀 보자', user, mediaType);
      const remoteId = user.uid;

      // ref 추가 예제
      remoteStreamsRef.current.push(remoteId);
      // console.log('REF USER 추가!!!', remoteStreamsRef.current);

      // setRemoteStreams((prevStreams) => ({
      //   ...prevStreams,
      //   [remoteId]: user,
      // }));
      console.log('user 추가 완료!!!', remoteStreamsRef.current);
      // 유저의 미디어를 수신한다!!!
      await agoraEngine.subscribe(user, mediaType);

      user['type'] = mediaType;

      if (mediaType == 'video') {
      }

      const remoteAudioTrack = user.audioTrack;
      const remoteVideoTrack = user.videoTrack;

      remoteVideoTrack.play(`remote-video-${remoteId}`);
    };

    // **************************************************
    // **************************************************
    // 유저 삭제
    const handleUserLeft = async (user) => {
      console.log('user 삭제!!!', remoteStreams);
      const remoteId = user.uid;
      setRemoteStreams((prevStreams) => {
        const { [remoteId]: _, ...rest } = prevStreams; // ES6 destructuring을 사용하여 remoteId 항목을 제외한 나머지 항목만 선택
        return rest;
      });
      console.log('user 삭제 완료!!!', remoteStreams);
    };

    const joinAndDisplayLocalStream = async () => {
      agoraEngine.on('user-published', handleUserJoined);
      agoraEngine.on('user-left', handleUserLeft);

      console.log('222.이벤트 핸들러 빼고 join함수 시작');
      // --------------------------------------------------------------
      // 6/25 state 리렌더링 방지
      // --------------------------------------------------------------
      const localUID = await agoraEngine.join(appId, channel, token);
      // setLocalUID(localUID);
      // --------------------------------------------------------------
      // --------------------------------------------------------------
      // ref 테스트
      // --------------------------------------------------------------
      localUIDref.current = localUID;
      console.log(localUID, '333.localUIDlocalUID, 로컬 아이디 등록!!!');
      console.log(localUIDref.current, '444.REF 값이 뭐냐');
      console.log(DeepARRef.current, '555. 왜 없는데');

      // --------------------------------------------------------------
      // --------------------------------------------------------------
      // ref로 deep ar init 후 get Canvas 시도
      // --------------------------------------------------------------
      // --------------------------------------------------------------
      // const canvas = DeepARRef.current.getCanvas();
      // console.log(canvas, '555.CANVASCANVASCANVAS');
      // const outputStream = canvas.captureStream(30);
      // const videoTrack = outputStream.getVideoTracks()[0];
      // const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // const localVideoTrack = AgoraRTC.createCustomVideoTrack({
      //   mediaStreamTrack: videoTrack,
      // });

      // await agoraEngine.publish([localVideoTrack, localAudioTrack]);
      // --------------------------------------------------------------

      // Deep AR Try
      // try {
      // console.log('TRY실행');
      // const deepAR = await deepar.initialize({
      //   licenseKey: licenseKey,
      //   // 아래 요소는 canvas 또는 video 태그일 것
      //   previewElement: previewElementRef.current,
      //   effect: effectList[13],
      //   rootPath: './deepar-resources',
      // });
      // } catch (error) {
      //   console.error('Failed to initialize DeepAR API', error);
      //   return;
      // }

      // const canvas = deepAR.getCanvas();
      // console.log(canvas, 'CANVAS!?');

      // 기존 비디오
      const localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
      localTracks[1].play(`local-video-${localUID}`);

      // 내꺼 기준 트랙을 방송 시작!
      await agoraEngine.publish([localTracks[0], localTracks[1]]);
    };
    // Agora Join 실행2
    const joinStream = async () => {
      console.log('111.Join Stream 시작');
      await joinAndDisplayLocalStream();
    };

    joinStream();

    // **************************************************
    // **************************************************

    // Agora Join 실행
    // const joinChannel = async () => {
    //   await agoraEngine.join(appId, channel, token);

    //   // const canvas = deepAR.getCanvas();
    //   // const outputStream = canvas.captureStream(30);
    //   // const videoTrack = outputStream.getVideoTracks()[0];

    //   console.log('AgoraEnging, Join 되었다!!!');

    //   const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    //   console.log('Local Audio');
    //   const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    //   console.log('Local Video');
    //   // console.log('Local Video');
    //   // const localVideoTrack = AgoraRTC.createCustomVideoTrack({
    //   //   mediaStreamTrack: videoTrack,
    //   // });

    //   agoraEngine.publish([localVideoTrack, localAudioTrack]);
    //   console.log('PUBL?');
    //   // .play(previewElementRef);
    // };

    // joinChannel();

    // const canvas = deepAREngine.getCanvas();

    return () => {
      agoraEngine.leave();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // const addRemoteStreamMiniView = (user) => {
  //   // streanId에 해당 user id 추가
  //   const streamId = user.uid;
  //   // append the remote stream template to #remote-streams
  //   // 태그 추가
  //   setRemoteStreams((prevStreams) => ({
  //     ...prevStreams,
  //     [streamId]: user,
  //   }));

  //   // $('#remote-streams').append(
  //   //   $('<div/>', {
  //   //     id: streamId + '_container',
  //   //     class: 'remote-stream-container col',
  //   //   }).append(
  //   //     $('<div/>', { id: 'agora_remote_' + streamId, class: 'remote-video' })
  //   //   )
  //   // );
  //   // // agora_remote_theid 라는 id를 가진 div에 video 플레이
  //   // user.videoTrack.play('agora_remote_' + streamId);
  //   // // remote Streams (리스트)에 현재 streamID및 user 추가
  //   // remoteStreams[streamId] = user;
  // };
  // ---------------------------------------------------------------------------

  return (
    <>
      <div className="test">hi</div>
      <div className="video-container">
        <div
          ref={previewElementRef}
          id={`local-video-${localUIDref.current}`}
          style={{ width: '640px', height: '480px' }}
        >
          local
        </div>
        <div
          id={`remote-video-${remoteId}`}
          style={{ width: '320px', height: '240px' }}
        >
          remote
        </div>
      </div>
    </>
  );
}

export default AGRtest;
