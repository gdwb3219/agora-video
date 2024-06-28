import React, { useEffect, useRef, useState } from "react";
import * as deepar from "deepar";
import AgoraRTC from "agora-rtc-sdk-ng";
import "../css/AGRtest.css";

const licenseKey =
  "21d20fe4ed7aa4bb19a8b9b7ec19f9d7cff4ddf90d05a2f45c2f47c09f8dc2a02ba8eac09adfe2dc";
const appId = "4dc42fcbafad47ad9ae33c9879a5db6c";
const token =
  "007eJxTYAg42yIieq1OLOKHyLO/d7ok1TRz0xtW5qdknE6b9GLDenkFBpOUZBOjtOSkxLTEFBPzxBTLxFRj42RLC3PLRNOUJLNkllN1aQ2BjAy55/oYGRkgEMRnYchNzMxjYAAAgEMgng==";
const channel = "main";

const effectList = [
  "effects/ray-ban-wayfarer.deepar",
  "effects/viking_helmet.deepar",
  "effects/MakeupLook.deepar",
  "effects/Split_View_Look.deepar",
  "effects/flower_face.deepar",
  "effects/Stallone.deepar",
  "effects/galaxy_background_web.deepar",
  "effects/Humanoid.deepar",
  "effects/Neon_Devil_Horns.deepar",
  "effects/Ping_Pong.deepar",
  "effects/Pixel_Hearts.deepar",
  "effects/Snail.deepar",
  "effects/Hope.deepar",
  "effects/Vendetta_Mask.deepar",
  "effects/Fire_Effect.deepar",
];

function AGRtest() {
  // Log the version. Just in case.
  console.log("Deepar version: " + deepar.version);
  console.log("Agora version: " + AgoraRTC.VERSION);

  // useRef 테스트
  const previewElementRef = useRef(null);
  // const localUIDref = useRef();
  const remoteStream = useRef();
  const remoteStreamsRef = useRef([]);
  const DeepARRef = useRef();

  // deep AR 초기화
  const [deepAR, setDeepAR] = useState(null);
  // deep AR ref를 이용한 초기화
  const deepRef = useRef();
  // Agora Engine 초기화

  // ******************************************************
  // state 관리
  // ******************************************************
  const agoraEngineRef = useRef(
    AgoraRTC.createClient({ mode: "rtc", codec: "vp9" })
  );

  const agoraEngine = agoraEngineRef.current;

  const [remoteStreams, setRemoteStreams] = useState({});

  // Deep AR 시작
  const deepARInit = async () => {
    console.log("444.===deepARInit 함수 실행");
    console.log(previewElementRef.current, "4-0.===Ref가 있는지 확인!!!");
    if (previewElementRef.current === null) {
      console.log("4-0.===Ref가 없어서 초기화 실패!!!");
      return;
    }
    try {
      console.log("4-1.===Try문 실행됨");
      DeepARRef.current = await deepar.initialize({
        licenseKey: licenseKey,
        // 아래 요소는 canvas 또는 video 태그일 것
        previewElement: previewElementRef.current,
        // previewElement:  undefined,
        effect: effectList[13],
        // rootPath: "/deepar-resources",
      });

      console.log("4-2.===deepar 초기화 완료!!!");

      // setDeepARstate(deepAREngine);
      return DeepARRef.current;
    } catch (error) {
      console.error("Failed to init Deep AR", error);
      // document.getElementById('loading-screen').style.display = 'none';
      // document.getElementById('permission-denied-screen').style.display =
      //   'block';
      return;
    }
  };

  // 비동기 함수 호출을 위한 useEffect 문
  useEffect(() => {
    // console.log("deepAREnginedeepAREnginedeepAREngine", deepAREngine);

    const handleUserJoined = async (user, mediaType) => {
      console.log("10.=== User Joined 이벤트 발생!");
      const remoteId = user.uid;

      // ref 추가 예제
      remoteStreamsRef.current.push(remoteId);
      console.log("11.=== remote Stream Ref에 push 로 추가!");
      console.log("Remote user 추가 완료!!!", remoteStreamsRef.current);
      // remote 화질 저하

      agoraEngine.setRemoteVideoStreamType(user.uid, 1);
      console.log("12.=== 화질저하", agoraEngine);
      // 유저의 미디어를 수신한다!!!
      await agoraEngine.subscribe(user, mediaType);
      console.log("13.=== agora Subscribe!!! 완료!!");

      user["type"] = mediaType;

      if (mediaType === "video") {
        console.log("14-1.=== user의 mediaType이 video 타입 인것으로 확인!");
        agoraEngine.setRemoteVideoStreamType(user.uid, 1);
        const remoteVideoTrack = user.videoTrack;
        const remotePlayerContainer = document.createElement("div");
        console.log("15.=== remote Player Container 생성!");
        remotePlayerContainer.id = user.uid.toString();
        remotePlayerContainer.textContent =
          "Remote user " + user.uid.toString();
        remotePlayerContainer.style.width = "640px";
        remotePlayerContainer.style.height = "480px";
        document.body.append(remotePlayerContainer);
        console.log("16.=== document에 태그 객체 append 완료!!!");
        console.log("17.=== 후후후 play 전");
        remoteVideoTrack.play(remotePlayerContainer);
        console.log("18.=== 후후후 play 후");
      } else if (mediaType === "audio") {
        console.log("14-2.=== user의 mediaType이 audio 타입 인것으로 확인!");
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack.play();
      } else {
        console.log("14-3.=== user의 mediaType이 미확인!");
      }
    };

    // **************************************************
    // **************************************************
    // 내 기준 방에 다른 유저가 나갔다.
    const handleUserLeft = async (user) => {
      console.log("user 삭제!!!", remoteStreams);
      const remoteId = user.uid;
      setRemoteStreams((prevStreams) => {
        const { [remoteId]: _, ...rest } = prevStreams; // ES6 destructuring을 사용하여 remoteId 항목을 제외한 나머지 항목만 선택
        return rest;
      });
      console.log("user 삭제 완료!!!", remoteStreams);
    };

    const handleJoined = async (user) => {
      console.log("999.=== User Joined:", user.uid);
      // 원격 사용자가 참가했을 때 해당 사용자를 상태로 관리
    };

    const joinAndDisplayLocalStream = async () => {
      const deepAREngine = await deepARInit();
      console.log(typeof deepAREngine, "666.=== deepAREngine 생성");

      agoraEngine.on("user-joined", handleJoined);
      agoraEngine.on("user-published", handleUserJoined);
      agoraEngine.on("user-left", handleUserLeft);

      console.log("222.===이벤트 핸들러 빼고 join함수 시작");
      // --------------------------------------------------------------
      // 6/25 state 리렌더링 방지
      // --------------------------------------------------------------

      // console.log(localUIDref.current, "444.===REF 값이 뭐냐");
      // console.log(DeepARRef.current, "555.=== 왜 없는데");

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

      const canvas = await deepAREngine.getCanvas();
      console.log("3-1.=== deepAREnging.getCanvas()실행!!!");
      const outputStream = canvas.captureStream(30);
      const videoTrack = outputStream.getVideoTracks()[0];
      console.log("3-1-1.===agora 실행 전");
      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      console.log("3-1-2.===agora 실행 후, 커스텀 실행 전");
      const localVideoTrack = await AgoraRTC.createCustomVideoTrack({
        mediaStreamTrack: videoTrack,
      });
      console.log(
        localAudioTrack,
        localVideoTrack,
        "3-2.=== deep 적용 로컬 트랙 생성!!!"
      );

      const localUID = await agoraEngine.join(appId, channel, token);
      // setLocalUID(localUID);
      // --------------------------------------------------------------
      // --------------------------------------------------------------
      // ref 테스트
      // --------------------------------------------------------------
      // localUIDref.current = localUID;
      console.log(localUID, "333.===localUIDlocalUID, 로컬 아이디 등록!!!");

      await agoraEngine.publish([localVideoTrack, localAudioTrack]);
      console.log("888.=== agora Publish 완료");

      // 기존 비디오
      // localTracks[1].play(`local-video-${localUID}`);

      // 내꺼 기준 트랙을 방송 시작!
      // await agoraEngine.publish([localTracks[0], localTracks[1]]);
    };

    const joinStream = async () => {
      console.log("111.===Join Stream 시작");
      await joinAndDisplayLocalStream();
    };

    joinStream();

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
      <div className='test'>hi</div>
      <div className='video-container'>
        <div
          ref={previewElementRef}
          id='local-video-456'
          style={{ width: "640px", height: "480px" }}
        >
          local
        </div>
        <div
          ref={remoteStream}
          id='remote-video-123'
          style={{ width: "320px", height: "240px" }}
        >
          remote
        </div>
      </div>
    </>
  );
}

export default AGRtest;
