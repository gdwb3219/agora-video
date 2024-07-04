// Prod 버전 Video 구현 정리
import React, { useEffect, useRef } from "react";
import * as deepar from "deepar";
import AgoraRTC from "agora-rtc-sdk-ng";
import "../css/MonstVideo.css";

const licenseKey =
  "21d20fe4ed7aa4bb19a8b9b7ec19f9d7cff4ddf90d05a2f45c2f47c09f8dc2a02ba8eac09adfe2dc";
const appId = "4dc42fcbafad47ad9ae33c9879a5db6c";
const token =
  "007eJxTYPg1Me7hjLlySzY6iD/Vbqs68/AVF5N/3MurvW/X6VY+25mlwGCSkmxilJaclJiWmGJinphimZhqbJxsaWFumWiakmSWLNHWltYQyMhQc3wJCyMDBIL4LAy5iZl5DAwAMXwiqw==";
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

function MonstVideo({ isOperator }) {
  // Log the version. Just in case.
  console.log("Deepar version: " + deepar.version);
  console.log("Agora version: " + AgoraRTC.VERSION);

  // UseRef
  const localElementRef = useRef(null);
  const remoteElementRef = useRef(null);
  const agoraEngineRef = useRef(
    AgoraRTC.createClient({ mode: "rtc", codec: "vp9" })
  );
  const DeepARRef = useRef();

  const agoraEngine = agoraEngineRef.current;

  // Deep AR 시작
  const deepARInit = async () => {
    console.log("222.===deepARInit 함수 실행");
    console.log(localElementRef.current, "333.===Ref가 있는지 확인!!!");
    console.log("444.=== 와드");

    try {
      console.log("555.===Try문 실행됨");
      DeepARRef.current = await deepar.initialize({
        licenseKey: licenseKey,
        // 아래 요소는 canvas 또는 video 태그일 것
        previewElement: localElementRef.current,
        effect: effectList[13],
        // rootPath: "/deepar-resources",
      });

      console.log("666.===deepar 초기화 완료!!!");

      return DeepARRef.current;
    } catch (error) {
      console.error("Failed to init Deep AR", error);
      return;
    }
  };

  // ******************************************************
  // useEffect 비동기 메인 함수
  // ******************************************************

  useEffect(() => {
    // console.log("deepAREnginedeepAREnginedeepAREngine", deepAREngine);

    const handleUserJoined = async (user, mediaType) => {
      console.log("16.=== User Joined 이벤트 발생!");
      const remoteId = user.uid;

      console.log("17.=== remote Stream Ref에 push 로 추가!");
      // remote 화질 저하

      // 유저의 미디어를 수신한다!!!
      await agoraEngine.subscribe(user, mediaType);
      console.log("18.=== agora Subscribe!!! 완료!!");

      if (mediaType === "video") {
        console.log("19-1.=== user의 mediaType이 video 타입 인것으로 확인!");
        agoraEngine.setRemoteVideoStreamType(user.uid, 1);
        const remoteVideoTrack = user.videoTrack;
        const remotePlayerContainer = remoteElementRef.current;
        console.log("20-1.=== remote Player Container 생성!");
        console.log("21-1.=== document에 태그 객체 append 완료!!!");
        console.log("22-1.=== 후후후 play 전");
        remoteVideoTrack.play(remotePlayerContainer);
        console.log("23-1.=== 후후후 play 후");
      } else if (mediaType === "audio") {
        console.log("19-2.=== user의 mediaType이 audio 타입 인것으로 확인!");
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack.play();
      } else {
        console.log("19-3.=== user의 mediaType이 미확인!");
      }
    };

    // **************************************************
    // 내 기준 방에 다른 유저가 나갔다.
    const handleUserLeft = async (user) => {
      console.log("24.===user 삭제!!!");
    };

    const handleJoined = async (user) => {
      console.log("15.=== User Joined:", user.uid);
      // 원격 사용자가 참가했을 때 해당 사용자를 상태로 관리
    };

    const joinAndDisplayLocalStream = async () => {
      const deepAREngine = await deepARInit();
      console.log(typeof deepAREngine, "777.=== deepAREngine 생성");

      agoraEngine.on("user-joined", handleJoined);
      agoraEngine.on("user-published", handleUserJoined);
      agoraEngine.on("user-left", handleUserLeft);

      console.log("888.===이벤트 핸들러 빼고 join함수 시작");

      const canvas = await deepAREngine.getCanvas();
      console.log("999.=== deepAREnging.getCanvas()실행!!!");
      const outputStream = canvas.captureStream(30);
      const videoTrack = outputStream.getVideoTracks()[0];
      console.log("10.===agora 실행 전");
      console.log("11.===agora 실행 후, 커스텀 실행 전");
      const localVideoTrack = await AgoraRTC.createCustomVideoTrack({
        mediaStreamTrack: videoTrack,
      });
      console.log(localVideoTrack, "12.=== deep 적용 로컬 트랙 생성!!!");

      const localUID = await agoraEngine.join(appId, channel, token);

      console.log(localUID, "13.===localUIDlocalUID, 로컬 아이디 등록!!!");

      await agoraEngine.publish([localVideoTrack]);
      console.log("14.=== agora Publish 완료");
    };

    const joinStream = async () => {
      console.log("111.===Join Stream 시작");
      if (!isOperator) {
        await joinAndDisplayLocalStream();
      }
    };

    joinStream();

    return () => {
      agoraEngine.leave();
    };
  }, [isOperator]);

  return (
    <>
      <div id='Videos-Container'>
        <div id='local-video' ref={localElementRef} className='video-box'></div>
        <div
          id='remote-video'
          ref={remoteElementRef}
          className='video-box'
        ></div>
      </div>
    </>
  );
}

export default MonstVideo;
