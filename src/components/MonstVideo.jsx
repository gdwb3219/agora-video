import React, { useEffect, useRef, useState } from "react";
import * as deepar from "deepar";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import "../css/MonstVideo.css";
import tokenData from "../token.json";

const licenseKey = tokenData.licenseKey;
const appId = tokenData.appId;
const channel = tokenData.channel;

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
  const [filterIndex, setFilterIndex] = useState(0);
  const [isSwitchingEffect, setIsSwitchingEffect] = useState(false);
  const [options, setOptions] = useState({
    appId: appId,
    channel: channel,
    role: "host",
  });
  const [token, setToken] = useState(null);

  const localElementRef = useRef(null);
  const remoteElementRef = useRef(null);
  const agoraEngineRef = useRef(
    AgoraRTC.createClient({ mode: "rtc", codec: "vp9" })
  );
  const DeepARRef = useRef(null);

  const agoraEngine = agoraEngineRef.current;

  const fetchToken = async (uid, channelName, tokenRole) => {
    try {
      const response = await axios.post(
        "http://ec2-3-107-70-86.ap-southeast-2.compute.amazonaws.com/generate-token",
        {
          uid: uid,
          channelName: channelName,
          role: tokenRole === "host" ? "publisher" : "subscriber",
        },
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      );
      return response.data.token;
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  const deepARInit = async () => {
    if (!DeepARRef.current) {
      try {
        DeepARRef.current = await deepar.initialize({
          licenseKey: licenseKey,
          previewElement: localElementRef.current,
          effect: effectList[filterIndex],
        });
        return DeepARRef.current;
      } catch (error) {
        console.error("Failed to init Deep AR", error);
      }
    } else {
      return DeepARRef.current;
    }
  };

  useEffect(() => {
    const handleUserJoined = async (user, mediaType) => {
      const remoteId = user.uid;
      await agoraEngine.subscribe(user, mediaType);
      if (mediaType === "video") {
        const remoteVideoTrack = user.videoTrack;
        const remotePlayerContainer = remoteElementRef.current;
        remoteVideoTrack.play(remotePlayerContainer);
      } else if (mediaType === "audio") {
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack.play();
      }
    };

    const handleUserLeft = async (user) => {
      console.log("User left:", user.uid);
    };

    const handleJoined = async (user) => {
      console.log("User Joined:", user.uid);
    };

    const joinAndDisplayLocalStream = async () => {
      const deepAREngine = await deepARInit();
      agoraEngine.on("user-joined", handleJoined);
      agoraEngine.on("user-published", handleUserJoined);
      agoraEngine.on("user-left", handleUserLeft);

      const canvas = await deepAREngine.getCanvas();
      const outputStream = canvas.captureStream(30);
      const videoTrack = outputStream.getVideoTracks()[0];
      const localVideoTrack = await AgoraRTC.createCustomVideoTrack({
        mediaStreamTrack: videoTrack,
      });
      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

      const uid = Math.floor(Math.random() * 10000); // UID 생성
      let token = await fetchToken(uid, options.channel, options.role);
      if (!token) {
        console.error("Failed to fetch token.");
        return;
      }

      const localUID = await agoraEngine.join(appId, channel, token, uid);
      await agoraEngine.publish([localVideoTrack, localAudioTrack]);
    };

    const joinJustLocalStream = async () => {
      agoraEngine.on("user-joined", handleJoined);
      agoraEngine.on("user-published", handleUserJoined);
      agoraEngine.on("user-left", handleUserLeft);
      const uid = Math.floor(Math.random() * 10000); // UID 생성
      let token = await fetchToken(uid, options.channel, options.role);
      if (!token) {
        console.error("Failed to fetch token.");
        return;
      }

      await agoraEngine.join(appId, options.channel, token, uid);
    };

    const joinStream = async () => {
      if (!isOperator) {
        await joinAndDisplayLocalStream();
      } else {
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
      <div id="Videos-Container">
        {!isOperator ? (
          <>
            <div
              id="local-video"
              ref={localElementRef}
              className="video-box"
              style={{ width: "50%" }}
            ></div>
            <div
              id="remote-video"
              ref={remoteElementRef}
              className="video-box"
              style={{ width: "50%" }}
            ></div>
          </>
        ) : (
          <div
            id="remote-video"
            ref={remoteElementRef}
            className="video-box"
            style={{ display: "flex", width: "100%" }}
          ></div>
        )}

        <button
          id="change-filter-button"
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
