// Prod 버전 Video 구현 정리
import React, { useEffect, useRef, useState } from "react";
import * as deepar from "deepar";
import AgoraRTC from "agora-rtc-sdk-ng";
import "../css/MonstVideo.css";

const licenseKey =
  "440ab2cf3bcab8d1e3166d945cc8e899bc345cc76e1855186f50b8fd013bc3566e3ab6c7b4ed75a0";
const appId = "4dc42fcbafad47ad9ae33c9879a5db6c";
const token =
  "007eJxTYDjIK8044z+P6dT6EIFv89Qmdu9tr/QLdllty6x9WHtemp0Cg0lKsolRWnJSYlpiiol5YoplYqqxcbKlhbllomlKkllyysvutIZARoYoGW4mRgYIBPFZGHITM/MYGACg/R0x";
const channel = "main";

const effectList = [
  "effects/Bomb.deepar",
  "effects/three-eye-monster.deepar",
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
  const [filterIndex, setFilterIndex] = useState(0);
  const [isSwitchingEffect, setIsSwitchingEffect] = useState(false);
  // UseRef
  const localElementRef = useRef(null);
  const remoteElementRef = useRef(null);
  const agoraEngineRef = useRef(
    AgoraRTC.createClient({ mode: "rtc", codec: "vp9" })
  );
  const DeepARRef = useRef(null);

  const agoraEngine = agoraEngineRef.current;

  // Deep AR 시작
  const deepARInit = async () => {
    console.log("222.===deepARInit 함수 실행");
    console.log(localElementRef.current, "333.===Ref가 있는지 확인!!!");
    console.log("444.=== 와드");
    if (!DeepARRef.current) {
      try {
        console.log("555.===Try문 실행됨");
        DeepARRef.current = await deepar.initialize({
          licenseKey: licenseKey,
          // 아래 요소는 canvas 또는 video 태그일 것
          previewElement: localElementRef.current,
          effect: effectList[filterIndex],
          // rootPath: "/deepar-resources",
        });
        console.log("666.===deepar 초기화 완료!!!");
        return DeepARRef.current;
      } catch (error) {
        console.error("Failed to init Deep AR", error);
      }
    } else {
      console.log("DeepAR is already initialized.");
      return DeepARRef.current;
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
      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      console.log(localVideoTrack, "12.=== deep 적용 로컬 트랙 생성!!!");

      const localUID = await agoraEngine.join(appId, channel, token);

      console.log(localUID, "13.===localUIDlocalUID, 로컬 아이디 등록!!!");

      await agoraEngine.publish([localVideoTrack, localAudioTrack]);
      console.log("14.=== agora Publish 완료");
    };

    const joinJustLocalStream = async () => {
      console.log("***.===관리자 Stream Join");
      agoraEngine.on("user-joined", handleJoined);
      agoraEngine.on("user-published", handleUserJoined);
      agoraEngine.on("user-left", handleUserLeft);

      const AdminID = await agoraEngine.join(appId, channel, token);
    };

    const joinStream = async () => {
      console.log("111.===Join Stream 시작");
      if (!isOperator) {
        // isOperator False 인 경우 (일반 유저)
        await joinAndDisplayLocalStream();
      } else {
        // 관리자인 경우
        await joinJustLocalStream();
      }
    };

    joinStream();

    return () => {
      agoraEngine.leave();
    };
  }, [isOperator, filterIndex]);

  const changeFilter = async () => {
    if (DeepARRef.current && !isSwitchingEffect) {
      setIsSwitchingEffect(true);
      try {
        const newIndex = (filterIndex + 1) % effectList.length;
        // 기존 필터를 유지하며 새로운 필터를 비동기적으로 적용
        await DeepARRef.current.switchEffect(effectList[newIndex], {
          replaceCurrent: true,
        });
        setFilterIndex(newIndex);
      } catch (error) {
        console.error("Failed to switch effect", error);
      } finally {
        setIsSwitchingEffect(false);
      }
    }
  };

  return (
    <>
      <div id='Videos-Container'>
        {!isOperator ? (
          <>
            <div
              id='local-video'
              ref={localElementRef}
              className='video-box'
              style={{ width: "50%" }}
            ></div>
            <div
              id='remote-video'
              ref={remoteElementRef}
              className='video-box'
              style={{ width: "50%" }}
            ></div>
          </>
        ) : (
          <div
            id='remote-video'
            ref={remoteElementRef}
            className='video-box'
            style={{ display: "flex", width: "100%" }}
          ></div>
        )}

        <button
          id='change-filter-button'
          onClick={changeFilter}
          disabled={isSwitchingEffect}
        >
          Change Filter
        </button>
      </div>
    </>
  );
}

export default MonstVideo;
